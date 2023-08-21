const express = require('express')
const router = express.Router()

router.use((req, res, next) => {
  console.log('[Delay Report]')
  next()
})

router.get('/', (req, res) => {
    fetchFacts().then(r => res.send(r.rows))
})

async function fetchNow() { 
    return await db.query('SELECT NOW()')
}

async function fetchFacts() { 
    return await db.query('SELECT * FROM facts')
}

module.exports = router