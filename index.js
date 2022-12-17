const express = require('express');
 const  app= express();
 const cors=require("cors")
 const port=process.env.PORT || 5000

 require('dotenv').config()


app.use(express.json())
app.use(cors())


 app.get("/",(req,res)=>{
     res.send("car deller  server")
 })

 app.listen(port,()=>{
     console.log(`car server  running is this port ${port}`)
 });
 



//  mongo db code





const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@474.79d3jxt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri)
