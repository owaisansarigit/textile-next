'use client'
import { useEffect, useState } from 'react'
import { api } from '../utils_frontend/apiCalls'

export function useCloths(initialValue = []) {
    const [cloths, setCloths] = useState(initialValue)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCloths = async () => {
            try {
                const data = await api.get('/api/cloths')
                setCloths(data.data)
            } catch (err) {
                console.error('Error fetching cloths data:', err)
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchCloths()
    }, [])

    return { cloths, loading, error }
}
