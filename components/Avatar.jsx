import Image from 'next/image'
import React from 'react'

const Avatar = ({user,size,onClick}) => {
    const s=size==="small"?32:size==="medium"?36:size==="x-large"?56:size==="xx-large"?96:40
    const c=size==="small"?"w-8 h-8":size==="medium"?"w-9 h-9":size==="x-large"?"w-14 h-14":size==="large"?"w-10 h-10":"w-24 h-24"
    const f=size==="x-large"?"text-2xl":size==="xx-large"?"text-4xl":"text-base"
  return (
    <div style={{backgroundColor:user?.color}} className={`${c}  rounded-full flex items-center justify-center text-base shrink-0 relative`}>
        {user?.isOnline&&size==="large" && <span className='bg-green-500 h-[10px] w-[10px] absolute right-0 bottom-0 rounded-full'/>}
        {user?.isOnline&&size==="x-large" && <span className='bg-green-500 h-[13px] w-[13px] absolute right-0 bottom-0 rounded-full'/>}
        {
            user?.photoURL?(<div className={`${c} rounded-full`}>
                <Image width={s} height={s} className='rounded-full object-cover' src={user?.photoURL} alt="User Avatar" />
            </div>):(<div className={`font-semibold text-white ${f} uppercase`}>
                {user?.displayName.charAt(0)}
            </div>)
        }

    </div>
  )
}

export default Avatar
