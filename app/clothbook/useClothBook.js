'use client'
import { useEffect, useState, useMemo } from 'react'
import { api } from '../utils_frontend/apiCalls'

export function useClothBook() {
    const [cloths, setCloths] = useState([])
    const [weavers, setWeavers] = useState([])
    const [clothBooks, setClothBooks] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [ledgerId, setLedgerId] = useState('')
    const [entries, setEntries] = useState([])

    /* ===== DATE STATE (for report) ===== */
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().slice(0, 10) // yyyy-mm-dd
    )

    /* ================= INITIAL FETCH ================= */
    useEffect(() => {
        let active = true

        Promise.all([
            api.get('/api/wledgers'),
            api.get('/api/cloths'),
            api.get(`/api/clothbook?date=${selectedDate}`)
        ])
            .then(([weaverRes, clothRes, clothBookRes]) => {
                if (!active) return
                setWeavers(weaverRes.data)
                setCloths(clothRes.data)
                setClothBooks(clothBookRes.data)
            })
            .catch(err => {
                console.error(err)
                if (active) setError(err)
            })
            .finally(() => {
                if (active) setLoading(false)
            })

        return () => { active = false }
    }, [])

    /* ================= REFRESH CLOTHBOOK (BY DATE) ================= */
    const refetchClothBooks = async (date) => {
        try {
            setLoading(true)
            const res = await api.get(`/api/clothbook?date=${date}`)
            setClothBooks(res.data)
        } catch (err) {
            console.error(err)
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    /* ================= ADD ROW ================= */
    const addRow = () => {
        setEntries(prev => [
            ...prev,
            { clothId: '', quantity: '', yarnWeight: 0, weightPerPcs: 0 }
        ])
    }

    /* ================= UPDATE ROW ================= */
    const updateRow = (index, field, value) => {
        setEntries(prev => {
            const updated = [...prev]
            const row = updated[index]

            row[field] = value

            const cloth = cloths.find(c => c._id === row.clothId)

            if (field === 'clothId' && cloth) {
                row.weightPerPcs = cloth.weightPerPcs
            }

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

    /* ================= PAYLOAD ================= */
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

    return {
        /* master data */
        cloths,
        weavers,

        /* clothbook data */
        clothBooks,
        selectedDate,
        setSelectedDate,
        refetchClothBooks,

        /* form */
        ledgerId,
        setLedgerId,
        entries,
        addRow,
        updateRow,

        /* computed */
        yarnSummary,
        payload,

        /* ui */
        loading,
        error,
    }
}
