import { useContext,createContext, useState, useReducer } from "react";
import { useAuth } from "./authContext";
const ChatContext=createContext()
export const ChatProvider=({children})=>{
    const [users,setUsers]=useState(false)
    const [chats,setChats]=useState([])
    const {currentUser}=useAuth()
    const [selectedChat,setSelectedChat]=useState(null)
    const [inputText,setInputText]=useState("")
    const [isTyping,setIsTyping]=useState(false)
    const [attachment,setAttachment]=useState(null)
    const [attachmentPreview,setAttachmentPreview]=useState(null)
    const [imageViewer,setImageViewer]=useState(null)
    const INITIAL_STATE = {
        chatId: "",
        user: null,
    };

    const chatReducer = (state, action) => {
        switch (action.type) {
            case "CHANGE_USER":
                return {
                    user: action.payload,
                    chatId:
                        currentUser.uid > action.payload.uid
                            ? currentUser.uid + action.payload.uid
                            : action.payload.uid + currentUser.uid,
                };
            case "EMPTY":
                return INITIAL_STATE;
            default:
                return state;
        }
    };
    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
    return(
    <ChatContext.Provider value={{imageViewer,setImageViewer,attachmentPreview,setAttachmentPreview,attachment,setAttachment,isTyping,setIsTyping,inputText,setInputText,data:state,dispatch,selectedChat,setSelectedChat,chats,setChats,users,setUsers}}>
            {children}
        </ChatContext.Provider>)
}
export const useChat=()=>useContext(ChatContext)