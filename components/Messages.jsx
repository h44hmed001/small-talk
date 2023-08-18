import { useChat } from '@/context/chatContext'
import { db } from '@/firebase/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import Message from './Message'
import { useAuth } from '@/context/authContext'

const Messages = () => {
    const {data} = useChat()
    const [messages,setMessages]=useState(null)
    const {currentUser}=useAuth()
    const ref=useRef()
    const {typing,setIsTyping}=useChat()
    const scrollToBottom=()=>{
      const chatContainer=ref.current
      chatContainer.scrollTop=chatContainer.scrollHeight
}
    useEffect(()=>{
        const unsub = onSnapshot(doc(db, "chats", data?.chatId), (doc) => {
            setMessages(doc?.data()?.messages);
            setTimeout(async()=>{
             setIsTyping( doc?.data()?.typing?.[data.user.uid] || false )
            }
              ,0);
            
            scrollToBottom()
        });
        
        return ()=> unsub()
    },[data.chatId])
    
    
  return (
    <div ref={ref} className="grow p-5 overflow-auto scrollbar flex flex-col">
      {messages?.filter((message)=>!message?.deleteChatInfo||!message?.deleteChatInfo?.[currentUser.uid]).map((m)=>{return <Message key={m.uid} message={m}/>})}
      
    </div>
  )
}

export default Messages
