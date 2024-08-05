import React, { useState } from 'react'
import { MdClose } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const [data, setData] =useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
   
  })
const [uploadPhoto, setuploadPhoto] =useState('')
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
  const handleUploadProfile=async(e)=>{
      const file =e.target.files[0]

      const uploadPhoto =await uploadFile(file)
      //console.log("uploadPhoto" ,uploadPhoto)


      setuploadPhoto(file)
      setData((prev)=>{
        return{
          ...prev,
          profile_pic: uploadPhoto?.url
        }
      })
  }
  const handleclearUploadPhoto=(e)=>{
    setuploadPhoto(null)
    e.preventDefault()
    e.stopPropagation()
  }
 const handleOnSubmit=async(e)=>{

  e.stopPropagation()
  e.preventDefault()

  const URL =`${process.env.REACT_APP_BACKEND_URL}/api/register`
  try{
    const response =await axios.post(URL,data)
    //console.log("response", response);

    toast.success(response.data.message)

    if(response.data.success){
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
         
        })
        navigate('/email');

    }

  } catch(error){
    toast.error(error.response?.data?.message)
     //console.log("error", error)
  }

  console.log("data:" ,data)
 }

  return (
    <div className='mt-5'>
      <div className='bg-white mx-2 w-full max-w-md rounded overflow-hidden p-4 md:mx-auto'>
        <h3>Welcome to ChatApp</h3>
        <form className='grid gap-3 mt-5' onSubmit={handleOnSubmit}>
          <div className='flex flex-col gap-2'>
            <label htmlFor='name'>Name:</label>
            <input
            type='text'
            id='name'
            name='name'
            placeholder='Enter your name'
            className='bg-slate-100 px-2 py-1 focus:outline-primary'
            value={data.name}
            onChange={handleOnChange}
            required
            />
          </div>
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
          <div className='flex flex-col gap-2'>
            <label htmlFor='password'>Password:</label>
            <input
            type='password'
            id='password'
            name='password'
            placeholder='Enter your password'
            className='bg-slate-100 px-2 py-1 focus:outline-primary'
            value={data.password}
            onChange={handleOnChange}
            required
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='profile_pic'>Photo:
            
            <div className='h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer'>
              <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'> 
              {
                uploadPhoto?.name ? uploadPhoto?.name: 'Upload Profile Photo'
              }
              </p>
              {uploadPhoto?.name &&(
            <button className='text-lg ml-2 hover:text-red-600' onClick={handleclearUploadPhoto}> <MdClose/> </button>
              )}
             
            </div>
            </label>
            
            <input
            type='file'
            id='profile_pic'
            name='profile_pic'
            placeholder='Enter your password'
            className='bg-slate-100 px-2 py-1 focus:outline-primary hidden'
            onChange={handleUploadProfile}
            />
          </div>
  <button className='bg-primary text-lg px-4 py-1 rounded mt-2 font-bold leading-relaxed tracking-wide hover:bg-secondary'>
    Register</button>
       
        </form>
        <p className='my-3 text-center'> Already have an account ? <Link to={'/email'} className='hover:text-primary font-semibold'>Login</Link></p>
      </div>
    </div>
  )
}

export default RegisterPage