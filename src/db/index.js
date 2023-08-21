
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
  migrate: async () => {
    console.log('[DB] migrating...')
    migrations.migrate_all()
  },
  query: async (text, params) => {
    const start = Date.now()
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('[DB] executed query', { text, duration, rows: res.rowCount })
    return res
  }
}