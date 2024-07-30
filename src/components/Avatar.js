import React from 'react'
import { FaUserCircle } from 'react-icons/fa'

const Avatar = ({userId, name, imageUrl, width, height}) => {
    let avatarName =""

    if(name){
        const splitName =name?.split(' ')
        if(splitName.length > 1){
            avatarName =splitName[0][0]+splitName[1][0]
        }else{
            avatarName = splitName[0][0]
        }
    }
    const bgColor =[
        'bg-slate-200',
        'bg-teal-200',
        'bg-red-200',
        'bg-green-200',
        'bg-rose-200',
        'bg-gray-200',
        'bg-yellow-200',
        'bg-blue-200',
        'bg-indigo-200',
        'bg-pink-200',
        'bg-orange-200',
        'bg-purple-200',

    ]
    const randomNumber =Math.floor(Math.random() * 12)
    
  return (
    <div className={`text-slate-800 overflow-hidden rounded-full shadow border text-xl font-semibold`} style={{width : width+"px", height: height+"px" }}>
        {
            imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                width={width}
                height={height}
                className='overflow-hidden rounded-full flex justify-center items-center'
              />
            ):  (
                name? (
                  <div  style={{width : width+"px", height: height+"px" }} className={`'overflow-hidden rounded-full flex justify-center items-center ${bgColor[randomNumber]}`}>
                    {avatarName}
                  </div>

                ) :(
                   <FaUserCircle size={width}/>
                )
            )
  
        }
    </div>
  )
}

export default Avatar