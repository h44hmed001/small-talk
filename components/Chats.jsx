import { useChat } from '@/context/chatContext'
import React, { useEffect, useState } from 'react'
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from '@/firebase/firebase';
import Avatar from '@/components/Avatar';
import { useAuth } from '@/context/authContext';



const Chats = () => {
  const {currentUser}=useAuth()
  const [search,setSearch]=useState("")
  const {dispatch}=useChat()
    const {chats,setChats,users,setUsers,selectedChat,setSelectedChat}=useChat()
    useEffect(()=>{
        onSnapshot(collection(db, "users"),(snapshot) => {
            let userObj={}
            snapshot.forEach(
                (doc)=>
                userObj[doc.id]=doc.data()
            )
            setUsers(userObj)
        })

    },[])
    useEffect(()=>{
      const getChats=()=>onSnapshot(doc(db,"userChats",currentUser.uid),(doc)=>{
        if(doc.exists()){
          setChats(doc.data())
        }
      })
      currentUser&&getChats()

    },[])
    const filteredChats=Object.entries(chats||{}).filter((chat)=>chat[1].userInfo.displayName.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ).filter((chat)=>!chat[1].hasOwnProperty("chatDeleted")).sort((a,b)=>b[1].timestamp-a[1].timestamp)
    
    const selectHandle=(user,selectedChatId)=>{
      setSelectedChat(user)
      dispatch({ type: "CHANGE_USER", payload: user });
    }
    
  return (
    <div className='flex h-full  flex-col p-4 items-center'>
      <div className='w-full  top-[30px]'>
      <input onChange={(e)=>setSearch(e.target.value)} placeholder='Search Users' className={`w-full outline-none pl-4 placeholder:text-[#dae0e4] p-2 rounded-2xl bg-gray-500`}/>
      </div>
      <ul className='mt-10 flex flex-col gap-8'>
        {filteredChats.map((chat)=>{
          const user=(users[chat[1].userInfo.uid])
          
          return user.uid===currentUser.uid?(<li key={user.uid} onClick={()=>selectHandle(user)} className={`flex p-2 pr-10  cursor-pointer w-full relative ${user?.uid===selectedChat?.uid?"border-l border-l-white":""} items-center gap-4`}>
          <Avatar user={user} size="x-large" />
          <div className='flex w-[250px] justify-between items-center font-light'>
            <div className='flex  flex-col'>
            <span>You</span>
            <span className='text-gray-300 line-clamp-1 break-all'>{chat[1]?.lastText?.text||"Send your first message"}</span>
            </div>
            

          </div>
        </li>) :<li key={user.uid} onClick={()=>selectHandle(user)} className={`flex p-2 pr-10 cursor-pointer w-full relative ${user?.uid===selectedChat?.uid?"border-l border-l-white":""} items-center gap-4`}>
          <Avatar user={user} size="x-large" />
          <div className='flex w-[250px] justify-between items-center font-light'>
            <div className='flex  flex-col'>
            <span>{user.displayName}</span>
            <span className='text-gray-300 line-clamp-1 break-all'>{chat[1]?.lastMessage?.img?"Image":chat[1]?.lastMessage?.text?chat[1]?.lastMessage?.text:"Send your first message"}</span>
            </div>
         

          </div>
        </li>
        
        
        }
        )}
       
        
      </ul>
      
    </div>
  )
}

export default Chats
