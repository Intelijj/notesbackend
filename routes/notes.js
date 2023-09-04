const express = require('express')
const router=express.Router(); 
const Notes=require('../models/Notes')
const fetchuser=require('../middlleware/fetchuser')
const { body, validationResult } = require('express-validator');


// get all notes 
router.get('/fetchnotes',fetchuser, async (req,res)=>{
    let notes = await Notes.find({user:req.user.id})
   
    res.json(notes)
})
// add a note 
router.post('/addnote',fetchuser,[
    body('title').isLength({min:3}),
    body('description').isLength({min:5})
], async (req,res)=>{
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return  res.send({ errors: result.array() });
    } 
    const {title,description,tag}=req.body;
    const note =new Notes({
        title,description,tag,user:req.user.id
    })
    const savednote = await note.save();
   
    res.json(savednote)
})



// update a note 
router.put('/updatenote/:id',fetchuser, async (req,res)=>{
    const {title,description,tag}=req.body;
    const newnote={}
    if(title){
        newnote.title=title;
    }
    if(description){
        newnote.description=description;
    }
    if(tag){
        newnote.tag=tag;
    }
let note =await Notes.findById(req.params.id)
if(!note) return res.status(404).send("not found ")
if(note.user.toString()!==req.user.id) return res.status(401).send("not allowed ")

note =  await Notes.findByIdAndUpdate(req.params.id,{$set : newnote},{new :true});
res.json({note})

})

// delete a note 
router.delete('/deletenote/:id',fetchuser, async (req,res)=>{
   
    
let note =await Notes.findById(req.params.id)
if(!note) return res.status(404).send("not found ")
if(note.user.toString()!==req.user.id) return res.status(401).send("not allowed ")

note =  await Notes.findByIdAndDelete(req.params.id);
res.json("success note deleted")

})



module.exports=router