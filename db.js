const mongoose= require('mongoose');
const mongoURI="mongodb://127.0.0.1:27017/noteinfinity"

const connectm=()=>{
    mongoose.connect(mongoURI,).then(()=>console.log('hello')).catch((err)=>{console.error(err);});

}

module.exports=connectm;