import connectDB from "@/app/lib/mongodb";
import list_model from "@/app/models/list";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { cookies } from "next/headers";

export async function POST(req){
    const cookiestore = cookies();
    const token = cookiestore.get('jwtoken');
    const {title} = await req.json();
    try {
        const decoded = jwt.verify(token.value, process.env.ACCESS_TOKEN_SECRET);
        const userEmail = decoded.user.email;
        await connectDB();
        const del = await list_model.findOneAndDelete({email:userEmail,title:title})
        if (del) {
            console.log('List has been deleted');
            return NextResponse.json({
                success:'true',
            msg:'List has been Deleted',
            })
        }
        return NextResponse.json({
            success:'false',
            msg:'There is some error'

        },{status:400})
    } catch (error) {
        console.log(error);
    }
}