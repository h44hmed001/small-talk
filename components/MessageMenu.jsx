import React, { useEffect, useRef } from 'react'
import ClickAwayListener from 'react-click-away-listener'
import { doc, updateDoc, deleteField } from "firebase/firestore";
import { useChat } from '@/context/chatContext';
import { db } from '@/firebase/firebase';

const MessageMenu = ({message,self,showMenu,setShowMenu}) => {
    const {data}=useChat()
    const handleDelete=async()=>{
        const textRef = doc(db, 'chats', data.chatId )
        await updateDoc(textRef, {
            [message.id]: deleteField()
        });
    }
    const ref=useRef()
    useEffect(()=>{
        ref?.current?.scrollIntoViewIfNeeded()
    },[showMenu])
  return (
    <ClickAwayListener onClickAway={()=>setShowMenu(false)}>
    <div ref={ref} className={`absolute w-[200px] bg-[#001f34] top-8 z-10 rounded-md overflow-hidden ${self?"right-0":"left-0"}`}>
      <ul className='flex py-2 px-3  flex-col '>
        <li onClick={()=>handleDelete()} className='p-2 rounded-md cursor-pointer hover:bg-[#0b161d]'>Delete Message</li>
      </ul>
    </div>
    </ClickAwayListener>
  )
}

export default MessageMenu
