const express = require('express')
const router = express.Router()

router.use((req, res, next) => {
  console.log('[router::delay_report]')
  next()
})

router.get('/', (req, res) => {
    fetch_facts().then(r => res.send(r.rows))
})

async function fetch_now() { 
    return await db.query('SELECT NOW()')
}

async function fetch_facts() { 
    return await db.query('SELECT * FROM facts')
}

module.exports = router