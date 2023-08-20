'use strict';
const express = require('express');
const { Pool, Client } = require('pg');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  fetchNow().then(now => res.send(now));
});

const client = new Client({
  user: 'me',
  host: '127.0.0.1',
  database: 'api',
  password: 'password',
  port: 5432,
});

async function fetchNow() { 
  await client.connect()
  return await client.query('SELECT NOW()')
}

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);