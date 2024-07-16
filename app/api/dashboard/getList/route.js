import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import list_model from "@/app/models/list";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');

    const cookiestore = cookies();
    const token = cookiestore.get('jwtoken');
    const value = token.value;

    try {
        const decoded = jwt.verify(value, process.env.ACCESS_TOKEN_SECRET);
        const user = decoded.user;
        const userEmail = user.email;

        await connectDB();

        const list = await list_model.findOne({ email: userEmail, title });

        if (!list) {
            return NextResponse.json({
                success: false,
                msg: 'List not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            items: list.items
        }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            msg: 'Error fetching the list'
        }, { status: 400 });
    }
}
