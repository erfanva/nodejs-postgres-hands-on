const express = require('express')

config = require('./config.js')
db = require('./db/index.js')
const routes = require('./routes/index.js')

// App
const app = express();
routes.config(app);

app.listen(config.app.port, config.app.host);
console.log(`Running on http://${config.app.host}:${config.app.port}`)