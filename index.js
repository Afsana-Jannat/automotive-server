const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nbzul73.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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
    // await client.connect();

    const automotiveCollection = client.db('automotiveDB').collection('automotive');
    const productCollection = client.db('automotiveDB').collection('products');
    const userCollection = client.db('automotiveDB').collection('user');


    app.get('/automotive', async(req, res) =>{
        const cursor = automotiveCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    //get single brand images
    app.get('/brand/:name', async(req, res) => {
        const name = req.params.name;
        const query = {brand:name}
        const result = await automotiveCollection.findOne(query);
        res.send(result);
    })

    app.get('/automotive/:name', async(req, res) => {
        const name = req.params.name;
        const query = {brand:name}
        const result = await productCollection.find(query).toArray();
        res.send(result);
    })


    // get single product
    app.get('/details/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await productCollection.findOne(query);
        res.send(result);
    })


    app.post('/automotive', async(req, res) =>{
        const newAutomotive = req.body; 
        const result = await productCollection.insertOne(newAutomotive);
        res.send(result);
    })

    app.put('/automotive/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedAutomotive = req.body;
      const automotive = {
        $set: {
          name: updatedAutomotive.name,
          brand: updatedAutomotive.brand,
          type: updatedAutomotive.type,
          prices: updatedAutomotive.prices,
          description: updatedAutomotive.description,
          image: updatedAutomotive.image
        }
      }

      const result = await productCollection.updateOne(filter, automotive, options)
      res.send(result)
    })

    app.delete('/automotive/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await automotiveCollection.deleteOne(query);
        res.send(result);
    })

    // user related apis
    app.get('/user', async(req, res) =>{
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    })

    app.post('/user', async(req, res) =>{
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    app.delete('/user/:id', async(req, res) =>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Automotive making server is running')
})

app.listen(port, () => {
    console.log(`Automotive server is running on port: ${port}`)
})




