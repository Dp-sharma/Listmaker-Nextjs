import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import Blacklist from "@/app/models/blacklist"; // Adjust the import path as necessary

export async function GET() {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('jwtoken')?.value;
        
        if (token) {
            // Save the token to the blacklist model
            await Blacklist.create({ token });
            
            // Remove the token from the cookies
            cookieStore.delete('jwtoken');
            
            return NextResponse.json({ msg: 'Success achieved' });
        } else {
            return NextResponse.json({ msg: 'Token not found' }, { status: 400 });
        }
    } catch (error) {
        console.error(error); // Log the actual error for debugging
        
        if (error instanceof mongoose.Error.ValidationError) {
            let errorList = [];
            for (let e in error.errors) {
                errorList.push(error.errors[e].message);
            }
            console.log(errorList);
            return NextResponse.json({ msg: errorList }, { status: 400 });
        } else {
            return NextResponse.json({ msg: ['Unable to send message'] }, { status: 500 });
        }
    }
}
