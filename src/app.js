import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import Joi from "joi";
import dayjs from "dayjs";

const app = express();

// config
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
        res.status(422).send(error.details);
        return;
    }

    const thereIsName = await collectionUsers.findOne({ name: name }).then(() => {return true;}).catch(() => {return false;});

    console.log(thereIsName)
    console.log(name)

    if (thereIsName !== null) {
        res.status(409).send('Este usuário já existe');
        return;
    }

    try {
        await collectionUsers.insertOne({ name: name.name, lastStatus: Date.now() });
        await collectionChat.insertOne({from: name.name, to: 'Todos', text: 'entra na sala...', type: 'status', time: dayjs().format('HH:mm:ss')});
        res.status(201).send(`Cadastro concluido. Bem vind@ ${name.name}`);
    } catch (err) {
        res.status(500).send('Erro')
    }
});

app.get('/participants', async (req, res) => {
    try {
        const response = await collectionUsers.find().toArray()
        res.send(response);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/messages', async (req, res) => {
    const { to, text, type } = req.body;
    const { user } = req.headers;

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
                .valid('private_message')
    });

    const { error } = messSchema.validate({ to, text, type })

    if (error) {
        res.status(422).send(error.details);
        return;
    }

    const from = await collectionUsers.findOne({ name: user });
    console.log(from);

    try {
        await collectionChat.insertOne({ to, from, type, text, time: dayjs().format('HH:mm:ss') });
        res.status(201).send('Mensagem enviada com sucesso')
    } catch (err) {
        res.status(500).send('Erro');
    }
});

app.get('/messages', (req, res) => {

});

app.post('/status', (req, res) => {

});



app.listen(5000, () => {
    console.log('Server running');
});