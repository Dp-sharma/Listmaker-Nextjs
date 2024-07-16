import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import user_model from "@/app/models/user";
import connectDB from "@/app/lib/mongodb";
import jwt from 'jsonwebtoken'
export async function GET(request){
    // const email = req.headers.get('x-email');
    const cookiestore = cookies();
    const token = cookiestore.get('jwtoken');
    const value = token.value
    console.log('this is the value of token from route',value);
    try {
        const decoded = jwt.verify(value, process.env.ACCESS_TOKEN_SECRET);
        const user = decoded.user;
        console.log("Decoded user:", user);
        // Connect to the database if necessary
        await connectDB();

        // Retrieve additional user information from the database
        const userInfo = await user_model.findOne({ email: user.email });
        if (!userInfo) {
            return NextResponse.redirect(new URL('/login', request.url));
            // return NextResponse.json({
            //     success: false,
            //     msg: 'You are not a valid user'
            // }, { status: 404 });
        }
        console.log('You are a valid user');
        return NextResponse.json({
            success: true,
            data: userInfo
        }, { status: 200 });
      } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
               msg: 'Error'
           },{ status : 400});
      }
        // return NextResponse.json({
        //       success: true,
        //          msg: 'Token value taken'
        //      },{ status : 200});
            }
    
//         console.log(email)
//         return NextResponse.json({
//             success: true,
//             msg: 'toke founded'
//         },{ status : 200});
//     }else{return NextResponse.json({
//         success: false,
//         msg: 'No token found'
//     },{ status : 400});}
    
