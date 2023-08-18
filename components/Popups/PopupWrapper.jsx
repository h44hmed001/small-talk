import React from 'react'
import { IoClose, IoCloseCircleOutline, IoCloseOutline } from 'react-icons/io5'
import Icon from '../Icon'

const PopupWrapper = ({...props}) => {
  return (
    <div className="fixed top-0 left-0 z-20 w-full h-full flex items-center justify-center">
      <div onClick={props.onHide} className='glass-effect absolute w-full h-full'/>

      <div className="flex flex-col bg-[#001b2d] w-[500px] max-h-[80%] bg-c2 relative z-10 rounded-3xl  overflow-hidden">
        <div className="p-6 flex items-center justify-between ">
          <div className="text-lg font-semibold text-white">
            {props.title || ''}
          </div>
          <Icon
            size="small"
            icon={<IoClose size={20} />}
            onClick={props.onHide}
            className="cursor-pointer text-white"
          />
        </div>

        <div className="overflow-y-auto scrollbar p-6 pt-0">
          {props.children}
        </div>
      </div>
    </div>

  )
}

export default PopupWrapper
