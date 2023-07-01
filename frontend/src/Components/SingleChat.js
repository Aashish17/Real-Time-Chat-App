import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/chatProvider'
import { Box , FormControl, IconButton, Input, Spinner, Text, Toast, useToast} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender , getSenderFull } from '../config/ChatLogics'
import ProfileModal from './Miscellaneous/ProfileModal'
import UpdateGroupChatModal from './Miscellaneous/UpdateGroupChatModal'
import axios from 'axios'
import "./SingleChat.css"
import ScrollableChat from './ScrollableChat'
import io from 'socket.io-client'
import Lottie from 'react-lottie';
import animationData from '../Animations/typing.json'

 const ENDPOINT ="http://localhost:5000";
 var socket, selectedChatCompare;

const SingleChat = ({fetchAgain ,  setFetchAgain}) => {

    const [message, setMessage] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    const {user, selectedChat , setSelectedChat , notification, setNotification}=ChatState();
    const toast = useToast();

    const fetchMessages= async()=>{
      if(!selectedChat) return;

      try {
        const config={
            headers:{
              Authorization : `Bearer ${user.token}`
            }
          }
          setLoading(true);
          const {data}=await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`,config);
          console.log(message)
          setMessage(data);
          setLoading(false);
          socket.emit('join chat' , selectedChat._id); 
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load Messages",
          status:"error",
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        })
      }
    }
       useEffect(() => {
        socket=io(ENDPOINT);
        socket.emit("setup" ,  user);
        socket.on("connected" , ()=> setSocketConnected(true))
        socket.on("typing", ()=> setIsTyping(true));
        socket.on("stop typing",()=> setIsTyping(false));
      }, [])
      
   useEffect(() => {
     
   fetchMessages();

   selectedChatCompare=selectedChat;
   }, [selectedChat])
   
   console.log(notification , "---------------------")
    useEffect(() => {
      socket.on('message received',(newMessageReceived)=>{
        if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
         if(!notification.includes(newMessageReceived))
         {
            setNotification([newMessageReceived , ...notification]); 
            setFetchAgain(!fetchAgain);
         }
        }
        else{
          setMessage([...message, newMessageReceived]);
        }
      })
    })
    



    const sendMessage=async(event)=>{

      if(event.key==="Enter" && newMessage){
        socket.emit("stop typing", selectedChat._id)
        try {
          const config={
            headers:{
              "Content-Type" : "application/json",
              Authorization : `Bearer ${user.token}`
            }
          }
          setNewMessage("");
          const {data}=await axios.post('http://localhost:5000/api/message/ ',{
            content: newMessage,
            chatId: selectedChat._id,
          }, config
          )

          console.log(data);
          socket.emit('new message', data)

          setMessage([...message, data]);
        } catch (error) {
          
          toast({
            title:"Error Occured!",
            description : "Failed to send Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          })
        }
      }

    };

    useEffect(() => {
  // This code block will run whenever the typing state changes.
  console.log("typing:", typing);
}, [typing]);

     const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);

            if(typing)
            {

              setTyping(false);
            }
  
        console.log("prevTyping:asdasd", typing)
      }
    }, timerLength);
  };
  
      




  return (
    <>{
      selectedChat ? 
      (<>
          <Text 
          fontSize={{base: "28px" ,  md:"30px"}}
          pb={3}
          px={2}
          width="100%"
          fontFamily="Work sans"
          display={"flex"}
          justifyContent={{base : "space-between"}}
          alignItems={"center"}
          >
          <IconButton display={{base: "flex", md: "none"}}
            icon={<ArrowBackIcon/>}
            onClick={()=> setSelectedChat("")}

          />
            {!selectedChat.isGroupChat ?
           (         <>
                      {getSender(user, selectedChat.users)}
                      <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
                  </>)
            :
            (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}/>  
              </>
            ) }
          </Text>
          <Box
          display={"flex"}
          flexDir={"column"}
          justifyContent={"flex-end"}
          padding={3}
          bg={"#E8E8E8"}
          width={"100%"}
          height={"100%"}
          borderRadius={"lg"}
          overflowY={"hidden"}
          >
          {loading ? (<Spinner
          size={"xl"}
          width={20}
          height={20}
          alignSelf={"center"}
          margin={"auto"}

          />) :
          (<div className='messages'>
            <ScrollableChat  message={message}/>
          </div>)}

          <FormControl onKeyDown={sendMessage} isRequired mt={3}>
          {isTyping ? <div><Lottie
            options={defaultOptions}
            width={100}
            style={{marginBottom:15 , marginLeft:0}}
          /></div> : (<></>)}
            <Input
            variant={"filled"}
              bg="#E0E0E0"
              placeholder='Message Type Kar Bhidu 😜!!!'
              onChange={typingHandler}
              value={newMessage}
              autoComplete='false'
            />
          </FormControl>
          </Box>
       </>) 
      :
      ( <Box display="flex"  alignItems="center"  justifyContent="center" height="100%">
          <Text fontSize="3xl" paddingBottom={3} fontFamily="Work sans" color='blue'>
            Ek User pe Click karke, Chatting Shatting shuru kardo.
          </Text>

      </Box>)
    }</>
  )
}

export default SingleChat