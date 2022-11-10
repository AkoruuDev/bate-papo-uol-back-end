import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import Joi from "joi";

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
    const name = req.body;

    const newUser = Joi.object({
        name: Joi
                .string()
                .min(1)
                .required()
    }).options({ abortEarly: false });
  
    const response = newUser.validate(name);

    if (response.error) {
        res.status(422).send(response.error.details);
        return;
    }

    thereIsName = db.collection('users').find(user => {
        if (user.name === newUser.name) {
            return true;
        }
        return false;
    })

    if (thereIsName) {
        res.status(409).send('Este usuário já existe');
        return;
    }

    db.collection('users').insert(newUser);
    res.status(201).send(`Cadastro concluido. Bem vind@ ${newUser.name}`);
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