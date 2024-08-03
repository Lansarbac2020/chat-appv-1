import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Avatar from './Avatar';
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaImage, FaPlus, FaVideo } from 'react-icons/fa6';
import { IoClose, IoSend } from 'react-icons/io5';
import uploadFile from '../helpers/uploadFile';
import CircleLoader from './CircleLoader';
import backgroundImage from '../assets/wallapaper.jpeg';
import moment from 'moment';

const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(state => state?.user?.socketConnection);
  const user = useSelector(state => state?.user);
  const [dataUser, setDataUser] = useState({
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    online: false
  });
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageurl: "",
    videoUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef();

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [allMessage]);

  const handleImageVideoUpload = () => {
    setOpenImageVideoUpload(prev => !prev);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    try {
      const uploadPhoto = await uploadFile(file);
      setMessage(prev => ({
        ...prev,
        imageurl: uploadPhoto?.url
      }));
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
      setLoading(false);
      setOpenImageVideoUpload(false);
    }
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    try {
      const uploadPhoto = await uploadFile(file);
      setMessage(prev => ({
        ...prev,
        videoUrl: uploadPhoto?.url
      }));
    } catch (error) {
      console.error("Video upload failed", error);
    } finally {
      setLoading(false);
      setOpenImageVideoUpload(false);
    }
  };

  const handleClearUpload = (type) => {
    setMessage(prev => ({
      ...prev,
      [type]: ""
    }));
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message page', params.userId);

      socketConnection.on('message-user', (data) => {
        setDataUser(data);
      });

      socketConnection.on('message', (data) => {
        setAllMessage(data);
      });
    }
  }, [socketConnection, params?.userId, user]);

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setMessage(prev => ({
      ...prev,
      text: value
    }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.text || message.imageurl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit('new message', {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageurl: message.imageurl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id
        });
        setMessage({
          text: "",
          imageurl: "",
          videoUrl: ""
        });
      }
    }
  };

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})` }} className='bg-no-repeat bg-cover'>
      <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
        <div className='flex items-center gap-4'>
          <Link to={'/'} className='lg:hidden'>
            <FaAngleLeft size={22} />
          </Link>
          <Avatar
            width={50}
            height={50}
            imageUrl={dataUser.profile_pic}
            name={dataUser?.name}
            userId={dataUser?._id}
          />
          <div>
            <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
            <p className='-my-2'>
              {dataUser?.online ? <span className='text-primary'>Online</span> : <span className='text-slate-500'>Offline</span>}
            </p>
          </div>
        </div>
        <button className='cursor-pointer hover:text-primary'>
          <HiDotsVertical />
        </button>
      </header>

      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-40'>
        <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>
          {allMessage.map((msg, index) => (
            <div key={index} className={`p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg?.msgByUserId ? "ml-auto bg-teal-100" : "bg-white"}`}>
              <div className='w-full'>
                {msg?.imageurl && <img src={msg?.imageurl} className='w-full h-full object-scale-down' alt='uploaded' />}
                {msg?.videoUrl && <video src={msg?.videoUrl} className='w-full h-full object-scale-down' controls />}
              </div>
              <p className='px-2'>{msg.text}</p>
              <p className='text-xs ml-auto w-fit'>{moment(msg.createdAt).format('LT')}</p>
            </div>
          ))}
        </div>

        {message.imageurl && (
          <div className='w-full h-full bottom-0 sticky bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
            <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-rose-900' onClick={() => handleClearUpload('imageurl')}>
              <IoClose size={30} />
            </div>
            <div className='bg-white p-3'>
              <img src={message.imageurl} alt='image' className='aspect-square w-full h-full max-w-sm m-2 object-scale-down' />
            </div>
          </div>
        )}

        {message.videoUrl && (
          <div className='w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden sticky bottom-0'>
            <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-rose-900' onClick={() => handleClearUpload('videoUrl')}>
              <IoClose size={30} />
            </div>
            <div className='bg-white p-3'>
              <video src={message.videoUrl} alt='video' className='aspect-square w-full h-full max-w-sm m-2 object-scale-down' muted autoPlay />
            </div>
          </div>
        )}

        {loading && (
          <div className='w-full h-full sticky bottom-0 flex justify-center items-center'>
            <CircleLoader />
          </div>
        )}
      </section>

      <section className='h-16 bg-white flex items-center px-4'>
        <div className='relative'>
          <button onClick={handleImageVideoUpload} className='flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white'>
            <FaPlus size={20} />
          </button>
          {openImageVideoUpload && (
            <div className='bg-white shadow rounded absolute bottom-14 w-36 p-2'>
              <form>
                <label htmlFor='uploadImage' className='flex items-center p-2 gap-3 hover:bg-slate-200 px-3 cursor-pointer'>
                  <div className='text-primary'>
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label htmlFor='uploadVideo' className='flex items-center p-2 gap-3 hover:bg-slate-200 px-3 cursor-pointer'>
                  <div className='text-blue-600'>
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>
                <input type='file' id='uploadImage' name='uploadImage' onChange={handleUploadImage} className='hidden' />
                <input type='file' id='uploadVideo' name='uploadVideo' onChange={handleUploadVideo} className='hidden' />
              </form>
            </div>
          )}
        </div>

        <form className='h-full w-full flex gap-2' onSubmit={handleSendMessage}>
          <input
            type='text'
            placeholder='Type your message here...'
            className='py-1 px-4 outline-none w-full h-full'
            value={message.text}
            onChange={handleOnchange}
          />
          <button type='submit' className='text-primary hover:text-secondary'>
            <IoSend size={28} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
