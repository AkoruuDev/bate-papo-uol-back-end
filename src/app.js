import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();

// config
app.use(cors());
app.use(express.json());
const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

// connect
try {
    await mongoClient.connect();
    db = mongoClient.db('chatuol');
} catch (err) {
    console.log(err);
}

// routes
app.post('/participants', (req, res) => {

});

app.get('/participants', (req, res) => {

});

app.post('/messages', (req, res) => {

});

app.get('/messages', (req, res) => {

});

app.post('/status', (req, res) => {

});



app.listen(5000, () => {
    console.log('Server running');
});