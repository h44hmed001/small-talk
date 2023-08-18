import React from 'react'

const Icon = ({size,onClick, className, icon}) => {
    const c=size==="small"?"w-8 h-8":size==="medium"?"w-9 h-9":size==="x-large"?"w-14 h-14":size==="large"?"w-10 h-10":"w-24 h-24"
  return (
    <div onClick={onClick} className={` ${c} items-center flex justify-center rounded-full ${className} `}>
      {icon&&icon}
    </div>
  )
}

export default Icon
