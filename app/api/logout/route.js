import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Blacklist from "@/app/models/blacklist"; // Adjust the import path as necessary

export async function GET(req) {
    try {
        const cookieHeader = req.headers.get('cookie');
        const cookies = cookieHeader ? Object.fromEntries(cookieHeader.split('; ').map(c => c.split('='))) : {};
        const token = cookies['jwtoken'];

        if (token) {
            // Save the token to the blacklist model
            await Blacklist.create({ token });
            
            // Create a response and delete the cookie
            const response = NextResponse.json({ msg: 'Success achieved' });
            response.headers.set('Set-Cookie', `jwtoken=; Path=/; HttpOnly; Max-Age=0`);

            return response;
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
