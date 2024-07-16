import connectDB from "@/app/lib/mongodb";
import bcrypt from 'bcrypt';
import user_model from "@/app/models/user";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

const generateAccessToken = async (user) => {
    console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET);  // Log the secret key
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error('ACCESS_TOKEN_SECRET is not defined');
    }
    // const myuser = user.toString()
    // console.log(myuser);
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10h" });
    return token;
};

export async function POST(req){
  const {email,password} = await req.json();
  try {
    await connectDB();
    const user =  await user_model.findOne({email});
        if(!user){
          return NextResponse.json({
            success: false,
            msg: 'User with this email Not Exists!'
          }, { status: 400 });  
        }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch){
        return NextResponse.json({
            success: false,
            msg: 'Password is Incorrect!'
        },{ status : 400});
    }
    console.log('Generating the token');
    const accessToken = await generateAccessToken({ user:user });
    console.log(accessToken);
    
    const response = NextResponse.json({ msg: 'User has been logged in', accessToken });
    response.headers.set('Set-Cookie', `jwtoken=${accessToken}; Path=/; HttpOnly; Max-Age=2340000000000000000000`);

    return response;
  } catch (error) {
    console.error(error); //Log the actual error for debugging
    if (error instanceof mongoose.Error.ValidationError) {
      let errorList = [];
        for(let e in error.errors){
          errorList.push(error.errors[e].message);
        }
        console.log(errorList);
        return NextResponse.json({msg:errorList}, { status: 400 });
        
    }else{
      return NextResponse.json({msg:['Unable to send message']}, { status: 500 });
    }
  }
  // console.log(name);
  // console.log(email);
  // console.log(password);
}