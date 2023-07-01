const express= require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const {chats}= require('./data.js')
const connectDB = require("./config/db.js")
const colors = require("colors");
const userRoutes = require("./routes/userRoutes.js")
const chatRoutes = require("./routes/chatRoutes.js")
const messageRoutes = require("./routes/messageRoutes.js")
const {notFound , errorHandler}=require("./middleware/errorMiddleware")
 

dotenv.config()

const app= express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

connectDB();
const port= process.env.PORT

console.log({port})

app.use(express.json()); // to accept json data
app.get("/",(req,res)=>{

    res.send("<div><h1>Aashish </h1></div>")
})

app.use('/api/user',userRoutes);
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)
app.use(notFound)
app.use(errorHandler)
// app.get("/api/chat" ,(req,res)=>{

//     res.send(chats);
// })

const server= app.listen( 5000 , ()=>{
    console.log(`Hurray! it is running ` + 5000 )
})


const io= require('socket.io')(
    server,{
        pingTimeout: 60000,
        cors:{
            origin: "http://localhost:3000"
        },
    }
)


io.on("connection" , (socket)=>{
    console.log('connected to socket.io')

        socket.on('setup',(userData)=>{
        socket.join(userData._id);
       
        socket.emit("connected")
    })

    socket.on('join chat', (room)=>{
        socket.join(room);
        console.log('User Joined Room: ' + room);
    })

    socket.on("typing", (room)=> socket.in(room).emit("typing"));
    
    socket.on("stop typing", (room)=> socket.in(room).emit("stop typing"));

    socket.on('new message', (newMessageReceived)=>{
       var chat=newMessageReceived.chat;
       
       if(!chat.users) return console.log("Chats. users are not defined");

        chat.users.forEach(user => {
            if(user._id == newMessageReceived.sender._id) return ;

            socket.in(user._id).emit("message received" , newMessageReceived);
        });
    })

    socket.off("setup", ()=>{
        console.log("User Disconnected");
        socket.leave(userData._id);
    })
})