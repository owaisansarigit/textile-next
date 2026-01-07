// import { useState, useMemo } from "react";
// import { useApp } from "../../context/AppContext";

// export function useSetsDashboard() {
//     const { sets = [], loadingSets, suggestions, updateSetBeam } = useApp();
//     const [viewMode, setViewMode] = useState("sets");
//     const [setsPage, setSetsPage] = useState(1);
//     const [beamsPage, setBeamsPage] = useState(1);
//     const itemsPerPage = 10;

//     const [isEditModalOpen, setEditModalOpen] = useState(false);
//     const [editingBeam, setEditingBeam] = useState(null);
//     const [isViewModalOpen, setViewModalOpen] = useState(false);
//     const [viewingSet, setViewingSet] = useState(null);

//     const allBeams = useMemo(() => sets.flatMap(s => s.beamDetails?.map(b => ({ ...b, parentSetId: s._id, parentSetNo: s.setNo, fullSetRef: s })) || []), [sets]);
//     const goddownBeams = useMemo(() => allBeams.filter(b => b.weaver === "Goddown"), [allBeams]);

//     const handleEditClick = (beam) => { setEditingBeam(beam); setEditModalOpen(true); };
//     const handleShowClick = (beam) => { setViewingSet(beam.fullSetRef || beam); setViewModalOpen(true); };

//     const handleSaveBeam = async (formData) => {
//         const success = await updateSetBeam(editingBeam.parentSetId, editingBeam.beamNo, Object.fromEntries(formData));
//         if (success) setEditModalOpen(false);
//     };

//     return {
//         sets, loadingSets, suggestions, viewMode, setViewMode,
//         currentSets: sets.slice((setsPage - 1) * itemsPerPage, setsPage * itemsPerPage),
//         currentBeams: (viewMode === "allBeams" ? allBeams : goddownBeams).slice((beamsPage - 1) * itemsPerPage, beamsPage * itemsPerPage),
//         allBeams, goddownBeams, setsPage, setSetsPage, beamsPage, setBeamsPage, itemsPerPage,
//         isEditModalOpen, setEditModalOpen, editingBeam, handleEditClick, handleSaveBeam,
//         isViewModalOpen, setViewModalOpen, viewingSet, setViewingSet, handleShowClick
//     };
// }

import { useState, useMemo } from "react";

/* ---------------- DUMMY DATA ---------------- */

const dummySets = Array.from({ length: 25 }).map((_, i) => ({
    _id: `set_${i + 1}`,
    setNo: i + 1,
    beamDetails: Array.from({ length: 3 }).map((_, j) => ({
        beamNo: j + 1,
        weaver: j % 2 === 0 ? "Goddown" : "External",
        length: 120 + j * 10,
        quality: "A",
    })),
}));

/* -------------- DUMMY CONTEXT --------------- */

function useDummyApp() {
    const [sets, setSets] = useState(dummySets);
    const [loadingSets] = useState(false);
    const [suggestions] = useState(["Cotton", "Silk", "Poly"]);

    const updateSetBeam = async (setId, beamNo, payload) => {
        setSets(prev =>
            prev.map(set =>
                set._id !== setId
                    ? set
                    : {
                        ...set,
                        beamDetails: set.beamDetails.map(b =>
                            b.beamNo === beamNo ? { ...b, ...payload } : b
                        ),
                    }
            )
        );
        return true; // simulate success
    };

    return { sets, loadingSets, suggestions, updateSetBeam };
}

/* -------------- MAIN HOOK ------------------- */

export function useSetsDashboard() {
    const { sets = [], loadingSets, suggestions, updateSetBeam } = useDummyApp();

    const [viewMode, setViewMode] = useState("sets");
    const [setsPage, setSetsPage] = useState(1);
    const [beamsPage, setBeamsPage] = useState(1);
    const itemsPerPage = 10;

    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editingBeam, setEditingBeam] = useState(null);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [viewingSet, setViewingSet] = useState(null);

    const allBeams = useMemo(
        () =>
            sets.flatMap(s =>
                s.beamDetails?.map(b => ({
                    ...b,
                    parentSetId: s._id,
                    parentSetNo: s.setNo,
                    fullSetRef: s,
                })) || []
            ),
        [sets]
    );

    const goddownBeams = useMemo(
        () => allBeams.filter(b => b.weaver === "Goddown"),
        [allBeams]
    );

    const handleEditClick = beam => {
        setEditingBeam(beam);
        setEditModalOpen(true);
    };

    const handleShowClick = beam => {
        setViewingSet(beam.fullSetRef || beam);
        setViewModalOpen(true);
    };

    const handleSaveBeam = async formData => {
        const success = await updateSetBeam(
            editingBeam.parentSetId,
            editingBeam.beamNo,
            Object.fromEntries(formData)
        );
        if (success) setEditModalOpen(false);
    };

    return {
        sets,
        loadingSets,
        suggestions,
        viewMode,
        setViewMode,

        currentSets: sets.slice(
            (setsPage - 1) * itemsPerPage,
            setsPage * itemsPerPage
        ),

        currentBeams: (viewMode === "allBeams" ? allBeams : goddownBeams).slice(
            (beamsPage - 1) * itemsPerPage,
            beamsPage * itemsPerPage
        ),

        allBeams,
        goddownBeams,

        setsPage,
        setSetsPage,
        beamsPage,
        setBeamsPage,
        itemsPerPage,

        isEditModalOpen,
        setEditModalOpen,
        editingBeam,
        handleEditClick,
        handleSaveBeam,

        isViewModalOpen,
        setViewModalOpen,
        viewingSet,
        setViewingSet,
        handleShowClick,
    };
}
