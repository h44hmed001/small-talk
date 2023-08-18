import React, { useEffect, useRef } from 'react'
import ChatHeader from './ChatHeader'
import { useChat } from '@/context/chatContext'
import ChatFooter from './ChatFooter'
import Messages from './Messages'
import { useAuth } from '@/context/authContext'

const Chat = () => {
  const {currentUser}=useAuth()
  const {data,users}=useChat()
  
  const isUserBlocked = users[currentUser.uid]?.blockedUsers?.find(
    (u) => u === data?.user?.uid
);
const userBlock=isUserBlocked==data?.user?.uid
const iamBlocked = users[data.user.uid]?.blockedUsers?.find(
    (u) => u === currentUser?.uid
);
const meBlock=iamBlocked==currentUser?.uid

  return (
    <div  className='flex flex-col bg-[#133349] grow'>
      <ChatHeader/>
      <Messages/>
      {!meBlock&&!userBlock&&<ChatFooter/>}
      {meBlock&&<div className='w-full pt-2 pb-2 text-center'>{`${data?.user?.displayName} has blocked you`}</div>}
      {userBlock&&<div className='w-full pt-2 pb-2 text-center'>This user has been blocked</div>}
    </div>
  )
}

export default Chat
