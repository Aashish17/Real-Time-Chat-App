const mongoose = require('mongoose')
const bcrypt =require('bcryptjs')
const userSchema = mongoose.Schema({
    name:{type: String , required: true},
    email: {type: String , required: true , unique : true},
    password:{type: String , required: true},
    pic:{
        type: String , 
         default : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkB8pufl3qnzrT75Vm78Ik-CFITfhqf8sNeQVoQfrI487_UPSXp4NXL-o_CqMBkEQzPeaNjHM33D0&usqp=CAU&ec=48600113"
        
    }
},
{
    timestamps: true
});

userSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.pre('save',async function(next){
    if(!this.isModified){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})
const  User = mongoose.model("User", userSchema);

module.exports= User;