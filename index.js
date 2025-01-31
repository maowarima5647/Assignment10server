const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port =process.env.PORT || 5000;

//MIDDLEWARE  
app.use(cors())
app.use(express.json())
app.get('/',(req,res)=>{
    res.send("coffe maker is running")
})
app.listen (port, () => {
    console.log(`coffe cerver`)
})
//gamemaster
//iNXgaUxYORje8bCI

//console.log(process.env.DB_USER)
//console.log(process.env.DB_PASS)
const uri = "mongodb+srv://gamemaster:iNXgaUxYORje8bCI@cluster0.1cthp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    // Send a ping to confirm a successful connection
   const gamecollection = client.db('gameDB').collection('game');

  const usercollection = client.db('gameDB').collection('user')
  // Add a new collection for the watchlist
  const watchlistCollection = client.db('gameDB').collection('watchlist');



   app.get('/game',async (req,res) =>{
    const cursor = gamecollection.find()
    const result = await cursor.toArray()
    res.send(result);
  })
 


    app.post('/game',async (req,res) =>{
      const newgame =req.body;
      console.log(newgame)
      const result = await gamecollection.insertOne(newgame)
      res.send(result);
    })

app.put('/game/:id',async(req,res) =>{
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const options = {upsert:true};
  const updategame =req.body;
  const game ={
    $set:{
      name:updategame.name,
      difficulty:updategame.difficulty,
      moment:updategame. moment,
      feature:updategame.feature,
      Graphics: updategame.Graphics,
      rating:updategame.rating,
    }
  }
  const result = await gamecollection.updateOne(filter,game,options)
  res.send(result)
})


app.delete('/game/:id',async (req,res) =>{
  const id =req.params.id;
  const query ={_id:new ObjectId(id)}
  
  const result = await gamecollection.deleteOne(query)
  res.send(result);
})

//user related apis

app.get('/user',async (req,res) =>{
  const cursor = usercollection.find()
  const result = await cursor.toArray()
  res.send(result);
})

app.get('/game/:id', async (req, res) => {
  const { id } = req.params;
  const game = await gamecollection.findOne({ _id: new ObjectId(id) });
  
  if (game) {
      res.send(game);
  } else {
      res.status(404).send({ message: 'Game not found' });
  }
});

const reviewCollection = client.db('gameDB').collection('reviews');

// 1. Get All Reviews for a specific user
app.get('/reviews', async (req, res) => {
  const userEmail = req.query.userEmail; // Assuming you're passing userEmail in query param
  const reviews = await reviewCollection.find({ userEmail }).toArray();
  res.send(reviews);
});

// 2. Get a specific review by ID
app.get('/reviews/:id', async (req, res) => {
  const { id } = req.params;
  const review = await reviewCollection.findOne({ _id: new ObjectId(id) });
  
  if (review) {
    res.send(review);
  } else {
    res.status(404).send({ message: 'Review not found' });
  }
});

// 3. Post a new review
app.post('/reviews', async (req, res) => {
  const newReview = req.body;  // review object should contain userEmail, gameTitle, rating, etc.
  const result = await reviewCollection.insertOne(newReview);
  res.send(result);
});

// 4. Update an existing review
app.put('/reviews/:id', async (req, res) => {
  const { id } = req.params;
  const updateReview = req.body;  // Object with fields to be updated
  
  const filter = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: updateReview,
  };

  const result = await reviewCollection.updateOne(filter, updateDoc);
  res.send(result);
});

// 5. Delete a review
app.delete('/reviews/:id', async (req, res) => {
  const { id } = req.params;
  const query = { _id: new ObjectId(id) };
  
  const result = await reviewCollection.deleteOne(query);
  res.send(result);
});







    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);
