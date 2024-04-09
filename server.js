const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

const password = encodeURIComponent("Ru4190416niwa#0");
const uri = `mongodb+srv://niwanthiedirisinghe95:${password}@cluster1.w8lef3h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;

// Define the schema
const catSchema = new mongoose.Schema({
    title: String,
    image: String,
    link: String,
    description: String,
});

// Create the Cat model
const Cat = mongoose.model("Cat", catSchema);

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}

connect();

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/cards", async (req, res) => {
  try {
    const cardList = await Cat.find();
    res.json({ statusCode: 200, data: cardList, message: "Success" });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
});

app.post("/api/cards", async (req, res) => {
  try {
    const { title, image, link, description } = req.body;
    
    const card = new Cat({ title, image, link, description });
    await card.save();

    res.status(201).json({ statusCode: 201, message: "New cat was added successfully!", data: card });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log("App listening to: " + port);
});
