const connectm=require('./db'); 
const express = require('express')
var cors = require('cors')
const app = express()
const port = 5000



app.use(cors())
app.use(express.json())

app.use('/api/check',require('./routes/check'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
connectm(); 