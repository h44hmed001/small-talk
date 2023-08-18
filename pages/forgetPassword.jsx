import { auth } from "@/firebase/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import React, { useState } from "react";

const forgetPassword = () => {
  const [email, setEmail] = useState("");
  const [error,setError]=useState(false)
  const [success,setSuccess]=useState(false)
  const resetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setSuccess(true)

      })
      .catch((error) => {
        setError(true)
      });
  };
  return (
    <div className="h-[100vh] bg-black flex items-center justify-center ">
      <div className="flex flex-col items-center">
        <div className="font-extrabold text text-[40px] text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-blue-600 ">
          Small-Talk
        </div>
        <div className="font-bold text-[30px]">Forgotten Your Password?</div>
        <div className="flex rounded-xl bg-[#192b42] p-6 gap-5 mt-4 w-full flex-col">
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Enter your email"
            className="p-3 bg-[#1f1f1f] outline-none border border-sky-800 rounded-lg"
          />
          {success&&<div className="bg-transparent text-green-400 text-center">Check your gmail inbox</div>}
          {!success&&error&&<div className="text-center bg-transparent text-red-500">Unknown error occured</div>}
          <button onClick={resetPassword} className="bg-gradient-to-r h-10 font-semibold text-center rounded-lg from-sky-400 to-blue-400">
            Reset Your Password
          </button>
          <Link className="bg-transparent" href="/login"><span className="bg-transparent cursor-pointer">← Go Back</span></Link>
        </div>
        
      </div>
    </div>
  );
};

export default forgetPassword;
