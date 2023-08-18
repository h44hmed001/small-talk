import { useAuth } from "@/context/authContext";
import { auth, db } from "@/firebase/firebase";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { profileColors } from "@/utils/constants";
import { useChat } from "@/context/chatContext";

const page = () => {
  const {dispatch}=useChat()
  const [err, setErr] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const { currentUser, loading } = useAuth();
  const navigate = useRouter();
  const gProvider = new GoogleAuthProvider();
  const fProvider = new FacebookAuthProvider();
  const colorIndex=Math.floor(Math.random() * profileColors.length)
  const handleRegister = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", user.uid), {
        displayName,
        email,
        uid:user.uid,
        color:profileColors[colorIndex]
      });
      await setDoc(doc(db,"userChats",user.uid),{})
      await updateProfile(user, {
        displayName,
      });
      navigate.push("/")
    } catch (error) {
      setLoginError(true);
    }
  };
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, gProvider);
    } catch (error) {
      setErr(true);
    }
  };
  const handleFacebookLogin = async () => {
    try {
      await signInWithPopup(auth, fProvider);
    } catch (error) {
      setErr(true);
    }
  };
  useEffect(() => {
    if (currentUser && !loading) {
      navigate.push("/");
    }
  }, [currentUser, loading]);
  useEffect(()=>{
    dispatch({ type: "EMPTY" });
},[])
  return (
    <div className="main h-[100vh] bg-black flex items-center flex-col justify-center">
      <div className="flex flex-col items-center">
        <div className="font-bold text-[30px]">Register your Account</div>
        <div className="text-gray-500">Connect with your loved ones</div>
      </div>
      <div className="flex gap-3 text-center  mt-4">
        <div
          onClick={handleGoogleLogin}
          className=" border cursor-pointer rounded-md p-3 border-sky-400"
        >
          Login via Google
        </div>
        <div
          onClick={handleFacebookLogin}
          className="border p-3 cursor-pointer rounded-md border-sky-400"
        >
          Login via Facebook
        </div>
      </div>
      <span className="mt-3 ml-[-20px] ">OR</span>
      <form
        onSubmit={handleRegister}
        className="flex flex-col gap-4 mt-3 w-[350px]"
      >
        <input
          className="rounded-md outline-none p-3 bg-[#2c2c2c]"
          placeholder="Display Name"
        />
        <input
          className="rounded-md outline-none p-3 bg-[#2c2c2c]"
          placeholder="Email"
        />
        <input
          className="rounded-md outline-none p-3 bg-[#2c2c2c]"
          placeholder="Password"
        />
        {/* <div className=' text-right text-[#757575]'>Forgot Password?</div> */}
        {err && (
          <span className="text-center text-red-500">
            Unknown error occured
          </span>
        )}
        {loginError && (
          <span className="text-center text-red-500">Email already in use</span>
        )}
        <button className="bg-gradient-to-r h-10 font-semibold text-center rounded-lg from-sky-400 to-blue-400">
          Register
        </button>
      </form>
      <div className="mt-4  text-[#757575]">
        <span>Already have an account?</span>
        <Link className="text-white ml-1 underline" href="/login">
          Login
        </Link>
      </div>
    </div>
  );
};

export default page;
