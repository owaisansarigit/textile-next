import { NextResponse } from 'next/server'
import { connectDB } from "../../lib/db/connect"
import { ClothBook } from '../../lib/db/models/clothBookModel'

export async function GET(request) {
    try {
        await connectDB()

        const { searchParams } = new URL(request.url)
        const date = searchParams.get('date')

        let filter = {}

        if (date) {
            const start = new Date(date)
            start.setHours(0, 0, 0, 0)

            const end = new Date(date)
            end.setHours(23, 59, 59, 999)

            filter.createdAt = { $gte: start, $lte: end }
        }

        const data = await ClothBook
            .find(filter)
            .populate('wLedgerId')
            .populate('cloths.cloth')
            .sort({ createdAt: -1 })

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        )
    }
}

export async function POST(request) {
    try {
        await connectDB()
        const body = await request.json()

        const clothBook = await ClothBook.create(body)

        return NextResponse.json({
            success: true,
            data: clothBook,
            message: 'ClothBook entered successfully'
        }, { status: 201 })

    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        )
    }
}
