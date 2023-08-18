import React, { useState } from "react";
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import Avatar from "./Avatar";
import { useAuth } from "@/context/authContext";

const Search = () => {
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const [userName, setUserName] = useState("");
  const {currentUser}=useAuth()
  const selectUser=async()=>{
    const combinedId=user.uid>currentUser.uid?user.uid+currentUser.uid:currentUser.uid+user.uid
    const res=await getDoc(doc(db, "chats", combinedId))
    if(!res.exists()){
      await setDoc(doc(db,"chats",combinedId),{
        messages:[]
      })
      const currentUserChatRef=await getDoc(doc(db, "userChats", currentUser.uid))
      const userChatRef=await getDoc(doc(db, "userChats", user.uid))
      if (!currentUserChatRef.exists()){
        await setDoc(doc(db,"userChats",currentUser.uid),{})
      }
      await updateDoc(doc(db,"userChats",currentUser.uid),{
        [combinedId+".userInfo"]:{
          displayName:user.displayName,
          uid:user.uid,
          photoURL:user.photoURL||null,
          color:user.color
        },
        [combinedId+".timestamp"]:serverTimestamp()
      })
      if(!userChatRef.exists()){
        await setDoc(doc(db,"userChats",user.uid),{})
      }
      await updateDoc(doc(db,"userChats",user.uid),{
        [combinedId+".userInfo"]:{
          displayName:currentUser.displayName,
          uid:currentUser.uid,
          photoURL:currentUser.photoURL||null,
          color:currentUser.color
        },
        [combinedId+".timestamp"]:serverTimestamp()
      })
    }
    else{
    }
    setUser(null)
    setUserName("")
  }

  const handleEnter = async (e) => {
    if (e.code === "Enter") {
      try{const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("displayName", "==", userName)
      );
      const querySnapshot = await getDocs(q);
      if(querySnapshot.empty){
        setErr(true),
        setUser(null)
      }
      else{
        querySnapshot.forEach((doc) => {
            setUser(doc.data())
            setErr(false)
          });
      }}
      catch(error){
        console.error(error)
      }
    }
  };
  return (
    <div className="flex flex-col w-full">
      <input
        onKeyUp={handleEnter}
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="w-full bg-gray-700 p-3 pl-3 mb-4 outline-none rounded-3xl"
        placeholder="Search Users"
      />
      {user&&<>
        <div onClick={()=>selectUser()} className='flex  p-4 mb-4 border-b bg-[#193f5b]/[0.4] border-b-gray-700 cursor-pointer rounded-xl  items-center gap-4'>
          <Avatar size="x-large" user={user} />
          <div  className='flex flex-col'>
          <span>{user.displayName}</span>
          <span className='text-[#b2bac4]'>{user.email} </span>
          </div>
        </div>
      </>
    }
    {err&&<div className="flex items-center p-4 w-full justify-center">
        <span>No Users Found</span></div>}
    </div>
    
  );
};

export default Search;
