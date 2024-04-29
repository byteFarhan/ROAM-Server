const express = require("express");
const cors = require("cors");
const app = express();
const prot = process.env.PORT || 5000;

//Middle-Ware
app.use(cors());
app.use(express.json());

//get
app.get("/", (req, res) => {
  res.send("Roam Server is running...");
});

app.listen(prot, () => {
  console.log(`ROAM server is running on port ${prot}`);
});
