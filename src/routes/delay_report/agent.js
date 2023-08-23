const express = require('express')
const router = express.Router()

const controller = require('../../controllers/delay_report/agent')

router.use((req, res, next) => {
  console.log('[router::delayReport::agent]')
  next()
})

router.post('/assign', controller.post_assign)

module.exports = router
