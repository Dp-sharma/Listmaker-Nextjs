import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import connectDB from "@/app/lib/mongodb";
import list_model from "@/app/models/list";
export async function POST(req){
    const {title} = await req.json();
    const cookiestore = cookies();
    const token = cookiestore.get('jwtoken');
    const value = token.value
    console.log('this is the value of token from route',value);
    try {
        const decoded = jwt.verify(value, process.env.ACCESS_TOKEN_SECRET);
        const user = decoded.user;
        const userEmail = user.email
        console.log(user.email);
        await connectDB();
        console.log(title); 
        const title_check = await list_model.findOne({title}).exec();
        console.log(title_check);
        if (!title_check) {
            await list_model.create({email: userEmail,title});
            return NextResponse.json({ msg:'List has been added' })
        }
        if (title_check) {
            return NextResponse.json({
                success: false,
                msg: 'Title Already Occupied'
              }, { status: 400 });
        }
        return NextResponse.json({
            success: false,
            msg: 'Title Already Occupied'
          }, { status: 400 }); 

    } catch (error) {
        console.log(error);
    }
}