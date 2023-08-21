const express = require('express')
const router = express.Router()

const agent = require('./agent')
const costumer = require('./costumer')
const vendor = require('./vendor')

router.use((req, res, next) => {
  console.log('[router::delayReport]')
  next()
})

// router.use('/agent', agent)
router.use('/costumer', costumer)
router.use('/vendor', vendor)

module.exports = router