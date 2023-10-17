const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require("cors")
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


// connect to mongoDB


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.hf0b3tt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const usersManagement = client.db("managementDB").collection("users")


    // users get endpoint
    app.get("/users", async(req, res)=>{
      const cursor = usersManagement.find();
      const result = await cursor.toArray()
      res.send(result)
    })

    // get a single user endpoint
    app.get("/users/:id", async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await usersManagement.findOne(query);
      res.send(result)
    })
    // users post endpoint
    app.post("/users", async(req, res)=>{
        const user = req.body;
        const result = await usersManagement.insertOne(user)
        res.send(result)
    })

    // update a user. put endpoint
    app.put("/users/:id", async(req, res)=>{
      const id = req.params.id;
      const user = req.body
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true}
      const updatedUser = {
        $set: {
          name: user.name,
          email: user.email,
          gender: user.gender,
          role: user.role,
          password: user.password
        }
      }
      const result = await usersManagement.updateOne(filter, updatedUser, options)
      res.send(result)
    })

    // users delete endpoint
    app.delete("/users/:id", async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await usersManagement.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);



app.get("/", (req, res)=>{
    res.send("User management system")
})

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`)
})

// MtLLTThFX2WyIFnN
// new_user