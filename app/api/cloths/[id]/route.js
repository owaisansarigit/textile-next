import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db/connect';
import { Cloth } from '../../../lib/db/models/clothModel';

export async function GET(request, { params }) {
    try {
        await connectDB();
        const cloth = await Cloth.findById(params.id);

        if (!cloth) {
            return NextResponse.json(
                { success: false, message: 'Cloth not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: cloth
        });

    } catch (error) {
        console.error('Error fetching cloth:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// PUT update cloth
export async function PUT(request, { params }) {
    try {
        await connectDB();

        const body = await request.json();

        // Check if name is being updated and if it already exists
        if (body.name) {
            const existingCloth = await Cloth.findOne({
                name: body.name,
                _id: { $ne: params.id }
            });

            if (existingCloth) {
                return NextResponse.json(
                    { success: false, message: 'Cloth with this name already exists' },
                    { status: 400 }
                );
            }
        }

        const cloth = await Cloth.findByIdAndUpdate(
            params.id,
            body,
            { new: true, runValidators: true }
        );

        if (!cloth) {
            return NextResponse.json(
                { success: false, message: 'Cloth not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: cloth,
            message: 'Cloth updated successfully'
        });

    } catch (error) {
        console.error('Error updating cloth:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return NextResponse.json(
                { success: false, message: 'Validation failed', errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// DELETE cloth
export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const cloth = await Cloth.findById(id);
        if (!cloth) {
            return NextResponse.json(
                { success: false, message: 'Cloth not found' },
                { status: 404 }
            );
        }

        const { WLedger } = await import('../../../lib/db/models/wLedgerModel');
        const hasWLedgers = await WLedger.countDocuments({ cloth: id });

        if (hasWLedgers > 0) {
            return NextResponse.json(
                { success: false, message: 'Cannot delete cloth with existing weaving ledgers' },
                { status: 400 }
            );
        }

        await Cloth.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: 'Cloth deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting cloth:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}