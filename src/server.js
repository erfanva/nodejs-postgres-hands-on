const express = require('express')

db = require('./db/index.js')
const routes = require('./routes/index.js')

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// App
const app = express();
app.use('/', routes.delay_report);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`)