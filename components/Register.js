'use client'
import { useState } from "react"
import React from 'react'
import '@/components/Register.css'
const Register = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState(null);
    const handleSubmit = async (e)=>{
      e.preventDefault();
      console.log(name)
      console.log(email)
      console.log(password)
      try {
        const res = await fetch('api/register',{
        method :'POST',
        headers:{
          'Content-type':'application/json'
        },
        body:JSON.stringify({
          name,
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
      } catch (error) {
        setError(error.message);
            console.error('Error:', error);
      }
      
    }
  return (
    <div className="cont">
      <form onSubmit={handleSubmit} className="register_form">
        <div className="register_input_div">
            <label htmlFor="name">Name</label>
            <input type="text" placeholder='Enter your name' id='name' onChange={(e)=>{setName(e.target.value)}} value={name}/>
        </div>
        <div className="register_input_div">
            <label htmlFor="email">Email</label>
            <input type="text" placeholder='Enter your Email' id='email' onChange={(e)=>{setEmail(e.target.value)}} value={email}/>
        </div>
        <div className="register_input_div">
            <label htmlFor="password">Password</label>
            <input type="text" placeholder='Enter your Password' id='password' onChange={(e)=>{setPassword(e.target.value)}} value={password}/>
        </div>
        <button type='submit'>Sumit</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  )
}

export default Register
