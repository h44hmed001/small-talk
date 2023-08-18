import { auth, db } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { signOut as authSignOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useChat } from "./chatContext";

const { createContext, useState, useEffect, useContext } = require("react");

const UserContext=createContext()


export const UserProvider=({children})=>{
    
    const [currentUser,setCurrentUser]=useState(null)
    const [loading,setLoading]=useState(true)
    const clear=async()=>{
        if(currentUser){
            await updateDoc(doc(db,"users",currentUser.uid),{
                isOnline:false
              })
        }
        setCurrentUser(null),
        setLoading(false)
 
    }
    const authStateChanged=async(user)=>{
        setLoading(true)
        if (!user){
            clear()
            return;
        }
        const userDocExists=await getDoc(doc(db,"users",user.uid))
        if(userDocExists.exists()){
            await updateDoc(doc(db,"users",user.uid),{
                isOnline:true
              });
        }
        const userDoc=await getDoc(doc(db,"users",user.uid))
        setCurrentUser(userDoc.data())
        setLoading(false)
    }
    const signOut=()=>{
        authSignOut(auth).then(() => {
            clear()
        })
    }
    useEffect(()=>{
        const unsubscribe=onAuthStateChanged(auth,authStateChanged)
        return ()=>unsubscribe()
    },[
    ])
 
    return(
        <UserContext.Provider value={{signOut,currentUser,setCurrentUser,loading,setLoading}}>
            {children}
        </UserContext.Provider>
    )
}
export const useAuth=()=>{
    return useContext(UserContext)
}