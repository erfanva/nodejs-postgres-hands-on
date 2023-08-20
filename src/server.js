const express = require('express');
// const { Pool, Client } = require('pg');
const db = require('./db/index.js')

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  fetchNow().then(now => res.send(now));
});

async function fetchNow() { 
  return await db.query('SELECT NOW()')
}

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);