import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useApp } from "../../context/AppContext";
import { getAllSets, saveSet } from "../../db/indexedDb";

const EMPTY_FORM = {
    sizing: "",
    date: new Date().toISOString().split("T")[0],
    setNo: "",
    yarnCount: "",
    yarnCategory: "",
    bagName: "",
    bagsUsed: 0,
    weightPerBag: 0,
    setWeight: 0,
    totalCuts: 0,
    totalBeams: 0,
    ends: "",
    tl: "",
    ifValue: "",
};

const useSetForm = () => {
    const { suggestions } = useApp();
    const [form, setForm] = useState(EMPTY_FORM);
    const [beams, setBeams] = useState([]);
    const [allSets, setAllSets] = useState([]);
    const [openingBalance, setOpeningBalance] = useState(0);
    const [errors, setErrors] = useState({});
    const [saved, setSaved] = useState(false);


    useEffect(() => {
        getAllSets().then((data) => setAllSets(Array.isArray(data) ? data : []));
    }, []);

    useEffect(() => {
        if (!form.sizing) {
            setOpeningBalance(0);
            return;
        }
        const lastEntry = [...allSets]
            .filter((s) => s.sizing === form.sizing)
            .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        setOpeningBalance(lastEntry?.closingBalance || 0);
    }, [form.sizing, allSets]);

    // Calculations
    const issued = form.bagsUsed * form.weightPerBag;
    const closingBalance = openingBalance + issued - (form.setWeight || 0);
    const totalCutsEntered = beams.reduce((a, b) => a + (+b.cut || 0), 0);

    // Handlers
    const updateField = (id, value, type) => {
        setForm((p) => ({ ...p, [id]: type === "number" ? Number(value) : value }));
    };

    const buildBeams = (count) => {
        const n = Number(count) || 0;
        setBeams(Array.from({ length: n }, (_, i) => ({
            beamNo: i + 1, pipeNo: "", cut: 0, weaver: "Goddown", slipNo: "", date: form.date,
        })));
    };

    const updateBeam = (index, key, value) => {
        setBeams((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [key]: key === "weaver" && !value ? "Goddown" : value };
            return copy;
        });
    };

    const validate = () => {
        const e = {};
        if (!form.sizing) e.sizing = "Sizing required";
        if (!form.setNo) e.setNo = "Set No required";
        if (form.totalBeams <= 0) e.totalBeams = "Beams count required";
        if (totalCutsEntered !== form.totalCuts) e.totalCuts = "Cuts mismatch";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        const payload = {
            _id: uuidv4(),
            ...form,
            openingBalance, issued, closingBalance,
            beamDetails: beams.map(b => ({ ...b, weaver: b.weaver || "Goddown" }))
        };
        await saveSet(payload);
        setSaved(true);
        setForm(EMPTY_FORM);
        setBeams([]);
        setTimeout(() => setSaved(false), 3000);
    };

    return {
        form, beams, suggestions, openingBalance, errors, saved,
        issued, closingBalance, totalCutsEntered,
        updateField, buildBeams, updateBeam, handleSave
    };
}

export { useSetForm };