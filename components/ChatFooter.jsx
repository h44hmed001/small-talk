import React, { useEffect, useRef, useState } from 'react'
import {CgAttachment} from "react-icons/cg"
import {HiOutlineEmojiHappy} from "react-icons/hi"
import Icon from './Icon'
import EmojiPicker from 'emoji-picker-react';
import ClickAwayListener from 'react-click-away-listener';
import { useChat } from '@/context/chatContext';
import { MdDeleteForever } from 'react-icons/md';
import { AiOutlineSend } from 'react-icons/ai';
import { Timestamp, arrayUnion, deleteField, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/context/authContext';
import { v4 as uuid } from 'uuid';
import { db, storage } from '@/firebase/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const ChatFooter = () => {
  let timeout=null
  const {inputText,setInputText,isTyping,setAttachment,setAttachmentPreview,attachmentPreview,attachment,data}=useChat()
  const {currentUser}=useAuth()

    const onEmojiClick=(emojiData)=>{
      setInputText(inputText+emojiData.emoji)
    }
    const [emojiPicker,setEmojiPicker]=useState(false)
    const onChangeFile=(e)=>{
      const file=e.target.files[0]
      setAttachment(file)
      if(file){
        const blobUrl=URL.createObjectURL(file)
        setAttachmentPreview(blobUrl)
      }
    }
    const handleSend = async () => {
      if (attachment) {
          const storageRef = ref(storage, uuid());
          const uploadTask = uploadBytesResumable(storageRef, attachment);

          uploadTask.on(
              "state_changed",
              (snapshot) => {
                  // Observe state change events such as progress, pause, and resume
                  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                  const progress =
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log("Upload is " + progress + "% done");
                  switch (snapshot.state) {
                      case "paused":
                          console.log("Upload is paused");
                          break;
                      case "running":
                          console.log("Upload is running");
                          break;
                  }
              },
              (error) => {
                  console.error(error);
              },
              () => {
                  getDownloadURL(uploadTask.snapshot.ref).then(
                      async (downloadURL) => {
                          await updateDoc(doc(db, "chats", data.chatId), {
                              messages: arrayUnion({
                                  id: uuid(),
                                  text: inputText,
                                  sender: currentUser.uid,
                                  date: Timestamp.now(),
                                  img: downloadURL,
                                  read: false,
                              }),
                          });
                      }
                  );
              }
          );
      } else {
          await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                  id: uuid(),
                  text: inputText,
                  sender: currentUser.uid,
                  date: Timestamp.now(),
                  read: false,
              }),
          });
      }

      let msg = { text: inputText };
      if (attachment) {
          msg.img = true;
      }

      await updateDoc(doc(db, "userChats", currentUser.uid), {
          [data.chatId + ".lastMessage"]: msg,
          [data.chatId + ".timestamp"]: serverTimestamp(),
          [data.chatId + ".chatDeleted"]: deleteField(),
      });

      await updateDoc(doc(db, "userChats", data.user.uid), {
          [data.chatId + ".lastMessage"]: msg,
          [data.chatId + ".timestamp"]: serverTimestamp(),
      });

      setInputText("");
      setAttachment(null);
      setAttachmentPreview(null);
  };
        const onKeyup=(e)=>{
        if(e.key==="Enter"&&(inputText||attachmentPreview)){
          handleSend()
        }
      }
      const handleTyping=async(e)=>{
        setInputText(e.target.value)
        await updateDoc(doc(db,"chats",data.chatId),{
          ["typing."+currentUser.uid]:true,
        })
        if (timeout){
          clearTimeout(timeout)
        }
        timeout=setTimeout(async()=>{
          await updateDoc(doc(db,"chats",data.chatId),{
            ["typing."+currentUser.uid]:false,
          })
          timeout=null
        }
          ,20);
      }
      useEffect(()=>{
        setInputText("")
      },[data.chatId])


  return (
    <div  className='relative'>
      {attachmentPreview&&<div className='bg-blue-900 p-1 rounded-md left-3 absolute w-[100px] bottom-20 h-[auto]'>
        <img src={attachmentPreview}/>
        <div onClick={()=>setAttachmentPreview(null)} className='bg-red-700 flex items-center justify-center absolute top-0 right-0 rounded-full  h-5 w-5'>
          <MdDeleteForever size={15}/>
        </div>
      </div>}
      <div className='pr-6 flex  items-center pb-3 pl-6'>
      <Icon onClick={()=>setEmojiPicker(true)} size="large" icon={<HiOutlineEmojiHappy size={23}/>}/>
      <input onChange={onChangeFile} className='hidden' id="imageSend" type='file'/>
      <label className='' htmlFor='imageSend'>{<Icon size="large" icon={<CgAttachment size={23}/>}/>}</label>
        <input onKeyUp={onKeyup} value={inputText} onChange={handleTyping} placeholder='Send Message' className='p-3 border border-white/[0.3] pl-10 border/[0.3] outline-none rounded-3xl bg-[#19445a] w-full'/>
        <Icon onClick={handleSend} className={`ml-4 p-2 flex items-center justify-center ${inputText.trim().length>0 ? "cursor-pointer bg-sky-500": ""}`} size="large" icon={<AiOutlineSend size={25}/>} />
      </div>
      {emojiPicker&&
      <ClickAwayListener onClickAway={()=>setEmojiPicker(false)}>
      <div className='absolute bottom-14 left-5'>
      <EmojiPicker emojiStyle='native'  onEmojiClick={onEmojiClick} autoFocusSearch={true} theme='dark'/>
      
      </div>
      </ClickAwayListener>
      }
      {isTyping&&<div className='absolute flex gap-2  items-center opacity-50 left-7  -top-11'>
        <span>{`${data?.user?.displayName} is typing`}</span>
        <img className='h-5' src="/typing.svg" />
      </div>}


    </div>
  )
}

export default ChatFooter
