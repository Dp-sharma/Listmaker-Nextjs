import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import user_model from "@/app/models/user";
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
export async function POST(req){
  const {name,email,password} = await req.json();
  try {
    await connectDB();
    const isExists =  await user_model.findOne({email});
        if(isExists){
          return NextResponse.json({
            success: false,
            msg: 'Email Already Exists!'
          }, { status: 400 });  
        }
    const hashpassword = await bcrypt.hash(password, 10);
    await user_model.create({name,email,password: hashpassword});
    return NextResponse.json({ msg:'Data has been added' })
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