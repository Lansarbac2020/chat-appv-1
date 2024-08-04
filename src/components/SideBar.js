import React, { useEffect, useState } from 'react';
import { FaRocketchat } from "react-icons/fa6";
import { FaUserPlus } from "react-icons/fa6";
import { NavLink, useNavigate } from 'react-router-dom';
import { IoLogOut } from "react-icons/io5";
import Avatar from './Avatar';
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import Dividers from './Dividers';
import { FiArrowUpLeft } from "react-icons/fi";
import SearchUser from './SearchUser';
import { FaImage, FaVideo } from 'react-icons/fa';
import { logout } from '../redux/userSlice';





const SideBar = () => {
    const user = useSelector(state => state?.user)
    const [editUserOpen ,setEditUserOpen] =useState(false);
    const [allUser, setAllUser] = useState([]);
    const [openSearchUser, setOpenUserSearch] = useState(false)
    const socketConnection = useSelector(state => state?.user?.socketConnection);
    const dispatch =useDispatch();
    const navigate =useNavigate();


    useEffect(()=>{
        if(socketConnection){
          socketConnection.emit('sideBar',user._id)
          
          socketConnection.on('conversation',(data)=>{

            console.log("countUnseenMsg", data)
            const conversationUserData = data.map((conversationuser,index)=>{
              if(conversationuser?.sender?._id===conversationuser?.receiver?._id){
                return{
                ...conversationuser,
                userDetails : conversationuser?.sender

              }
              }
              else if(conversationuser?.receiver?._id !==user?._id){
                return{
                  ...conversationuser,
                  userDetails : conversationuser.receiver
  
                }
              }else{
                return{
                  ...conversationuser,
                  userDetails : conversationuser.sender
  
                }
              }
              
            })

            setAllUser(conversationUserData)
          })
        }
    },[socketConnection,user])

    const handleLogout=()=>{
           dispatch(logout())
           navigate('/email')
           localStorage.clear()
    }
  return (
    <div className='w-full h-full grid grid-cols-[48px,1fr] bg-white'>
        <div className='bg-slate-300 w-12 h-full rounded-tr-lg rounded-br-lg py-6 text-slate-60 flex flex-col justify-between'>
            <div>
            <NavLink  className= {({isActive})=>`w-12 h-12  flex justify-center items-center cursor-pointer hover:bg-slate-100 hover:scale-105 rounded ${isActive && 'bg-slate-600'}`}
        
        title='Chat'>
        <FaRocketchat size={30} />
        </NavLink>
        <div   className='w-12 h-12  flex justify-center items-center cursor-pointer hover:bg-slate-100 hover:scale-105
        
        ' onClick={()=>setOpenUserSearch(true)} title='Add user'>
        <FaUserPlus size={30} />
        </div>
            </div>
            <div className='flex flex-col items-center'>
                <button className='mx-auto' title={user?.name}  onClick={()=>setEditUserOpen(true)}>
                    <Avatar
                    width={40}
                    height={40}
                    name={user?.name}
                    imageUrl={user?.profile_pic}
                    userId={user?._id}
                    
                    />
                    
                </button>
            <button  title='logout' className='w-12 h-12  flex justify-center items-center cursor-pointer hover:bg-slate-100 hover:scale-105' onClick={handleLogout}>
                <span className='-ml-2'>
                    <IoLogOut size={30}/> 
                </span>
                
            </button>
            </div>
     
        </div>
        <div className='w-full'>
     <div className='h-16 flex items-center'>
     <h2 className='text-xl font-bold p-4 text-slate-800 '>Message</h2>
     </div>
      <div className='bg-slate-200 p-[0.5px]'></div>
      <div className='h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
           {
            allUser.length===0&&(
                <div className='mt-12'>
                    <div className='flex justify-center items-center my-3 text-slate-500'>
                  <FiArrowUpLeft
                  size={50}/>
                    </div>
                    <p className='text-lg text-center text-slate-600'>Explore users to start a conversation</p>
                </div>
            )
           }
      {
        allUser.map((conv,index)=>{
          return(
            <NavLink to={"/"+conv?.userDetails?._id}  key={conv?._id} className='flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer '>
              <div>
                <Avatar
                imageUrl={conv?.userDetails?.profile_pic}
                name={conv?.userDetails?.name}
                width={35}
                height={35}
                />

                </div> 
                <div>
                  <h3 className='text-ellipsis line-clamp-1 font-semibold text-base '>{conv?.userDetails?.name}</h3>
                  <div className='text-slate-500 text-xs flex items-center gap-1'>
                    <div>
                      {
                        conv.lastMsg.imageurl &&(
                          <div className='flex items-center gap-1'>
                      <span><FaImage/></span>
                     {!conv?.lastMsg?.text  &&<span>Image</span> } 
                            </div>
                         
                        )
                      }
                         {
                        conv.lastMsg.videoUrl &&(
                       <div className='flex items-center gap-1'>
                      <span><FaVideo/></span>
                      {!conv?.lastMsg?.text  && <span>Video</span>}
                        </div>
                        )
                      }
                    </div>
                    <p className='text-ellipsis line-clamp-1'>{conv?.lastMsg?.text}</p>
                  </div>
                 

                </div>
                {
                  Boolean(conv?.unseenMsg) && (
                    <p className='text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full'>{conv?.unseenMsg}</p>
                  )
                }
                

            </NavLink>
        )
        })
      
      }

 </div>
        </div>
       {/* edit user detail */}
       {
        editUserOpen &&
       (
         < EditUserDetails onClose={()=>setEditUserOpen(false)} user={user}/>

         )
       }

       {/* search user */}
       {
          openSearchUser && (
            <SearchUser onClose={()=>setOpenUserSearch(false)}/>
          )
       }
    </div>
  )
}

export default SideBar