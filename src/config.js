require('dotenv').config()

module.exports = {
    app: {
        host: process.env.host || '0.0.0.0',
        port: process.env.port || 3000,
        is_developing: true,
    },
    apis: {
        eta: 'https://run.mocky.io/v3/122c2796-5df4-461c-ab75-87c1192b17f7',
    },
    db: {
        user: 'me',
        host: '127.0.0.1',
        database: 'api',
        password: 'password',
        port: 5432,
    }
}
