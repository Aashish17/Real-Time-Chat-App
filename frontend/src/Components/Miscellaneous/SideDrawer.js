import { Box, Button, Tooltip , Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, useToast, Spinner } from '@chakra-ui/react';
import React, { useState } from 'react'
import { BellIcon , ChevronDownIcon} from '@chakra-ui/icons'
import { ChatState } from '../../Context/chatProvider';
import ProfileModal from './ProfileModal';
import {useHistory} from  'react-router-dom'
import ChatLoading from '../ChatLoading';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';


const SideDrawer = () => {

	const[search , setSearch]= useState("");
	const [searchResult , setSearchResult]=useState([]);
	const [loading, setLoading] =useState(false);
	const [ loadingChat, setLoadingChat] =useState(false);
	const {user , setSelectedChat, chats, setChats , notification , setNotification} =ChatState();
   const history= useHistory();
	const { isOpen, onOpen, onClose } = useDisclosure()

	const logoutHandler=()=>{
		localStorage.removeItem("userInfo");
		history.push("/");
	}

	const toast= useToast();
	const handleSearch=async()=>{
		if(!search)
		{
			toast({
				title: "PLease Enter Something in Search",
				status: "warning",
				duration: "4000",
				isClosable: true,
				position:"top-left",
			});
			return;
		}
		//why failing and getting AxiosError?

		try{
				setLoading(true)

				const config ={
					headers:{
						Authorization:`Bearer ${user.token}`,
					},
				}
				//console.log(user.token + " aashish ass143");
				const {data} =await axios.get(`http://localhost:5000/api/user?search=${search}`,config);
				//console.log(data + "aashish aasdasdasdasdss");
				//why data is empty here?
				setLoading(false);
				 setSearchResult(data);
				//  console.log(searchResult)
			

		}catch(error)
		{
			console.log(error );
				toast({
					title: "Error Occured",
					description: "Failed to Load the Search Result",
					status: "error",
					duration: 5000,
					isClosable: true,
					position: "bottom-left",
				})
		}
	}

	const accessChat= async (userId)=>{
		try{
			setLoadingChat(true)
			const config={
				headers:{
					"Content-type": "application/json",
					Authorization: `Bearer ${user.token}`,
				}
			}
			const {data}=await axios.post("http://localhost:5000/api/chat", {userId}, config);

			if(!chats.find((c)=> c._id === data._id)) 
			{setChats([data,...chats])};

			setSelectedChat(data);
			setLoadingChat(false);
			onClose();
		}
		catch(error){
				toast({
					title: "Error fetching the chat",
					description : error.message,
					status: "error",
					duration: 5000,
					isClosable: true,
					position: "bottom-left"
				})
		}
	}
  return (
	<div>
		<Box display="flex" justifyContent="space-between" 
		alignItems="center" background={"white"} width="100%" padding=" 5px 10px 5px 10px"
		borderWidth="5px"
		>
			<Tooltip label="Search Users to Chat" hasArrow placement='bottom-end'>
				<Button variant="ghost" onClick={onOpen}>
					<i class="fa fa-search" aria-hidden="true"></i>
					<Text display={{base:"none", md:'flex'}} px={"4"} > Search User</Text>
				</Button>
			</Tooltip>

			<Text fontSize="2xl" fontFamily="Work sans">Chatty Vibes Only</Text>
			<div>
				<Menu>
					 <MenuButton p={1}>
					 <NotificationBadge
						count={notification.length}
						effect={Effect.SCALE}
						
					 />
						<BellIcon fontSize={"2xl"} m={1}/>
					 </MenuButton>
					<MenuList pl={2}>
						{!notification.length && "No New Messages re bhai"}
						{notification.map(notif => (
							<MenuItem key={notif._id} onClick={()=>{
								setSelectedChat(notif.chat);
								setNotification(notification.filter((n) => n!== notif))
							}}>
							{notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}` : 
							`New Message from ${getSender(user, notif.chat.users)} `}

							</MenuItem>
						))}
					</MenuList>
				</Menu>
				<Menu>
					<MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
						<Avatar size='sm' cursor='pointer' name={user.name} src={user.pic}/>
					 </MenuButton>
					 <MenuList>
					 <ProfileModal user={user}>
						<MenuItem>My Profile</MenuItem>
						</ProfileModal>
						<MenuDivider/> 
						<MenuItem onClick={logoutHandler}>LogOut</MenuItem>
					 </MenuList>
				</Menu>
			</div>
		</Box>

		<Drawer placement="left" onClose={onClose} isOpen={isOpen}>
		<DrawerOverlay/>
		<DrawerContent>
			<DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
					<DrawerBody>
			<Box display={"flex"} pb={2}>
			<Input 
				placeholder="By Name or Email"
				mr={2}
				value={search}
				onChange={(event)=>setSearch(event.target.value)}
			/>
			<Button 
			 onClick={handleSearch}
			>Search</Button>
			</Box>
			{loading ? (<ChatLoading/>) : 
			(searchResult?.map(user=>(
				
				<UserListItem
					key={user._id}
					user={user}
					handleFunction={()=>accessChat(user._id)}
				/>
				
			)))}
			{ loadingChat &&<Spinner ml="auto" display="flex"/>}
		</DrawerBody>
		</DrawerContent>

		</Drawer>
	</div>
  )
}

export default SideDrawer