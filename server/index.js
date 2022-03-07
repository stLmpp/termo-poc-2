require('dotenv').config();
const { join } = require('path');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const { getClientConnection } = require('./database');
const { lookup } = require('fast-geoip');
const cors = require('cors');
const { getClientIp } = require('request-ip');

const app = express()
  .use(helmet())
  .use(compression())
  .use(express.static(join(process.cwd(), 'public')));

function isProd() {
  return process.env.NODE_ENV !== 'development';
}

if (!isProd()) {
  app.use(cors());
}

app.post('/api/stats', async (req, res) => {
  const ip = getClientIp(req);
  if (!ip) {
    res.status(418).send({ error: `I'm a teapot`, message: 'Client ip not found' });
    return;
  }
  if (isProd() && ip === '127.0.0.1') {
    res.status(400).send({ error: 'Bad request', message: `${req.ip} is not a valid ip` });
    return;
  }
  const client = await getClientConnection();
  const collection = client.db('termo-predictions').collection('stats');
  const geoip = await lookup(ip);
  const document = {
    ip,
    userAgent: req.headers['user-agent'],
    language: req.headers['accept-language'],
    geo: geoip,
    creationDate: new Date(),
  };
  const result = await collection.insertOne(document);
  await client.close();
  res.status(201).send({ id: result.insertedId });
});

app.get('/api/health', (req, res) => {
  res.status(200).send('System online at ' + new Date().toUTCString());
});

app.listen(process.env.PORT ?? 3000, process.env.HOST ?? 'localhost');
