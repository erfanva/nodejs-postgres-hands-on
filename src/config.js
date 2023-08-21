require('dotenv').config()

module.exports = {
    app: {
        host: process.env.host || '0.0.0.0',
        port: process.env.port || 3000,
    },
    db: {
        user: 'me',
        host: '127.0.0.1',
        database: 'api',
        password: 'password',
        port: 5432,
    }
}
