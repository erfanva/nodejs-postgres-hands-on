const express = require('express')
const router = express.Router()

router.use((req, res, next) => {
  console.log('[router::order]')
  next()
})

router.get('/', (req, res) => {
})

router.post('/new', (req, res) => {
    const vendor_id = parseInt(req.body.vendor_id); 
    const delivery_time = Math.round(Math.random() * 100);
    
    create_order(vendor_id, delivery_time)
    .then(r => res.send({vendor_id, delivery_time}))
    .catch(e => res.status(500).send(e))
})


async function create_order(vendor_id, delivery_time) { 
    const insert_query = `
    INSERT INTO orders (vendor_id, delivery_time)
    VALUES ($1, $2);`

    return await db.query(insert_query, [vendor_id, delivery_time])
}

module.exports = router