import { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";

export function usePipeInventory() {
    const { sets, pipeHistory } = useApp();
    const [selectedPipeNo, setSelectedPipeNo] = useState(null);

    // Flatten all beams from all sets
    const allBeams = useMemo(() => {
        return sets.flatMap(s =>
            (s.beamDetails || []).map(b => ({
                ...b,
                setId: s._id,
                setNo: s.setNo,
                sizing: s.sizing
            }))
        );
    }, [sets]);

    // View 1: Pipes in Godown
    const godownPipes = useMemo(() =>
        allBeams.filter(b => b.isGodown && b.pipeNo),
        [allBeams]);

    // View 2: Pending with Weaver
    const pendingPipes = useMemo(() =>
        allBeams.filter(b => !b.isGodown && b.pipeNo && b.weaver),
        [allBeams]);

    // View 3: Filter History for a specific pipe
    const specificPipeHistory = useMemo(() => {
        if (!selectedPipeNo) return [];
        return pipeHistory.filter(h => h.pipeNo === selectedPipeNo);
    }, [selectedPipeNo, pipeHistory]);

    return {
        godownPipes,
        pendingPipes,
        pipeHistory,
        selectedPipeNo,
        setSelectedPipeNo,
        specificPipeHistory
    };
}