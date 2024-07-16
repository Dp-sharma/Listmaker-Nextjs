'use client'
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { NextResponse } from "next/server"
import React from 'react'
import '@/components/Login.css'
const Login = () => {
    
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState(null);
    const router = useRouter();

    
    
    const handleSubmit = async (e)=>{
      e.preventDefault();
      
      console.log(email)
      console.log(password)
      try {
        const res = await fetch('api/login',{
        method :'POST',
        headers:{
          'Content-type':'application/json'
        },
        body:JSON.stringify({
          
          email,
          password
        })
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        throw new Error(errorData.msg || 'Something Went Wrong');

      }
      console.log('Data has been send to Database');
      // Redirect to the "my list" page
      router.push('/mylist');
      } catch (error) {
        setError(error.message);
            console.error('Error:', error);
      }
      
    }
  return (
    <div className="cont">
      <form onSubmit={handleSubmit} className="login_form">
        <div className="login_input_div">
            <label htmlFor="email">Email</label>
            <input type="text" placeholder='Enter your Email' id='email' onChange={(e)=>{setEmail(e.target.value)}} value={email}/>
        </div>
        <div className="login_input_div">
            <label htmlFor="password">Password</label>
            <input type="text" placeholder='Enter your Password' id='password' onChange={(e)=>{setPassword(e.target.value)}} value={password}/>
        </div>
        <button type='submit' className="submit_btn">Sumit</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  )
}

export default Login
