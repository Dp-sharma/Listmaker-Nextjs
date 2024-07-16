import connectDB from '@/app/lib/mongodb';
import list_model from '@/app/models/list';
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
    // if (req.method !== 'POST') {
    //     return res.status(405).json({ msg: 'Method not allowed' });
    // }
    const cookiestore = cookies();
    const token = cookiestore.get('jwtoken');
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const value = token.value
    try {
        const decoded = jwt.verify(value, process.env.ACCESS_TOKEN_SECRET);
        const user = decoded.user;
        console.log("Decoded user:", user);
        const { title, item } = await request.json();
        if (!title || !item) {
            return NextResponse.json({ msg: 'Title and item are required' },{status:400});
        }
        await connectDB();

        const list = await list_model.findOne({ email: user.email, title });
        if (!list) {
            return NextResponse.json({ msg: 'List not found' },{status:400});
        }

        list.items.push(item);
        await list.save();

        return NextResponse.json({ msg: 'Item added successfully', item },{status:200});
    } catch (error) {
        console.log(error);
    }
}
