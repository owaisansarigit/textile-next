'use client'
import { useEffect, useState, useMemo } from 'react'
import { api } from '../utils_frontend/apiCalls'

export function useClothBook() {
    /* ================= API DATA ================= */
    const [cloths, setCloths] = useState([])
    const [weavers, setWeavers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    /* ================= FORM STATE ================= */
    const [show, setShow] = useState(false)
    const [ledgerId, setLedgerId] = useState('')
    const [entries, setEntries] = useState([])

    /* ================= FETCH DATA ================= */
    useEffect(() => {
        let active = true

        const fetchWeavers = api.get('/api/wledgers')
        const fetchCloths = api.get('/api/cloths')

        Promise.all([fetchWeavers, fetchCloths])
            .then(([weaverRes, clothRes]) => {
                if (!active) return
                setWeavers(weaverRes.data)
                setCloths(clothRes.data)
            })
            .catch(err => {
                console.error('Fetch error:', err)
                if (active) setError(err)
            })
            .finally(() => {
                if (active) setLoading(false)
            })

        return () => { active = false }
    }, [])

    /* ================= ADD ROW ================= */
    const addRow = () => {
        setEntries(prev => [
            ...prev,
            {
                clothId: '',
                quantity: '',
                yarnWeight: 0,
                weightPerPcs: 0,
            }
        ])
    }

    /* ================= UPDATE ROW ================= */
    const updateRow = (index, field, value) => {
        setEntries(prev => {
            const updated = [...prev]
            updated[index][field] = value

            const row = updated[index]
            const cloth = cloths.find(c => c._id === row.clothId)

            /* when cloth selected → capture weightPerPcs */
            if (field === 'clothId' && cloth) {
                row.weightPerPcs = cloth.weightPerPcs
            }

            /* auto yarn calculation */
            if (cloth && row.quantity > 0) {
                row.yarnWeight =
                    Number(row.quantity) * Number(row.weightPerPcs)
            } else {
                row.yarnWeight = 0
            }

            return updated
        })
    }

    /* ================= YARN SUMMARY ================= */
    const yarnSummary = useMemo(() => {
        const map = {}

        entries.forEach(row => {
            const cloth = cloths.find(c => c._id === row.clothId)
            if (!cloth || row.yarnWeight <= 0) return

            const key = `${cloth.yarnCategory}-${cloth.yarnCount}`

            if (!map[key]) {
                map[key] = {
                    yarnCategory: cloth.yarnCategory,
                    yarnCount: cloth.yarnCount,
                    quantityKg: 0,
                }
            }

            map[key].quantityKg += row.yarnWeight
        })

        return Object.values(map)
    }, [entries, cloths])

    /* ================= FINAL PAYLOAD ================= */
    const payload = useMemo(() => ({
        wLedgerId: ledgerId,
        cloths: entries.map(e => ({
            cloth: e.clothId,
            quantity: Number(e.quantity),
            yarnWeight: Number(e.yarnWeight.toFixed(3)),
        })),
        yarnWeight: yarnSummary.map(y => ({
            yarnCategory: y.yarnCategory,
            yarnCount: y.yarnCount,
            quantityKg: Number(y.quantityKg.toFixed(3)),
        })),
    }), [ledgerId, entries, yarnSummary])

    /* ================= RETURN ================= */
    return {
        /* api */
        cloths,
        weavers,
        loading,
        error,

        /* ui */
        show,
        setShow,

        /* form */
        ledgerId,
        setLedgerId,
        entries,
        addRow,
        updateRow,

        /* computed */
        yarnSummary,
        payload,
    }
}
