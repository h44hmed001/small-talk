import React from 'react'
import { IoCloseCircleOutline, IoCloseOutline } from 'react-icons/io5'

const PopupWrapper = ({...props}) => {
  return (
    <div className='fixed top-0 overflow-auto  left-0 z-20 w-full h-full flex items-center justify-center'>
      <div onClick={props.onHide} className='glass-effect absolute w-full h-full'/>
      <div className='bg-[#001b2d] rounded-3xl relative p-6 w-[500px] max-h-[80%] '>
        <div className='flex justify-between shrink-0 items-center'>
        <div className='text-lg font-semibold'>{props.title}</div>
        <div  onClick={props.onHide}><IoCloseOutline size={20}/></div>
        </div>
        <div className='flex flex-col p-6 pt-8'>{props.children}</div>
        
      </div>
    </div>
  )
}

export default PopupWrapper
