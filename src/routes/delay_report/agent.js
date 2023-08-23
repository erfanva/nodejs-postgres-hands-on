const express = require('express')
const router = express.Router()

const agent_controller = require('../../controllers/delay_report/agent')

router.use((req, res, next) => {
  console.log('[router::delayReport::agent]')
  next()
})

router.post('/assign', agent_controller.post_assign)

module.exports = router
