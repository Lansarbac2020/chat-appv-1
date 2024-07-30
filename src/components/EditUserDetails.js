import React, { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar'
import uploadFile from '../helpers/uploadFile'
import Dividers from './Dividers'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'

const EditUserDetails = ({onClose, user}) => {
  const [data, setData] = useState({
    name: user?.user,
    profile_pic: user?.profile_pic
  })
  const uploadPhotoRef = useRef ()
  const dispatch =useDispatch();
  useEffect(()=>{
    setData((prev)=>{
      return{
        ...prev,
        ...user
      }
    })
  },[user])
  const handleOnChange=(e)=>{
     const{name, value} =e.target
     setData((prev)=>{
      return{
        ...prev,
        [name]: value,
      }
     })
  }
  const handleOpenUploadPhoto=(e)=>{
    e.preventDefault()
    e.stopPropagation()
    uploadPhotoRef.current.click()
  }
  const handleUploadPhoto=async(e)=>{
    const file =e.target.files[0]

    const uploadPhoto =await uploadFile(file)
    //console.log("uploadPhoto" ,uploadPhoto)


    
    setData((prev)=>{
      return{
        ...prev,
        profile_pic: uploadPhoto?.url
      }
    })
}
const handleSubmit=async(e)=>{
  e.preventDefault()
  e.stopPropagation();
  try{
    const URL =`${process.env.REACT_APP_BACKEND_URL}/api/update-user`

    const response = await axios({
      method: 'POST',
      url: URL,
      data: data,
      withCredentials: true,
      
    })
    toast.success(response.data.message)

    if(response.data.success){
       dispatch(setUser(response.data.data))
       onClose()
    }
  } catch(error){
      toast.error(error.response?.data?.message)
  }
}
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-70 flex justify-center items-center'>
      <div className='bg-white p-4 rounded w-full max-w-sm'>
   <h2 className='font-semibold'>Profile Details</h2>
   <p className='text-sm'>Edit user details</p>
   <form className='grid gap-3 mt-3' onSubmit={handleSubmit} >
    <div className='flex flex-col gap-1'>
      <label htmlFor='name'>Name: </label>
      <input type='text' id='name' name='name' value={data?.name} onChange={handleOnChange}
      className='w-full py-1 px-2 focus:outline-primary border-[0.5px]'
      />
    </div>

    <div>
      <div>
        Photo :
      </div>
      <div className='my-1 flex items-center gap-5'>
        <Avatar
        width={40}
        height={40}
        imageUrl={data?.profile_pic}
        name={data?.name}
        />
        <label htmlFor='profile_pic'>
        <button className='font-semibold' onClick={handleOpenUploadPhoto}>Change Photo</button>
        <input
        type='file'
        id='profile_pic'
        className='hidden'
        onChange={handleUploadPhoto}
        ref={uploadPhotoRef}
        />
        </label>
      </div>
      
    </div>

  <Dividers/>
    <div className='flex ml-auto gap-2 w-fit'>
      <button  onClick={onClose} className='border border-primary px-4 py-1  text-primary rounded-lg hover:scale-105'>Cancel</button>
      <button onClick={handleSubmit}  className='border border-primary px-4 py-1 bg-primary text-white rounded-lg hover:scale-105'>Save</button>
    </div>
   </form>
      </div>
    </div>
  )
}

export default React.memo(EditUserDetails)