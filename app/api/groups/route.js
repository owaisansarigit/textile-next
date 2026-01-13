import { NextResponse } from 'next/server';
import { connectDB } from "../../lib/db/mongo";
import { Group } from '../../lib/db/models/groupModel';


export async function GET(request) {
    try {
        const data = await Group.find()

        return NextResponse.json({ success: true, data, });

    } catch (error) {
        console.error('Error fetching groups:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

// export async function GET(request) {
//     try {
//         await connectDB();

//         const { searchParams } = new URL(request.url);
//         const page = parseInt(searchParams.get('page') || '1');
//         const limit = parseInt(searchParams.get('limit') || '10');
//         const status = searchParams.get('status');
//         const search = searchParams.get('search');
//         const skip = (page - 1) * limit;


//         let query = {};

//         if (status) {
//             query.status = status;
//         }

//         if (search) {
//             query.$or = [
//                 { name: { $regex: search, $options: 'i' } },
//                 { description: { $regex: search, $options: 'i' } }
//             ];
//         }

//         const [groups, total] = await Promise.all([
//             Group.find(query)
//                 .sort({ createdAt: -1 })
//                 .skip(skip)
//                 .limit(limit)
//                 .lean(),
//             Group.countDocuments(query)
//         ]);

//         return NextResponse.json({
//             success: true,
//             data: groups,
//             pagination: {
//                 page,
//                 limit,
//                 total,
//                 pages: Math.ceil(total / limit)
//             }
//         });

//     } catch (error) {
//         console.error('Error fetching groups:', error);
//         return NextResponse.json(
//             { success: false, message: error.message },
//             { status: 500 }
//         );
//     }
// }

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const existingGroup = await Group.findOne({ name: body.name });
        if (existingGroup) {
            return NextResponse.json(
                { success: false, message: 'Group with this name already exists' },
                { status: 400 }
            );
        }
        const group = await Group.create(body);
        return NextResponse.json({
            success: true,
            data: group,
            message: 'Group created successfully'
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating group:', error);

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