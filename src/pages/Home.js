import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout, setUser } from '../redux/userSlice'
import SideBar from '../components/SideBar'
import logo from '../assets/logo.png';
const Home = () => {
  const user =useSelector(state => state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation()

  //console.log("redux user", user)
  const fetchUserDetails = async()=>{
    try{
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`
       const response =await axios({
            url: URL,
            withCredentials: true
       })
       dispatch(setUser(response.data.data))

       if(response.data.data.logout){
            dispatch(logout())
            navigate('/email')
       }
       console.log("current user", response)
    }catch(error){
      console.log(  "error",error)
    }
  }

  useEffect(()=>{
     fetchUserDetails()
  },[])

  //console.log("location", location)
  const basePath=location.pathname==='/'
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
     <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
      <SideBar/>
     </section>
     {/* message-content */}
     <section className={`${basePath && 'hidden'}`}>
      <Outlet/>
     </section>
     <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : 'lg:flex' }`}>
      <div>
        <img
        src={logo}
        width={500}
        alt='logo'
        />
      </div>
      <p className='text-lg mt-2 text-slate-500 '> Select user to send message </p>
     </div>
</div>
  )
}

export default Home