import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();

// config
app.use(cors());
app.use(express.json());
const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

app.listen(4000, () => {
    console.log('Server running');
});