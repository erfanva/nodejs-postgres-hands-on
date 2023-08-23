const express = require('express')
const router = express.Router()

const vendor_controller = require('../../controllers/delay_report/vendor')

router.use((req, res, next) => {
  console.log('[router::delayReport::vendor]')
  next()
})

router.get('/:id', vendor_controller.get_by_id)

module.exports = router
