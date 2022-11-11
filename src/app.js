import express from "express";
// import cors from "cors";  --- ininstall cors
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import Joi from "joi";
import dayjs from "dayjs";

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
const collectionUsers = db.collection('users');
const collectionChat = db.collection('chat');

// routes
app.post('/participants', async (req, res) => {
    const name = req.body;
    console.log(name)

    const userSchema = Joi.object({
        name: Joi
                .string()
                .min(1)
                .required()
    }).options({ abortEarly: false });
  
    const { error } = userSchema.validate(name);

    if (error) {
        res.sendStatus(422).send(error.details);
        return;
    }

    let thereIsName = collectionUsers.find(user => {
        if (user.name === userSchema.name) {
            return true;
        }
        return false;
    })

    if (thereIsName) {
        res.sendStatus(409).send('Este usuário já existe');
        return;
    }

    try {
        await collectionUsers.insertOne({ name: userSchema.name, lastStatus: Date.now() });
        await collectionChat.insertOne({from: userSchema.name, to: 'Todos', text: 'entra na sala...', type: 'status', time: dayjs().format('HH:mm:ss')});
        res.sendStatus(201).send(`Cadastro concluido. Bem vind@ ${userSchema.name}`);
    } catch (err) {
        res.sendStatus(500).send('Erro')
    }
});

app.get('/participants', async (req, res) => {
    try {
        const response = await collectionUsers.find().toArray()
        res.send(response);
    } catch (err) {
        res.sendStatus(500).send(err);
    }
});

app.post('/messages', async (req, res) => {
    const { to, text, type } = req.body;
    const { from } = req.header.User;

    const messSchema = Joi.object({
        to: Joi
                .string()
                .min(1),
        text: Joi
                .string()
                .min(1),
        type: Joi
                .string()
                .valid('message')
                .valid('private_message'),
        from: Joi.bool(true) // Learn how validate a true boolean value (Make that using MONGODB functions)
    });

    const { error } = messSchema.validate({ to, text, type })

    if (error) {
        res.sendStatus(422).send(error.details);
        return;
    }

    try {
        await collectionChat.insertOne({ to, from, type, text, time: dayjs().format('HH:mm:ss') });
        res.sendStatus(201).send('Mensagem enviada com sucesso')
    } catch (err) {
        res.sendStatus(500).send('Erro');
    }
});

app.get('/messages', (req, res) => {

});

app.post('/status', (req, res) => {

});



app.listen(5000, () => {
    console.log('Server running');
});