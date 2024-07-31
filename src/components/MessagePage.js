import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Avatar from './Avatar'
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaImage, FaPlus, FaVideo } from 'react-icons/fa6';

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

 const handleImageVideoUpload =()=>{
  setOpenImageVideoUpload(prev=>!prev)
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
  return (
    <div>
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
         <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar'>
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
                    </form>
                  </div>
                    )
                  }
                  
                
                 </div>
         </section>
    </div>
  )
}

export default MessagePage