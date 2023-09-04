const express = require('express')
const router=express.Router(); 
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User=require('../models/User')
const fetchuser=require('../middlleware/fetchuser')



router.post('/createuser',[body('email').isString(),body('name').isLength({max:10})

],async (req,res)=>{
  let success=false;
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return  res.send({ errors: result.array() });
  }
 let user = await User.findOne({email:req.body.email});
 if(user){
  return res.status(400).json({success,error:"sorry please use new email this is already in use"})
 }
const salt = await bcrypt.genSalt(10);
   const safepass =  await bcrypt.hash(req.body.password,salt);
user= await  User.create({
    name: req.body.name,
    password:safepass,
    email: req.body.email,
  })
  const data={
    user:{
      id:user.id
    }
  }
  const jwtoken=jwt.sign(data,'shhhh')
  success=true

  res.json({success,jwtoken});


  // res.json(user);
})


router.post('/login',[body('email').isString(),body('password').exists(),

],async (req,res)=>{
  let success=false;
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return  res.send({ errors: result.array() });
  }

const {email,password}=req.body;
let user = await User.findOne({email});
if(!user){
  return res.status(400).json({error:"give proper credntials "})
}

const cpassword = await bcrypt.compare(password,user.password);
if(!cpassword){
  success=false
  return res.status(400).json({success,error:"give proper credntials "})
}
const data={
  user:{
    id:user.id
  }
}
const jwtoken=jwt.sign(data,'shhhh')
success=true;

res.json({success,jwtoken});


})


// getting  logged in user information
router.post('/getuser',fetchuser,async (req,res)=>{

userid=req.user.id;
const user = await User.findById(userid).select("-password")
res.send(user)





})

module.exports=router