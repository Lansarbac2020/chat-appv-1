import axios from 'axios'
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const Home = () => {
  const fetchUserDetails = async()=>{
    try{
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`
       const response =await axios({
            url: URL,
            withCredentials: true
       })
       console.log("current user", response)
    }catch(error){
      console.log(  "error",error)
    }
  }

  useEffect(()=>{
     fetchUserDetails()
  },[])
  return (
    <div>
        Home
        <section>
            
        </section>
         <Outlet/>
        </div>
  )
}

export default Home