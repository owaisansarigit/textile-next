import { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";

export function usePipeReceive() {
    const { sets, receivePipeAction, suggestions } = useApp();
    const [form, setForm] = useState({ pipeNo: "", weaver: "", slipNo: "", date: "", note: "" });

    // Get all beams currently with weavers (Active Pipes)
    const activePipes = useMemo(() => {
        return sets.flatMap(s => s.beamDetails
            ?.filter(b => !b.isGodown && b.pipeNo)
            .map(b => ({ ...b, setId: s._id, setNo: s.setNo })) || []);
    }, [sets]);

    // Logic: Auto-fetch weaver when pipe is entered
    const handlePipeChange = (pNo) => {
        const match = activePipes.find(p => p.pipeNo === pNo);
        setForm(prev => ({ ...prev, pipeNo: pNo, weaver: match ? match.weaver : prev.weaver, selectedBeam: match }));
    };

    // Logic: Filter pipes when weaver is selected
    const pipesForWeaver = useMemo(() => {
        return activePipes.filter(p => p.weaver === form.weaver);
    }, [form.weaver, activePipes]);

    const submit = async (e) => {
        e.preventDefault();
        if (!form.selectedBeam) return alert("Select a valid active pipe");
        await receivePipeAction(form.selectedBeam.setId, form.selectedBeam.beamNo, form);
        setForm({ pipeNo: "", weaver: "", slipNo: "", date: "", note: "" });
        alert("Pipe Received!");
    };

    return { form, setForm, suggestions, activePipes, pipesForWeaver, handlePipeChange, submit };
}