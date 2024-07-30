import React, { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios'
import toast from 'react-hot-toast'
import { FaUserCircle } from "react-icons/fa";

const CheckEmailPage = () => {
  const [data, setData] =useState({
   
    email: "",

   
  })

const navigate = useNavigate()

  const handleOnChange=(e)=>{
       const {name, value} =e.target
       setData((prev)=>{

        return{
          ...prev,
          [name]: value,
 
        }
       })
  }
   
 const handleOnSubmit=async(e)=>{

  e.stopPropagation()
  e.preventDefault()

  const URL =`${process.env.REACT_APP_BACKEND_URL}/api/email`
  try{
    const response =await axios.post(URL,data)
    

    toast.success(response.data.message)
    navigate('/password',{
      state: response?.data?.data
     });

    if(response.data.success){
        setData({
         email: ""
     })
     

    }

  } catch(error){
    toast.error(error?.response?.data?.message)
     //console.log("error", error)
  }

 // console.log("data:" ,data)
 }
  return (
    <div className='mt-5'>
    <div className='bg-white mx-2 w-full max-w-md rounded overflow-hidden p-4 md:mx-auto'>
      <div className='w-fit mb-2 mx-auto'>
      <FaUserCircle size={30} />

      </div>
      <h3 className='text-center'>Welcome to ChatApp</h3>
      <form className='grid gap-3 mt-5' onSubmit={handleOnSubmit}>
     
        <div className='flex flex-col gap-2'>
          <label htmlFor='email'>Email:</label>
          <input
          type='email'
          id='email'
          name='email'
          placeholder='Enter your Email'
          className='bg-slate-100 px-2 py-1 focus:outline-primary'
          value={data.email}
          onChange={handleOnChange}
          required
          />
        </div>
        <button className='bg-primary text-lg px-4 py-1 rounded mt-2 font-bold leading-relaxed tracking-wide hover:bg-secondary'>
  Let's start</button>
     
      </form>
      <p className='my-3 text-center'> New User ? <Link to={'/register'} className='hover:text-primary font-semibold'>Register</Link></p>
    </div>
  </div>
  )
}

export default CheckEmailPage