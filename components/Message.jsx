import { useAuth } from '@/context/authContext'
import React, { useState } from 'react'
import Avatar from './Avatar'
import { useChat } from '@/context/chatContext'
import Image from 'next/image'
import ImageViewer from 'react-simple-image-viewer';
import Icon from './Icon'
import { BiDownArrow } from 'react-icons/bi'
import ChatMenu from './MessageMenu'
import MessageMenu from './MessageMenu'

const Message = ({message}) => {
    const {currentUser}=useAuth()
    const {data,imageViewer,setImageViewer}=useChat()
    const self=message.sender===currentUser.uid

  return (
    <div className={`${self?"self-end":""}  mb-5 max-w-[75%]`}>
        <div className={`flex  items-end gap-3 mb-1 ${self?"justify-start flex flex-row-reverse":""}`}>
            <Avatar size={"large"} user={self?currentUser:data.user}/>
            <div className='flex relative justify-center rounded-3xl flex-col-reverse bg-[#001f34] '>
              
            <div className={`  p-3 ${self?"rounded-br-md":"rounded-bl-md" }  `}>{message.text&& message.text}</div>
            {message.img && <Image onClick={()=>setImageViewer(
              {
                msgId:message.id,
                src:message.img
              }
            )} className='rounded-3xl max-w-[250px] ' alt={message.text?message.text:""}  width={200} height={200} src={message.img} />}
            {imageViewer&&imageViewer.msgId&&<ImageViewer
            src={[imageViewer.src]}
            closeOnClickOutside={true}
            disableScroll={false}
            onClose={()=>setImageViewer(null)}
            />
            
            }
            
            </div>
            
        </div>
    </div>
  )
}

export default Message
