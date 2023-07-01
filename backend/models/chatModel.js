const mongoose = require('mongoose')
// trim is used if there is spaces at the back it will remove it
const chatSchema = mongoose.Schema({
	chatName:{type : String , trim : true},
	isGroupChat:{type : Boolean , default : false},
	users:[{
		type: mongoose.Schema.Types.ObjectId,
		ref : "User",

	}],
	latestMessage : {
		type : mongoose.Schema.Types.ObjectId,
		ref : "Message"
	},
	groupAdmin :{ 
		type :mongoose.Schema.Types.ObjectId ,
		 ref: "User"
		},

},
{
	timestamps:true,
})

const Chat = mongoose.model("Chat", chatSchema);
module.exports= Chat;