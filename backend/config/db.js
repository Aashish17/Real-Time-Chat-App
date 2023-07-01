const mongoose = require("mongoose")

const connectDB = async ()=>{
    try{
        mongoose.set("strictQuery", false);
        const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://aashishkanesh99:Akdn1aashish.@cluster0.ey7uqml.mongodb.net/?retryWrites=true&w=majority",{
            useNewUrlParser : true,
            useUnifiedTopology : true,
            
        });

        console.log(`MongoDb Connected: ${conn.connection.host}`);
    } catch(error){
        console.log(`Error : ${error.message}` .red.bold);
        process.exit();
    }
};

module.exports = connectDB;