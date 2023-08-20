
const { Pool } = require('pg');

const pool = new Pool({
  user: 'me',
  host: '127.0.0.1',
  database: 'api',
  password: 'password',
  port: 5432,
})

pool.on('error', (err, client) => {
  console.error('[DB] Unexpected error on idle client', err)
  process.exit(1)
})

module.exports = { 
  query: async (text, params) => {
    const start = Date.now()
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('[DB] executed query', { text, duration, rows: res.rowCount })
    return res
  }
}