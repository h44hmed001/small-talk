import React, { useState } from 'react'
import {BiEdit } from "react-icons/bi"
import {FiPlus} from "react-icons/fi"
import {IoLogOutOutline,IoClose} from "react-icons/io5"
import {BsCheck, BsFillCheckCircleFill} from "react-icons/bs"
import Avatar from './Avatar'
import { useAuth } from '@/context/authContext'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '@/firebase/firebase'
import Icon from './Icon'
import {MdPhotoCamera,MdAddAPhoto, MdDeleteForever} from "react-icons/md"
import { profileColors } from '@/utils/constants'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase/firebase'
import { updateProfile } from 'firebase/auth'
import UsersPopup from './Popups/UsersPopup'
const LeftNav = () => {
    const {currentUser,signOut,setCurrentUser}=useAuth()
    const [popUp,setPopUp]=useState(false)
    const [editProfile,setEditProfile]=useState(false)
    const userToUpdate=auth.currentUser

    const uploadImage=(file)=>{
      if(file){
        const uploadTask = uploadBytesResumable(ref(storage, currentUser.displayName), file);
uploadTask.on('state_changed', 
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // Handle unsuccessful uploads
  }, 
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
      handleEdit("change-profile",downloadURL)
      await updateProfile(userToUpdate,{
        photoURL: downloadURL
      })
    });
  }
);


      }
      return;

    }

    const handleEdit=async(type,value)=>{
      let obj={...currentUser}
      switch(type){
        case "change-color":obj.color=value;
        break;
        case "change-profile":obj.photoURL=value;
        break;
        case "remove-profile":obj.photoURL=null;
        break;
      }
      const userRef =await doc(db, "users", currentUser.uid);
      await updateDoc(userRef,{
        ...obj
      })
      await setCurrentUser({...obj})
      if(type==="remove-profile"){
        await updateProfile(userToUpdate,{
          photoURL: null
        })
      }
      console.log(obj)
    }
    const editProfileContainer=()=>{
      return(
        <div className='relative flex-col flex items-center'>
          <Icon onClick={()=>setEditProfile(false)}  size={"small"} className="top-0 absolute hover:bg-black/[0.4] right-3" icon={<IoClose size={19}/>}/>
          <div className='relative group items-center cursor-pointer'>
            <Avatar size={"xx-large"} user={currentUser}/>
            <div className='group-hover:flex absolute justify-center items-center w-full h-full top-0 left-0 rounded-full hidden bg-black/[0.3] '>
              <label htmlFor='addPhoto'>{!currentUser.photoURL?<MdAddAPhoto size={34}/>:
              <MdPhotoCamera size={34}/>}</label>
              <input onChange={(e)=>uploadImage(e.target.files[e.target.files.length-1])} className='hidden' type='file' id="addPhoto" />
            </div>
            {currentUser.photoURL&&<div onClick={()=>handleEdit("remove-profile")} className='w-6 h-6 bg-red-500 absolute bottom-0 flex justify-center items-center right-0 rounded-full'>
              <MdDeleteForever size={14}/>
            </div>}
            </div>
            <div className='mt-3 flex flex-col items-center'>
            <span className='text-xl outline-none '>{currentUser.displayName}</span>
            <span className='text-[#ccd2d6]'>{currentUser.email}</span>
            </div>
            <div className='grid grid-cols-5 gap-5 mt-3'>
              {profileColors.map((color)=>(
                <span onClick={()=>handleEdit("change-color",color)} style={{backgroundColor:color}} className="h-7 hover:scale-125 flex items-center justify-center rounded-full w-7">
                  {color===currentUser.color&&<BsCheck />}
                </span>
              ))}

            </div>
        </div>
      )
    }
  return (
    
    <div className={` flex flex-col justify-between py-5 transition-all shrink-0 ${
      editProfile?"w-[350px]":"w-[80px] items-center "
    }`}>
      {!editProfile?<div onClick={()=>setEditProfile(true)}  className='relative group cursor-pointer'>
        <Avatar size="large" user={currentUser} />
        <div className='w-full h-full absolute top-0 hidden group-hover:flex rounded-full items-center justify-center bg-black/[0.5] left-0'>
            <BiEdit size={14}/>
        </div>
      </div>:editProfileContainer()}
      <div className={`flex ${editProfile?"ml-5":"flex-col items-center"} gap-5`}>
        <div><Icon onClick={()=>setPopUp(!popUp)} className="bg-sky-400 hover:bg-sky-900" icon={<FiPlus size={24}/>} size={"large"} /></div>
        <div onClick={signOut}><Icon className=" hover:bg-black/[0.5]" icon={<IoLogOutOutline size={24}/>} size={"large"} /></div>
       
      </div>
      {popUp&&<UsersPopup title="Find Users" onHide={()=>setPopUp(false)}  />}
    </div>
  )
}

export default LeftNav
