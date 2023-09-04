const jwt = require('jsonwebtoken');



const fetchuser=(req,res,next)=>{
    const token=req.header('checktoken')
    if(!token){
        return res.status(401).json({error:"please use valid token"})
    }
const data =jwt.verify(token,'shhhh');
req.user=data.user;
next();
}
module.exports=fetchuser;