const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const prot = process.env.PORT || 5000;

//Middle-Ware
app.use(cors());
app.use(express.json());

//functions
function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// const uri = `mongodb://mongo:pvOVforYAvDvFHYRgiMNluhWgagEwMli@roundhouse.proxy.rlwy.net:39431`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster-b9a10.dliqx6o.mongodb.net/?retryWrites=true&w=majority&appName=cluster-B9A10`;
// console.log(process.env.DB_USER);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const uri =
//   "mongodb+srv://farhanmazumder75:RrIlBw1KEt2dLs4B@cluster0.l6om5es.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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
const tourist_spots = client.db("B9A10-ROAM").collection("tourist_spots");
const countriesCollection = client.db("B9A10-ROAM").collection("countries");
const testimonialCollection = client.db("B9A10-ROAM").collection("testimonial");
// const all_spots = client.db("B9A10-ROAM").collection("all_spots");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // get :: all && multiple tourist_spot
    app.get("/tourist_spots", async (req, res) => {
      try {
        let query = {};
        if (req.query.email) {
          //   console.log(req.query.email);
          query = { userEmail: req.query.email };
        } else if (req.query.country) {
          // console.log(capitalizeFirstLetter(req.query.country));
          query = { countryName: capitalizeFirstLetter(req.query.country) };
        }
        // const options = {
        //   projection: {},
        // };
        const coursor = tourist_spots.find(query);
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
        // console.log(id);
        const query = { _id: new ObjectId(id) };
        const result = await tourist_spots.findOne(query);
        res.send(result);
      } catch (err) {
        return res.send({ error: true, massage: err.massage });
      }
    });
    // Post :: insert single tourist spot in tourist_spots collection in DB
    app.post("/tourist_spots", async (req, res) => {
      try {
        const newTouristSpot = req.body;
        // console.log(newTouristSpot);
        const result = await tourist_spots.insertOne(newTouristSpot);
        res.send(result);
      } catch (err) {
        return res.send({ error: true, massage: err.massage });
      }
    });

    // PUT :: update single tourist spot in tourist_spots collection in DB
    app.put("/tourist_spots/:id", async (req, res) => {
      const id = req.params.id;
      const getSpot = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedSpot = {
        $set: {
          touristsSpotName: getSpot.touristsSpotName,
          countryName: getSpot.countryName,
          travelTime: getSpot.travelTime,
          seasonality: getSpot.seasonality,
          totalVisitorsPerYear: getSpot.totalVisitorsPerYear,
          departure: getSpot.departure,
          location: getSpot.location,
          age: getSpot.age,
          description: getSpot.description,
          image: getSpot.image,
          cost: getSpot.cost,
        },
      };
      const result = await tourist_spots.updateOne(
        filter,
        updatedSpot,
        options
      );
      res.send(result);
    });

    // DELETE :: delete single data from tourist_spots collection
    app.delete("/tourist_spots/:id", async (req, res) => {
      try {
        const id = req.params.id;
        //   console.log(id);
        const query = { _id: new ObjectId(id) };
        const result = await tourist_spots.deleteOne(query);
        res.send(result);
      } catch (err) {
        return res.send({ error: true, massage: err.massage });
      }
    });

    // Get :: find multiple && all datas from countries collection in DB
    app.get("/countries", async (req, res) => {
      try {
        let query = {};
        if (req.query.country) {
          // console.log(capitalizeFirstLetter(req.query.country));
          query = { countryName: capitalizeFirstLetter(req.query.country) };
        }
        const result = await countriesCollection.find(query).toArray();
        res.send(result);
      } catch (err) {
        return res.send({ error: true, massage: err.massage });
      }
    });
    // Get :: find single data from countries collection in DB
    app.get("/countries/:country", async (req, res) => {
      try {
        const country = req.params.country;
        // console.log(country);
        const query = { countryName: capitalizeFirstLetter(country) };
        const result = await countriesCollection.findOne(query);
        res.send(result);
      } catch (err) {
        return res.send({ error: true, massage: err.massage });
      }
    });

    // Get :: find all datas from testimonial collection in DB
    app.get("/testimonial", async (req, res) => {
      try {
        const result = await testimonialCollection.find().toArray();
        res.send(result);
      } catch (err) {
        return res.send({ error: true, massage: err.massage });
      }
    });

    // Get :: find multiple data from tourist_spots collection with user email
    // app.get("/tourist_spots/", async (req, res) => {
    //   const email = req.query.email;
    //   console.log(email);
    //   const query = { userEmail: req.query.email };
    //   const result = await tourist_spots.find(query).toArray();
    //   res.send(result);
    // });

    // Get :: find multiple data from countries_tourist_spots collection
    // app.get("/all_spots", async (req, res) => {
    //   try {
    //     const result = await all_spots.find().toArray();
    //     res.send(result);
    //   } catch (err) {
    //     return res.send({ error: true, massage: err.massage });
    //   }
    // });

    // Get :: find single data from countries_tourist_spots collection
    // app.get("/all_spots/:id", async (req, res) => {
    //   try {
    //     const id = req.params.id;
    //     //   console.log(id);
    //     const query = { _id: new ObjectId(id) };
    //     const result = await all_spots.findOne(query);
    //     res.send(result);
    //   } catch (err) {
    //     console.log(err);
    //     return res.send({ error: true, massage: err.massage });
    //   }
    // });
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
