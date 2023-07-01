import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/chatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName,setGroupChatName] =useState();
    const [selectedUsers ,  setSelectedUsers] = useState([]);
    const [ search , setSearch] =useState("");
    const [searchResult ,  setSearchResult] = useState([]);
    const [loading, setLoading]=useState(false);

    const  toast =useToast();

    const {user, chats, setChats} = ChatState();

    const handleSearch=async (query)=>{
        setSearch(query);

        if(!query){ 
            return;
        }

        try{
            setLoading(true);
            const config={
			            headers:{
					        Authorization: `Bearer ${user.token}`, 
                }
              }
			
			    const {data}=await axios.get(`http://localhost:5000/api/user?search=${search}`,  config);
			
            setLoading(false);
			      setSearchResult(data);
     

        } catch(error){

            toast({
					title: "Error Occured",
					description: "Failed to Load the Group Result",
					status: "error",
					duration: 5000,
					isClosable: true,
					position: "bottom-left",
				})

        }
    }

        const handleSubmit= async()=>{
            if(!groupChatName || !selectedUsers){
                toast({
					title: "Please fill all the fields",
					status: "warning",
					duration: 5000,
					isClosable: true,
					position: "top",
				})
                return ;    
            }
              try{
                const config={
                  headers:{
                    Authorization: `Bearer ${user.token}`, 
                  }
                }

  

            
            const {data}= await axios.post("http://localhost:5000/api/chat/group",
            {
                name:groupChatName,
                users: JSON.stringify(selectedUsers.map((u)=> u._id)),
            }, config)
            
                
                setChats([data,...chats]);
                onClose();
                  toast({
                    title: "Hurray! New Group Chat Created",
                    status: "Success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                  })

                

                }catch(error){
                   
                      toast({
                        title: "Failed to create Group!",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom",
                      })
                      } 
                      }



        const handleDelete=(deleteUser)=>{
            setSelectedUsers(selectedUsers.filter((sel)=> sel._id !== deleteUser._id))
        }

    const handleGroup=(userToAdd)=>{
        if(selectedUsers.includes(userToAdd)){
            toast({
					title: "User Already Added",
					status: "warning",
					duration: 5000,
					isClosable: true,
					position: "bottom-left",
				})
                return ;
        }

        setSelectedUsers([...selectedUsers , userToAdd]);
    }

  return (
   
    <div>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize="35px"
          fontFamily="Work sans"
          display="flex"
          justifyContent="center"
          >Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display="flex"
          flexDir="column" 
          alignItems="center">
           
           <FormControl>
                <Input placeholder="Group Name"   marginBottom={3}   onChange={(event) => setGroupChatName(event.target.value)}/>
           </FormControl>

            <FormControl>
                <Input placeholder="Add Users Ex :- Aashish , Ram" marginBottom={1}  onChange={(event) => handleSearch(event.target.value)}/>
           </FormControl>
             <Box width ="100%" display="flex" flexWrap="wrap">
            {selectedUsers.map( user=>(
                <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleFunction={()=> handleDelete(user)}
                />
            ))}
                </Box>
             {loading ? (
                <div>loading</div>
                ) : (
                searchResult &&
                searchResult
                    .slice(0, 4)
                    .map((user) => (
                    <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleGroup(user)}
                    />
                    ))
                )}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='cyan' mr={3} onClick={handleSubmit}>
              Create Group
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>  
  
  )
}

export default GroupChatModal