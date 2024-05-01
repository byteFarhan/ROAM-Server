const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const prot = process.env.PORT || 5000;

//Middle-Ware
app.use(cors());
app.use(express.json());

// const uri = `mongodb://mongo:pvOVforYAvDvFHYRgiMNluhWgagEwMli@roundhouse.proxy.rlwy.net:39431`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster-b9a10.dliqx6o.mongodb.net/?retryWrites=true&w=majority&appName=cluster-B9A10`;
// console.log(process.env.DB_USER);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const uri =
  "mongodb+srv://farhanmazumder75:RrIlBw1KEt2dLs4B@cluster0.l6om5es.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
//All Database collections
// const database = client.db("B9A10-ROAM");
// const tourist_spotsCollection = database.collection("tourist_spot");
const tourist_spotsCollection = client.db("ROAM").collection("tourist_spots");
const countries_tourist_spots = client
  .db("ROAM")
  .collection("countries_tourist_spots");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // get :: all tourist_spot
    app.get("/tourist_spots", async (req, res) => {
      try {
        const coursor = tourist_spotsCollection.find();
        const result = await coursor.toArray();
        res.send(result);
      } catch (err) {
        console.log(err);
        return res.send({ error: true, massage: err.massage });
      }
    });
    // get :: single tourist_spot
    app.get("/tourist_spots/:id", async (req, res) => {
      try {
        const id = req.params.id;
        //   const idInt = parseInt(id);
        //   console.log(idInt);
        //   console.log(id);
        const query = { _id: new ObjectId(id) };
        const result = await tourist_spotsCollection.findOne(query);
        res.send(result);
      } catch (err) {
        return res.send({ error: true, massage: err.massage });
      }
    });
    // Post :: insert single tourist spot in countries_tourist_spots collection in DB
    app.post("/countries_tourist_spots", async (req, res) => {
      try {
        const newTouristSpot = req.body;
        // console.log(newTouristSpot);
        const result = await countries_tourist_spots.insertOne(newTouristSpot);
        res.send(result);
      } catch (err) {
        return res.send({ error: true, massage: err.massage });
      }
    });

    // Get :: find multiple data from countries_tourist_spots collection
    app.get("/countries_tourist_spots", async (req, res) => {
      try {
        const result = await countries_tourist_spots.find().toArray();
        res.send(result);
      } catch (err) {
        return res.send({ error: true, massage: err.massage });
      }
    });

    // Get :: find single data from countries_tourist_spots collection
    app.get("/countries_tourist_spots/:id", async (req, res) => {
      try {
        const id = req.params.id;
        //   console.log(id);
        const query = { _id: new ObjectId(id) };
        const result = await countries_tourist_spots.findOne(query);
        res.send(result);
      } catch (err) {
        console.log(err);
        return res.send({ error: true, massage: err.massage });
      }
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//get
app.get("/", (req, res) => {
  res.send("Roam Server is running...");
});

// // get tourist_spot
// app.get("/tourist_spot", async (req, res) => {
//   res.send();
// });

app.listen(prot, () => {
  console.log(`ROAM server is running on port ${prot}`);
});
