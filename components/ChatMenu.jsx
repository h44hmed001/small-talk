import { useAuth } from '@/context/authContext'
import { useChat } from '@/context/chatContext'
import { db } from '@/firebase/firebase'
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect } from 'react'
import ClickAwayListener from 'react-click-away-listener'

const ChatMenu = ({setMenu}) => {
  const {currentUser}=useAuth()
  const {data,users}=useChat()
  const {chats,setChats}=useChat()

  const handleDelete=async()=>{
    const chatRef=doc(db,"chats",data.chatId)
    const chatDoc=await getDoc(chatRef)
    const updatedMessage=chatDoc.data().messages.map((message)=>{
      message.deleteChatInfo={
        ...message.deleteChatInfo,
        [currentUser.uid]:true
      }
      return message
    }
    
    )
    await updateDoc(doc(db,"chats",data.chatId),{
      messages:updatedMessage
    })
    await updateDoc(doc(db,"userChats",currentUser.uid),{
      [data.chatId+".chatDeleted"]:true
    })
    await updateDoc(doc(db,"userChats",currentUser.uid),{
      [data.chatId+".lastMessage.text"]:"",
      [data.chatId+".lastMessage.img"]:false
    })
    
  }
  const isUserBlocked = users[currentUser.uid]?.blockedUsers?.find(
    (u) => u === data.user.uid
);
const userBlock=isUserBlocked==data.user.uid
const iamBlocked = users[data.user.uid]?.blockedUsers?.find(
    (u) => u === currentUser.uid
);
const meBlock=iamBlocked==currentUser.uid

  
  const handleBlock=async(action)=>{
    if (action==="block"){
      await updateDoc(doc(db,"users",currentUser.uid),{
        blockedUsers:arrayUnion(
          data.user.uid
        )
      })
    }
    if (action==="unblock"){
      await updateDoc(doc(db,"users",currentUser.uid),{
        blockedUsers:arrayRemove(
          data.user.uid
        )
      })
    }
  }
  return (
    <ClickAwayListener onClickAway={()=>setMenu(false)}>
    <div className='absolute w-[200px] bg-[#001f34] right-5 z-10 rounded-md overflow-hidden top-[70px] '>
      <ul className='flex py-2 px-3  flex-col '>
      {!meBlock && (
                        <li
                            className="flex items-center p-2 hover:bg-black cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleBlock(
                                    userBlock ? "unblock" : "block"
                                );
                            }}
                        >
                            {userBlock? "Unblock" : "Block user"}
                        </li>
                    )}
        
        <li onClick={(e)=>{e.stopPropagation(); handleDelete()}} className='p-2 rounded-md hover:bg-[#0b161d]'>Delete Chat</li>
      </ul>
    </div>
    </ClickAwayListener>
  )
}

export default ChatMenu
