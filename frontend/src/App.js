import React from "react";
// import { Button, ButtonGroup } from '@chakra-ui/react'
import { Route } from "react-router-dom";
import HomePage from "./Pages/Homepage";
import ChatPage from "./Pages/Chatpage";
import './App.css'
function App(){

	return(<div className="App">
	{/* we use exact here because when we do /chats it also consider / as root so print both component
	so by doing exact it will render our compmenet only when we have similar path */}
		<Route path="/" component={HomePage} exact/>
		<Route path="/chats" component={ChatPage}/>
	 </div>)
	 
}

export default App;