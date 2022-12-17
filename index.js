const express = require('express');
 const  app= express();
 const cors=require("cors")
 const port=process.env.PORT || 5000
 const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@474.79d3jxt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



const run=async()=>{

try{
  const productcollection=client.db("carDeller").collection("products")


  const orderscollection=client.db("carDeller").collection("orders")


 
//  load all products

app.get("/cars",async(req,res)=>{

   const query={};
  const result=await productcollection.find(query).toArray()
  res.send(result)
})


app.get("/cars/:id",async(req,res)=>{
 const id=req.params.id
 const query={_id: ObjectId(id)}
 const result=await productcollection.findOne(query)
 console.log(result)
 res.send(result)

})




//order post
app.post("/orders",async(req,res)=>{
  const order=req.body;
  const result=await  orderscollection.insertOne(order)
  console.log(result)
  res.send(result)
})

app.get("/orders",async(req,res)=>{
let query={}
if(req.query.email){
  query={  
    email:req.query.email
  }
}
const result=await orderscollection.find(query).toArray()
res.send(result)



})


app.delete("/orders/:id",async(req,res)=>{
  const id=req.params.id
  const query={_id: ObjectId(id)}
  const result=await orderscollection.deleteOne(query)
  console.log(result)
  res.send(result)
})



app.patch("/orders/:id", async (req, res) => {
  const id=req.params.id
   const query={_id: ObjectId(id)}
   const status=req.body.status
   const uptdoc={
    $set:{
      status:status
    }
   }
   const result=await orderscollection.updateOne(query,uptdoc)
   console.log(result)
   res.send(result)
})










}
finally{}


}
run().catch(ero=>console.log(ero))
