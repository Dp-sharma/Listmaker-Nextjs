import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import user_model from "@/app/models/user";
import list_model from "@/app/models/list";
import connectDB from "@/app/lib/mongodb";
import jwt from 'jsonwebtoken'

export async function GET(request){
    
    const cookiestore = cookies();
    const token = cookiestore.get('jwtoken');
    const value = token.value
    console.log('this is the value of token from route',value);
    try {
        const decoded = jwt.verify(value, process.env.ACCESS_TOKEN_SECRET);
        const user = decoded.user;
        // console.log("Decoded user:", user);
        console.log(user.email);
        // Connect to the database if necessary
        await connectDB();

        // Find all lists associated with the user's email
        const userLists = await list_model.find({ email: user.email }).exec();

        if (!userLists.length) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Extract titles from the user's lists
        const titles = userLists.map(list => list.title);
        
        console.log("User's lists titles:", titles);

        return NextResponse.json({
            success: true,
            data: titles
        }, { status: 200 });
      } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
               msg: 'Error'
           },{ status : 400});
      }
    }