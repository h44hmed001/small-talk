import { useChat } from '@/context/chatContext'
import React, { useState } from 'react'
import Avatar from './Avatar'
import { IoEllipsisVerticalSharp } from 'react-icons/io5'
import Icon from './Icon'
import ChatMenu from './ChatMenu'

const ChatHeader = () => {
    const {selectedChat,users,data}=useChat()
    const online=data?.user?.isOnline
    const [menu,setMenu]=useState(false)

  return (
    <div className="flex items-center  justify-between bg-[#0d2331] p-4">
      <div className='flex gap-3'>
      <div><Avatar size="large" user={data.user}/></div>
      <div className='flex flex-col '>
      <div>{data?.user?.displayName}</div>
      <span className='text-sm'>{online?"Online":"Offline"} </span>
      </div>
      </div>
      <span onClick={()=>setMenu(true)} className='cursor-pointer'><Icon className={`${menu&&"bg-black/[0.3]"}`} size="large" icon={<IoEllipsisVerticalSharp/>}/>
      {menu&&<div>
        <ChatMenu setMenu={setMenu} />
      </div>}
      </span>
      
      
    </div>
  )
}

export default ChatHeader
