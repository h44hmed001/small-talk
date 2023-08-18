import { AuthContext, useAuth } from '@/context/authContext'
import { auth } from '@/firebase/firebase'
import {  signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import { useEffect } from 'react'
import { GoogleAuthProvider } from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";
import { useChat } from '@/context/chatContext'
const login = () => {
    const [loginError,setLoginError]=useState(false)
    const {currentUser,loading}=useAuth()
    const {dispatch}=useChat()
    const gProvider = new GoogleAuthProvider();
    const fProvider = new FacebookAuthProvider();
    const [err,setErr]=useState(false)
    const navigate=useRouter()
    const handleLogin=async(e)=>{
        e.preventDefault()
        const email=e.target[0].value
        const password=e.target[1].value
        try {
            await signInWithEmailAndPassword(auth, email, password)
            
        } catch (error) {
            setLoginError(true)
        }
    }
    const handleGoogleLogin=async()=>{
        try{
            await signInWithPopup(auth, gProvider);
        }
        catch(error){
            setErr(true)
        }
        

    }
    const handleFacebookLogin=async()=>{
        try{await signInWithPopup(auth, fProvider);}
        catch(error){
            setErr(true)
        }

    }
    useEffect(()=>{
        if(currentUser&&!loading){
            navigate.push("/")
        }
        
    },[currentUser,loading])
    useEffect(()=>{
        dispatch({ type: "EMPTY" });
    },[])
  return (<div className='main h-[100vh] bg-black flex items-center flex-col justify-center'>
        <div className='flex flex-col items-center'>
        <div className='font-bold text-[30px]'>Login to your Account</div>
        <div className='text-gray-500'>Connect with your loved ones</div>
        </div>
        <div className='flex gap-3 text-center  mt-4'>
            <div onClick={handleGoogleLogin} className=' border cursor-pointer rounded-md p-3 border-sky-400'>Login via Google</div>
            <div onClick={handleFacebookLogin} className='border p-3 cursor-pointer rounded-md border-sky-400'>Login via Facebook</div>
        </div>
        <span className='mt-3 ml-[-20px] '>OR</span>
        <form onSubmit={handleLogin} className='flex flex-col gap-4 mt-3 w-[350px]'>
            <input className='rounded-md outline-none p-3 bg-[#2c2c2c]' placeholder='Email'/>
            <input className='rounded-md outline-none p-3 bg-[#2c2c2c]' placeholder='Password'/>
            {loginError&&<span className='text-center text-red-500'>Incorrect email or password</span>}
            {err&&<span className='text-center text-red-500'>Unknown error occured</span>}
            <Link href="/forgetPassword"><div className=' text-right text-[#757575]'>Forgot Password?</div></Link>
            <button className='bg-gradient-to-r h-10 font-semibold text-center rounded-lg from-sky-400 to-blue-400'>
                Login
            </button>
        </form>
        <div className='mt-4  text-[#757575]'>
            <span>Not a member yet?</span>
            <Link className='text-white ml-1 underline' href="/register">Register Now</Link>
        </div>

    
    </div>
  )
}

export default login
