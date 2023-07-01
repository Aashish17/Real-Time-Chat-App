import { useEffect } from 'react';
import {createContext , useContext, useState}  from 'react'
import { useHistory } from "react-router-dom";
import { navigate } from '@reach/router';
const ChatContext =createContext();

const ChatProvider =({children})=>{
  
	const [user, setUser]=useState();
	const [selectedChat , setSelectedChat] = useState()
	const [chats, setChats] =useState([]);
	const [notification, setNotification]=useState([]);

	useEffect(() => {
    const fetchUserData = async () => {
      const userInfo = await JSON.parse(localStorage.getItem("userInfo"));
	  console.log(userInfo.token)
	  
      setUser(userInfo);
	  console.log(user)
      if (!userInfo) {
        navigate("/");
      }
    };
    fetchUserData();
  }, [navigate])


	// const history =useHistory();

	// useEffect(()=>{
	//   const userInfo= JSON.parse(localStorage.getItem("userInfo"))
	//  console.log("==========",JSON.parse(localStorage.getItem("userInfo"))) 
	
	//     setUser(userInfo);

	//     if(!userInfo&&history){
	//         history.push("/");
	//     }
	
	// },[history])
  
	return (
		<ChatContext.Provider value={{user, setUser , selectedChat , setSelectedChat , chats , setChats, notification , setNotification}}>
			{children}
		</ChatContext.Provider>
	)
}

 export const ChatState=()=>{	
	return (useContext(ChatContext));
 }

export default ChatProvider;