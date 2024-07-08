const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000

// midlewere
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sf3cbqp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(process.env.DB_USER);
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
    const requistCollection = client.db('foodDb').collection('requist');



    // food ralated api
    app.get('/food', async (req, res) => {
      // console.log('token owenr info',req.user);
      const {search, sort} = req.query;
      
      let query = {}
      if(search){
         query = {
          foodname: {$regex: search, $options: 'i'}
        };
      }
    
      const option = {
        sort: {
          ExpiredDate: sort === 'asc' ? 1: -1
        }
      };
      const cursor = foodCollection.find(query, option);
      const result = await cursor.toArray();
      res.send(result)
    })
  

    app.get('/food/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await foodCollection.findOne(query)
      res.send(result)
    })

    app.get('/request/:email', async (req, res) => {
      console.log(req.params.email);
      const result = await foodCollection.find({ email: req.params.email }).toArray();
      res.send(result)
    })
    app.get('/all/:foodname', async (req, res) => {
      console.log(req.params.foodname);
      const result = await foodCollection.find({ foodname: req.params.foodname }).toArray();
      res.send(result)
    })

    // post data
    app.post('/food', async (req, res) => {
      const newfood = req.body;
      console.log(newfood);
      const result = await foodCollection.insertOne(newfood);
      res.send(result)
    })
    
      // updete
      app.put('/food/:id', async (req, res) => {
        const id =  req.params.id;
        const filter = {_id: new ObjectId(id)}
        const option = { upsert: true };
        const updedfood = req.body;
        const food = {
         $set: {
            foodname: updedfood.foodname,
            foodphoto: updedfood.foodphoto,
            ExpiredDate: updedfood.ExpiredDate,
            notes: updedfood.notes,
            quantity: updedfood.quantity,
            location: updedfood.location,
           
            

            
   
         }
        }
        const result = await foodCollection.updateOne(filter, food, option);
        res.send(result)
       })


    // delete data
    app.delete('/food/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await foodCollection.deleteOne(query);
      res.send(result);
    })

    // requistCollection ar jonno-----------------------------------
    app.post('/add', async (req, res) => {
      const requist = req.body;
      console.log(requist);
      const result = await requistCollection.insertOne(requist);
      res.send(result)
    })
    app.get('/requist', async (req, res) => {
      // console.log('token owenr info',req.user);
      const cursor = requistCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    app.get('/requist/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await requistCollection.findOne(query)
      res.send(result)
    })

    
    app.get('/requist1/:email', async (req, res) => {
      console.log(req.params.email);
      const result = await requistCollection.find({ email: req.params.email }).toArray();
      res.send(result)
    })

    // await client.connect();
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
  res.send('Foods server running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})