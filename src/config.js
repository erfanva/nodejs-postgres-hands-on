require('dotenv').config()

console.log(process.env.db_pass)

module.exports = {
    app: {
        host: process.env.app_host || '0.0.0.0',
        port: process.env.app_port || 3000,
        is_developing: true,
    },
    apis: {
        eta: 'https://run.mocky.io/v3/122c2796-5df4-461c-ab75-87c1192b17f7',
    },
    db: {
        user: process.env.db_user,
        host: process.env.db_host,
        database: process.env.db_name,
        password: process.env.db_pass,
        port: process.env.db_port,
    }
}
