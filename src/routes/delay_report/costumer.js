const express = require('express')
const axios = require('axios')
const router = express.Router()

router.use((req, res, next) => {
  console.log('[router::delayReport::costumer]')
  next()
})

router.post('/order', async (req, res) => {
    try {
        const order_id = req.body.order_id; 
        const costumer_id = req.body.costumer_id;
        if (!order_id || !costumer_id) 
            return res.status(400).send({message: 'order_id? costumer_id?'})

        const order = await get_order(costumer_id, order_id)
        if (!order) {
            res.status(404).send({err: "Order not found!"})
            return;
        }
        const remaining_time = await calculate_remaining_time(order)
        if (remaining_time >= 0) {
            res.status(403).send({message: "This order is'nt delayed yet.", remaining_time})
            return;
        }
        const delay = -remaining_time;
        const trip_of_order = await get_trip_of_order(order_id)
        await save_delay_report(order_id, costumer_id, trip_of_order?.status, delay)

        if (!trip_of_order ||
            !['ASSIGNED', 'AT_VENDOR', 'PICKED'].includes(trip_of_order.status)) {
            
            if (await is_order_delay_report_assigned_and_not_resolved(order_id)) {
                res.status(400).send({message: "It was queued before"})
                return;
            }
            try {
                await enqueue_order_delay_report(order_id)
                res.send({message: "Your report queued"})
            } catch (e) {
                const UNIQUE_KEY_VIOLATION_ERR_CODE = 23505
                if (e.code == UNIQUE_KEY_VIOLATION_ERR_CODE) {
                    return res.status(400).send({message: "It was queued before"})
                }
                res.status(500).send({message: 'Error', result: e})
            }
        } else {
            const new_delivery_time_res = await axios.get(config.apis.eta)
            const new_delivery_time = new_delivery_time_res?.data?.data?.eta
            
            await update_delivery_time(order_id, new_delivery_time)
            res.send({message: "New delivery time", new_delivery_time})
            return;
        }
    } catch (e) {
        res.status(500).send({status: "ERROR", error: e})
        return;
    }
})

async function is_order_delay_report_assigned_and_not_resolved(order_id) {
    const select_query = `
    SELECT FROM delay_report_assignments
    WHERE order_id = $1 AND status IS DISTINCT from $2`
    const result = await db.query(select_query, [order_id, 'RESOLVED'])

    return result.rowCount > 0
}

async function enqueue_order_delay_report(order_id) {
    const query = `
    INSERT INTO delay_reports_queue (order_id)
        VALUES ($1)`
    // ON CONFLICT (order_id) DO NOTHING;`
    return db.query(query, [order_id]);
}

async function get_current_time() {
    return (await db.query(`SELECT NOW()`)).rows[0].now;
}

async function calculate_remaining_time(order) {
    const current_time = (await get_current_time()).getTime();
    const A_MINUTE_MILISECONDS = 60 * 1000;
    const delivery_time_in_millisec = order.delivery_time * A_MINUTE_MILISECONDS
    const expected_deliver_at = order.created_at.getTime() + delivery_time_in_millisec
    const remaining_time = expected_deliver_at - current_time;
    return remaining_time
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
async function save_delay_report(order_id, costumer_id, trip_status, delay) {
    const insert_query = `
    INSERT INTO delay_reports(order_id, costumer_id, trip_status, delay)
    VALUES ($1, $2, $3, $4);`
  
    return db.query(insert_query, [order_id, costumer_id, trip_status, delay])
}
async function update_delivery_time(order_id, new_delivery_time) {

}

module.exports = router