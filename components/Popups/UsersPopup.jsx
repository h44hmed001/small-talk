import React from 'react'
import PopupWrapper from './PopupWrapper'
import { useChat } from '@/context/chatContext'
import { useAuth } from '@/context/authContext'
import Avatar from '../Avatar'
import { deleteField, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/firebase'
import Search from '../Search'

const UsersPopup = ({...props}) => {
  const {users,data,dispatch}=useChat()
  const {currentUser}=useAuth()
  const selectUser=async(user)=>{
    const combinedId=user.uid>currentUser.uid?user.uid+currentUser.uid:currentUser.uid+user.uid
    const res=await getDoc(doc(db, "chats", combinedId))
    if(!res.exists()){
      await setDoc(doc(db,"chats",combinedId),{
        messages:[]
      })
      const currentUserChatRef=await getDoc(doc(db, "userChats", currentUser.uid))
      const userChatRef=await getDoc(doc(db, "userChats", user.uid))
      if (!currentUserChatRef.exists()){
        await setDoc(doc(db,"userChats",currentUser.uid),{})
      }
      await updateDoc(doc(db,"userChats",currentUser.uid),{
        [combinedId+".userInfo"]:{
          displayName:user.displayName,
          uid:user.uid,
          photoURL:user.photoURL||null,
          color:user.color
        },
        [combinedId+".timestamp"]:serverTimestamp()
      })
      if(!userChatRef.exists()){
        await setDoc(doc(db,"userChats",user.uid),{})
      }
      await updateDoc(doc(db,"userChats",user.uid),{
        [combinedId+".userInfo"]:{
          displayName:currentUser.displayName,
          uid:currentUser.uid,
          photoURL:currentUser.photoURL||null,
          color:currentUser.color
        },
        [combinedId+".timestamp"]:serverTimestamp()
      })
      dispatch({ type: "CHANGE_USER", payload: user });

    }
    else{
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [combinedId + ".chatDeleted"]:deleteField(),
      });
      dispatch({ type: "CHANGE_USER", payload: user });
    }
    props.onHide()
  }
  return (
    <PopupWrapper {...props}>
      <Search onHide={props.onHide} />
      <div className='flex overflow-auto scrollbar flex-col gap-4'>
      
        {users&&Object.values(users).map((user)=>user.uid===currentUser.uid?<div key={user.uid} onClick={()=>selectUser(user)} className='flex  cursor-pointer hover:bg-[#193f5b]/[0.4] rounded-xl p-3 items-center gap-4'>
          <Avatar size="x-large" user={user} />
          <div  className='flex flex-col'>
          <span>You</span>
          <span className='text-[#b2bac4]'>{user.email} </span>
          </div>
        </div>:
        <div key={user.uid} onClick={()=>selectUser(user)} className='flex cursor-pointer hover:bg-[#193f5b]/[0.4] rounded-xl p-3 items-center gap-4'>
          <Avatar size="x-large" user={user} />
          <div  className='flex flex-col'>
          <span>{user.displayName}</span>
          <span className='text-[#b2bac4]'>{user.email} </span>
          </div>
        </div>
        )}
    
      </div>
    </PopupWrapper>
  )
}

export default UsersPopup
