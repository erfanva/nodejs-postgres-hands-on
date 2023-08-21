
const { Pool } = require('pg');

const migrations = require('./migrations/index')

const pool = new Pool({
  user: config.db.user,
  host: config.db.host,
  database: config.db.database,
  password: config.db.password,
  port: config.db.port,
})

pool.on('error', (err, client) => {
  console.error('[DB] Unexpected error on idle client', err)
  process.exit(1)
})

module.exports = { 
  drop_all: migrations.drop_all,
  migrate: async () => {
    console.log('[DB] migrating...')
    migrations.migrate_all()
  },
  query: async (text, params) => {
    const start = Date.now()
    let res, err;
    try {
      res = await pool.query(text, params)
    } catch (e) {
      console.error(e)
      err = e
    }
    const duration = Date.now() - start
    console.log('[DB] executed query', { text, params, duration})
    if (err) throw err
    return res
  }
}