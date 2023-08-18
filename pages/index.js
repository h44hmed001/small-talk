import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useAuth } from '@/context/authContext'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import LeftNav from '@/components/LeftNav'
import Chats from '../components/Chats'
import Chat from '@/components/Chat'
import { useChat } from '@/context/chatContext'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const {signOut,currentUser,loading}=useAuth()
  const {selectedChat}=useChat()
  const router=useRouter()
  useEffect(()=>{
    if(!currentUser&&!loading){
      router.push("/login")
    }
  },[currentUser,loading])
  
  return !currentUser? (
    <div className='h-[100vh] w-[100%] bg-black text-white flex items-center justify-center '>
    {/* <span className='text-2xl font-bold'>Loading...</span> */}
    <div className="font-extrabold text text-[60px] text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-blue-600 ">
          Small-Talk
        </div>
    {/* <Image width={70} height={70} src="/typing.svg" className='text-blue-400'/> */}
    </div>):
    <div className='h-[100vh] bg-[#001f34] flex shrink-0'>
      <div className='flex  w-full shrink-0'>
        <LeftNav/>
     
      <div className='flex bg-[#333541] grow'>
        <div className='w-[400px]  p-6 overflow-auto scrollbar shrink-0 bg-[#0c2d44] border-r border-r-white/[0.2]  '>
          <div><Chats/></div>
        </div>
        {selectedChat&&<Chat/>}
      </div>
      </div>

    </div>
   
 
}
