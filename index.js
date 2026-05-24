// const dns = require("node:dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
dotenv.config();

const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;

const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("You're my mine");
});

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    // Module: 52.3
    const database = client.db("wanderlust");
    const destinationCollection = database.collection("destinations");
    // Module: 53.6
    const bookingCollection = database.collection("bookings");

    // Module: 52.3
    app.post("/destination", async (req, res) => {
      const destinationData = req.body;
      console.log(destinationData);
      const result = await destinationCollection.insertOne(destinationData);

      res.send(result);
    });

    // Module: 52.4
    app.get("/destination", async (req, res) => {
      const cursor = destinationCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Module: 52.4
    app.get("/destination/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await destinationCollection.findOne(query);
      res.send(result);
    });

    // Module: 52.6
    app.patch("/destination/:id", async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;

      const result = await destinationCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData },
      );
      res.send(result);
    });

    // Module: 52.7
    app.delete("/destination/:id", async (req, res) => {
      const id = req.params.id;

      const query = {
        _id: new ObjectId(id),
      };

      const result = await destinationCollection.deleteOne(query);
      res.send(result);
    });

    // Module: 53.6
    app.post("/booking", async (req, res) => {
      const bookingData = req.body;
      const result = await bookingCollection.insertOne(bookingData);
      res.send(result);
    });

    // Module: 53.7
    app.get("/booking/:userId", async (req, res) => {
      const { userId } = req.params;
      const result = await bookingCollection.find({ userID: userId }).toArray();
      res.send(result);
    });

    // Module: 53.8
    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;

      const query = {
        _id: new ObjectId(id),
      };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// const { id } = req.params;
// const result = await destinationCollection.findOne({
//   _id: new ObjectId(id)
// });
// res.send(result);

// const { id } = req.params;
// const result = await destinationCollection.findOne({
//   _id: new ObjectId(id),
// });
// res.send(result);
