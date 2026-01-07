import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import { Group } from '@/lib/db/models';

// GET single group by ID
export async function GET(request, { params }) {
    try {
        await connectDB();

        const group = await Group.findById(params.id);

        if (!group) {
            return NextResponse.json(
                { success: false, message: 'Group not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: group
        });

    } catch (error) {
        console.error('Error fetching group:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// PUT update group
export async function PUT(request, { params }) {
    try {
        await connectDB();

        const body = await request.json();

        // Check if name is being updated and if it already exists
        if (body.name) {
            const existingGroup = await Group.findOne({
                name: body.name,
                _id: { $ne: params.id }
            });

            if (existingGroup) {
                return NextResponse.json(
                    { success: false, message: 'Group with this name already exists' },
                    { status: 400 }
                );
            }
        }

        const group = await Group.findByIdAndUpdate(
            params.id,
            body,
            { new: true, runValidators: true }
        );

        if (!group) {
            return NextResponse.json(
                { success: false, message: 'Group not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: group,
            message: 'Group updated successfully'
        });

    } catch (error) {
        console.error('Error updating group:', error);

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

// DELETE group
export async function DELETE(request, { params }) {
    try {
        await connectDB();

        const group = await Group.findById(params.id);

        if (!group) {
            return NextResponse.json(
                { success: false, message: 'Group not found' },
                { status: 404 }
            );
        }

        // Check if group has any wLedgers
        const { WLedger } = await import('@/lib/db/models');
        const hasWLedgers = await WLedger.countDocuments({ group: params.id });

        if (hasWLedgers > 0) {
            return NextResponse.json(
                { success: false, message: 'Cannot delete group with existing weaving ledgers' },
                { status: 400 }
            );
        }

        await Group.findByIdAndDelete(params.id);

        return NextResponse.json({
            success: true,
            message: 'Group deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting group:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}