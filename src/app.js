import express from "express";
// import cors from "cors";  --- ininstall cors
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import Joi from "joi";

const app = express();

// config
// app.use(cors());
dotenv.config();
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

// collections
const collectionUsers = db.collection('users')

// routes
app.post('/participants', async (req, res) => {
    const name = req.body;
    console.log(name)

    const newUser = Joi.object({
        name: Joi
                .string()
                .min(1)
                .required()
    }).options({ abortEarly: false });
  
    const { error } = newUser.validate(name);

    if (error) {
        res.status(422).send(error.details);
        return;
    }

    thereIsName = collectionUsers.find(user => {
        if (user.name === newUser.name) {
            return true;
        }
        return false;
    })

    if (thereIsName) {
        res.status(409).send('Este usuário já existe');
        return;
    }

    try {
        await collectionUsers.insertOne(newUser);
        res.status(201).send(`Cadastro concluido. Bem vind@ ${newUser.name}`);
    } catch (err) {
        res.sendStatus(500).send('Erro')
    }
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