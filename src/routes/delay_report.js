const express = require('express')
const router = express.Router()

router.use((req, res, next) => {
  console.log('[router::delayReport]')
  next()
})

router.post('/costumer/order', async (req, res) => {
    const order_id = parseInt(req.body.order_id); 
    const costumer_id = 1;//parseInt(req.body.costumer_id);
    const order = await get_order(costumer_id, order_id)
    if (!order) {
        res.status(404).send({err: "Order not found!"})
        return;
    }
    const current_time = (await get_current_time()).getTime();
    const A_MINUTE_MILISECONDS = 60 * 1000;
    const delivery_time_in_millisec = order.delivery_time * A_MINUTE_MILISECONDS
    const expected_deliver_at = order.created_at.getTime() + delivery_time_in_millisec
    const remaining_time = expected_deliver_at - current_time;

    if (remaining_time >= 0) {
        res.status(403).send({message: "This order is'nt delayed yet.", remaining_time})
        return;
    }
    const trip_of_order = await get_trip_of_order(order_id)
    if (!trip_of_order ||
         !['ASSIGNED', 'AT_VENDOR', 'PICKED'].includes(trip_of_order.status)) {
        // save report + queue 
        res.send({message: "Queued", trip: trip_of_order})
        return;
    } else {
        // save report + update delivery time + respond new delivery time
        res.send({message: "New delivery time"})
        return;
    }
})

router.get('/costumer/:id', (req, res) => {
    const costumer_id = 1;//req.params.id
    get_costumer(costumer_id).then(r => res.send(r.rows))
})

async function get_current_time() {
    return (await db.query(`SELECT NOW()`)).rows[0].now;
}

async function get_order(costumer_id, order_id) {
    const select_query = `
    SELECT id, delivery_time, created_at FROM orders
    WHERE id = $1 AND costumer_id = $2;`
    const result = await db.query(select_query, [order_id, costumer_id])

    return result.rowCount > 0 ? result.rows[0] : null
}
async function get_trip_of_order(order_id) {
    const select_query = `
    SELECT id, status, created_at FROM trips
    WHERE order_id = $1;`
    const result = await db.query(select_query, [order_id])

    return result.rowCount > 0 ? result.rows[0] : null
}
async function get_costumer(costumer_id) {
    const select_query = `
    SELECT id, name, created_at FROM costumers
    WHERE id = $1;`
  
    return db.query(select_query, [costumer_id])
}

module.exports = router