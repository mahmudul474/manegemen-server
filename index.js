const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
var jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("car deller  server");
});

app.listen(port, () => {
  console.log(`car server  running is this port ${port}`);
});

////veryfyjwt

function veryfyjwt  (req, res, next)  {
  const authheader = req.headers.authorization;
  if (!authheader) {
    return res.status(401).send("unauthorized" );
  }
  const token = authheader.split(' ')[1];
 
  jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized" });
    }
    req.decoded = decoded;
    next();
  });
};

//  mongo db code

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@474.79d3jxt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
});

const run = async () => {
  try {
    const productcollection = client.db("carDeller").collection("products");
    const orderscollection = client.db("carDeller").collection("orders");
  const enginiercollection=client.db("carDeller").collection("enginiers");
    const userCollection = client.db("carDeller").collection("users");

    ///jwt

    app.get("/jwt", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      if (user) {
        const token = jwt.sign({email},process.env.JWT_ACCESS_TOKEN, {
          expiresIn: "1d"
        });

        return res.send({ accesToken: token });
      }

      res.status(403).send({ accesToken: "" });
    });








    app.post("/users", async (req, res) => {
      const users = req.body;
      const result = await userCollection.insertOne(users);
      res.send(result);
    });

    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const options = { upsert: true };
      const fileter = { email: email };
      const uptdoc = {
        $set: {
          email: user.email,
          name: user.name
        }
      };

      const result = await userCollection.updateOne(fileter, uptdoc, options);
      res.send(result);
    });







///get all users


app.get("/users",async(req,res)=>{
  const query={}
  const users = await userCollection.find(query).toArray()
  res.send(users);
})


//admin route

app.put("/users/admin/:id", veryfyjwt,async(req,res)=>{

  const decodedEmail=req.decoded.email;
  const query={email:decodedEmail}
  const user = await userCollection.findOne(query);
  if (user?.role !=="admin") {
    return res.status(403).send({ message: "unauthorized" });
  }
  const id = req.params.id;
   const filter={_id:ObjectId(id)}
   const options={upsert:true}
   const uptdoc={
    $set:{
      role:"admin",
    }
   }
const result=await userCollection.updateOne(filter,uptdoc,options)
res.send(result);

})


///get admin

app.get("/admin/users/:email",async(req,res)=>{
const email=req.params.email
const query={email:email}
const user=await userCollection.findOne(query)
res.send({isAdmin:user?.role==="admin"})

})





    //  load all products

    app.get("/cars", async (req, res) => {
      const query = {};
      const result = await productcollection.find(query).toArray();
      res.send(result);
    });

    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productcollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    //order post
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderscollection.insertOne(order);
      console.log(result);
      res.send(result);
    });

    app.get("/orders", veryfyjwt, async (req, res) => {
    const email= req.query.email
    const query = { email: email };
       
const decodedEmail = req.decoded.email;
if(email !== decodedEmail){
  return res.status(403).send({message:"Invalid"});

}



      

      const result = await orderscollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderscollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });

    app.patch("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const status = req.body.status;
      const uptdoc = {
        $set: {
          status: status
        }
      };
      const result = await orderscollection.updateOne(query, uptdoc);
      console.log(result);
      res.send(result);
    });









//add speciyalty

 app.get("/servicEnginer", async (req, res) => {
   const query = {};
   const result = await productcollection.find(query).project({title:1}).toArray();
   res.send(result);
 });


 /// add ingniyer

 app.post("/servicEnginer", async (req, res) => {
   const query = {};
   const result = await enginiercollection.insertOne(query);
   
   res.send(result);
 })





  } finally {
  }
};
run().catch((ero) => console.log(ero));
