import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Avatar from './Avatar'
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaImage, FaPlus, FaVideo } from 'react-icons/fa6';
import uploadFile from '../helpers/uploadFile';
import { IoClose, IoSend } from 'react-icons/io5';
import CircleLoader from './CircleLoader';
import backgroundImage from '../assets/wallapaper.jpeg'

const MessagePage = () => {
  const params = useParams()
  const socketConnection =useSelector(state=>state?.user?.socketConnection) 
  const user = useSelector(state=>state?.user)
  const [dataUser, setDataUser] =useState({
    _id: "",
    name:"",
    email:"",
    profile_pic:"",
    online: false

  })
  const [openImageVideoUpload, setOpenImageVideoUpload] =useState(false)
  const [message, setMessage] =useState({
     text: "",
     imageurl: "",
     videoUrl: " "
  })
  const[loading, setLoading]=useState(false)

 const handleImageVideoUpload =()=>{
  setOpenImageVideoUpload(prev=>!prev)
 }
 const handleUploadImage =async(e)=>{
  const file =e.target.files[0]
 
  setLoading(true)
  const uploadPhoto =await uploadFile(file)
  setLoading(false)
  setOpenImageVideoUpload(false)
  setMessage(prev=>{
     return{
       ...prev,
        imageurl: uploadPhoto?.url
     }
 
  })
 }
 const handleClearUploadImage =()=>{
  setMessage(prev=>{
    return{
      ...prev,
       imageurl: ""
    }

 })
 }
 const handleClearUploadVideo =()=>{
  setMessage(prev=>{
    return{
      ...prev,
       videoUrl: ""
    }

 })
 }
 const handleUploadVideo =async(e)=>{
  const file =e.target.files[0]
  setLoading(true)
  const uploadPhoto =await uploadFile(file)
  setLoading(false)
  setOpenImageVideoUpload(false)
  setMessage(prev=>{
     return{
       ...prev,
        videoUrl: uploadPhoto?.url
     }
 
  })
 }
  useEffect(()=>{
       if(socketConnection){
         socketConnection.emit('message page', params.userId)

         socketConnection.on('message-user',(data)=>{
           console.log("message-user", data)
           setDataUser(data)
           //update state with new message
         })
       }
  },[socketConnection, params?.userId,user])

  const handleOnchange =(e)=>{
    const {name, value} =e.target
    setMessage(prev =>{
      return{
        ...prev,
        text : value
      }
    })
  }
  return (
    <div style={{backgroundImage : `url(${backgroundImage})`}} className='bg-no-repeat bg-cover'>
         <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
         <div className='flex  items-center gap-4 '>
          <Link to={'/'} className='lg:hidden'>
            <FaAngleLeft size={22}/>
          </Link>
          <div>
            <Avatar
            width={50}
            height={50}
            imageUrl={dataUser.profile_pic}
            name={dataUser?.name}
            userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
            <p className='-my-2'>
              {
                dataUser?.online?   <span className='text-primary'>Online</span> : <span className='text-slate-500'>Offline</span>
              }
            </p>
          </div>
         
         </div> 
         <div>
          <button className='cursor-pointer hover:text-primary'>
             <HiDotsVertical/>
          </button>
           
          </div>
         </header>
         {/* show message */}
         <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-40'>
          {/* upload imagedisplay */}
          {
            message.imageurl &&(
              <div className='w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-rose-900
                ' onClick={handleClearUploadImage}>
                  <IoClose size={30}/>
                </div>
              <div className='bg-white p-3 '>
                <img
                src={message.imageurl}
                alt='image'
                
                className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                />
  
              </div>
  
            </div>
            )
          }
          {/* upload video */}
          {
            message.videoUrl &&(
              <div className='w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-rose-900
                ' onClick={handleClearUploadVideo}>
                  <IoClose size={30}/>
                </div>
              <div className='bg-white p-3 '>
              <video
              src={message.videoUrl}
              
              alt='video'
              className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
              controls
              muted
              autoPlay
              />
  
              </div>
  
            </div>
            )
          }
          {
            loading && (
              <div className='w-full h-full flex justify-center items-center'>
                <CircleLoader/>
              </div>
              
            )
          }

          Show MessagePage
         </section>
         {/* send message */}
         <section className='h-16 bg-white flex items-center px-4 '>
                 <div className=' relative 
                  '>
                    <button onClick={handleImageVideoUpload} className='flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white'>
                      <FaPlus size={20}/>
                    </button>
                  {/* content video and image */}
                  {
                    openImageVideoUpload && (
                      <div className='bg-white shadow rounded absolute bottom-14 w-36 p-2'>
                    <form className=''>
                      <label htmlFor='uploadImage' className='flex items-center p-2 gap-3 hover:bg-slate-200 px-3 cursor-pointer'>
                        <div className='text-primary'>
                          <FaImage size={18}/>
                        </div>
                         <p>Image</p>
                      </label>
                      <label htmlFor='uploadVideo' className='flex hover:bg-slate-200 px-3 cursor-pointeritems-center p-2 gap-3'>
                        <div className='text-blue-600'>
                          <FaVideo size={18}/>
                        </div>
                        Video
                      </label>
                      <input type='file' id='uploadImage' name='uploadImage'
                      onChange={handleUploadImage}

                      className='hidden'
                      />
                      <input type='file' id='uploadVideo' name='uploadVideo'
                      onChange={handleUploadVideo} 
                      className='hidden'
                      />
                    </form>
                  </div>
                    )
                  }
                  
                
                 </div>
                 {/* input message */}
                 <form className='h-full w-full flex gap-2 '>
                   
                  <input
                  type='text'
                  placeholder='Type your message here...'
                  className='py-1 px-4 outline-none w-full h-full'
                  value={message.text}
                  onChange={handleOnchange}
                  />
                 <button className='text-primary hover:text-secondary  '>
                  <IoSend size={28}/>
                 </button>
                 </form>
               
         </section>


    </div>
  )
}

export default MessagePage