const express = require('express')

config = require('./config.js')
db = require('./db/index.js')
const routes = require('./routes/index.js')
async function start_db() {
    if (config.app.is_developing)
        await db.drop_all()
    await db.migrate()
}
start_db()

// App
const app = express();
app.use(express.json());
routes.config(app);

app.listen(config.app.port, config.app.host);
console.log(`Running on http://${config.app.host}:${config.app.port}`)