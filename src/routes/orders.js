const express = require('express')
const router = express.Router()

router.use((req, res, next) => {
  console.log('[router::order]')
  next()
})

router.get('/vendor/:id', (req, res) => {
  const vendor_id = req.params.id;
  get_orders(vendor_id).then(db_res => {
    res.send(db_res.rows)
  }).catch(e => res.status(500).send(e))
})

router.post('/new', (req, res) => {
    const vendor_id = parseInt(req.body.vendor_id); 
    const delivery_time = Math.round(Math.random() * 100);
    
    create_order(vendor_id, delivery_time)
    .then(r => res.send({vendor_id, delivery_time}))
    .catch(e => res.status(500).send(e))
})

async function get_orders(vendor_id, limit = 50) {
  const select_query = `
    SELECT id, delivery_time, created_at, vendor_id FROM orders
    WHERE id = $1 LIMIT $2;`

  return await db.query(select_query, [vendor_id, limit])
}

async function create_order(vendor_id, delivery_time) { 
  const insert_query = `
    INSERT INTO orders (vendor_id, delivery_time)
    VALUES ($1, $2);`

  return await db.query(insert_query, [vendor_id, delivery_time])
}

module.exports = router