const jwt = require('jsonwebtoken')

const generateToken =(id)=>{
console.log(id + " aas")
    return jwt.sign({id}, process.env.JWT_SECRET || "aashishkanesh123",{
        expiresIn:"300d",
    });
};
module.exports= generateToken;