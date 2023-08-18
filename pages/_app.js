import { UserProvider } from '@/context/authContext'
import { ChatProvider } from '@/context/chatContext'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return(
    <UserProvider>
      <ChatProvider>
      <Component {...pageProps} />
      </ChatProvider>
    </UserProvider>
  )
   
}
