const express = require('express')
const axios = require('axios')
const router = express.Router()

const costumer_controller = require('../../controllers/delay_report/costumer')

router.use((req, res, next) => {
  console.log('[router::delayReport::costumer]')
  next()
})

router.post('/order', costumer_controller.post_order)

module.exports = router