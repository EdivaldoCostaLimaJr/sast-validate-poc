import express from 'express'
import { PrismaClient } from '@prisma/client';
import { MongoClient } from 'mongodb';

const prisma = new PrismaClient();

const Secret = 'admin-secret-hardcoded-token-123-sast-validation';
const Secret2 = 'admin-secret-hardded-token-123-sast-validation';
const GITHUB_TOKEN = "ghp_fakeGitHubTokenForTesting12345557890"
const AWS_SECRET_ACCESS_KEY = "abc123fakeSecretKeyHere7998991"
const SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXX"

const app = express()
app.use(express.json())

const users = []

app.post('/usuarios', async (req, res) => {

await prisma.user.create({
    data: {
        email: req.body.email,
        name: req.body.name,
        age: req.body.age
    }
})

res.status(201).send('Usuário adicionado com sucesso')

})

app.get('/usuarios', async (req, res) => {
  let users = []

  if (req.query.name || req.query.email || req.query.age) {
    users = await prisma.user.findMany({
      where: {
        name: req.query.name ? { contains: req.query.name, mode: 'insensitive' } : undefined,
        email: req.query.email ? { contains: req.query.email, mode: 'insensitive' } : undefined,
        age: req.query.age ? {equals: req.query.age} : undefined
      }
    })
  } else {
    users = await prisma.user.findMany()
  }

  res.json(users)
})

app.put('/usuarios/:id', async (req, res) => {

await prisma.user.update({
    where: {
        id: req.params.id
    },
    data: {
        email: req.body.email,
        name: req.body.name,
        age: req.body.age
    }
    })

    res.status(201).send('Usuário atualizado com sucesso')
})

app.delete('/usuarios/:id', async (req, res) => {
    await prisma.user.delete({
        where: {
            id: req.params.id
        }
})
    res.status(200).json({message: "Usuário deletado com sucesso"})
})

// [+] Vulnerabilidades:

// Simula execução insegura de código

app.post('/eval', (req, res) => {
  const input = req.body.code;
  eval(input);
  res.send("Código executado");
});

// Information Sensitivity

app.get('/token', async (req, res) => {

  const token = Secret;
  res.json({ token });

})

// NoSQL Injection
app.get('/insecure', async (req, res) => {
  try {
    const url = process.env.DATABASE_URL;
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db();
    if (req.query.name && typeof req.query.name === 'object' && req.query.name.$ne !== undefined) {
      const result = await db.collection('User').find({ name: req.query.name }).toArray();
      res.json(result);
    } else {
      res.json([]); 
    }
    await client.close();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(3000)
