import { Box } from "@chakra-ui/react";
import ChatBox from "../Components/Miscellaneous/ChatBox";
import MyChats from "../Components/Miscellaneous/MyChats";
import SideDrawer from "../Components/Miscellaneous/SideDrawer";
import { ChatState } from "../Context/chatProvider"
import { useState } from "react";


const Chatpage = () => {
 
  const { user} =ChatState();
  const [fetchAgain,setFetchAgain]=useState(false);
  
  return (
    <div style={{width: "100%"}}>
    {user && <SideDrawer/>}
    <Box display='flex' justifyContent='space-between' width='100%' height='91.5vh' padding='10px'>
      {user && <MyChats fetchAgain={fetchAgain}  />}
      {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}  
      
    </Box>
    </div>
  )
}

export default Chatpage;