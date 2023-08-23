const axios = require('axios')

const costumer_model = require('../../models/delay_report/costumer')

async function post_order(req, res) {
    const order_id = req.body.order_id; 
    const costumer_id = req.body.costumer_id;
    if (!order_id || !costumer_id) 
        return res.status(400).send({message: 'order_id? costumer_id?'})

    const order = await costumer_model.get_order(costumer_id, order_id)
    if (!order) {
        res.status(404).send({err: "Order not found!"})
        return;
    }
    const remaining_time = await costumer_model.calculate_remaining_time(order)
    if (remaining_time >= 0) {
        res.status(403).send({message: "This order is'nt delayed yet.", remaining_time})
        return;
    }
    const delay = -remaining_time;
    const trip_of_order = await costumer_model.get_trip_of_order(order_id)
    await costumer_model.save_delay_report(order_id, costumer_id, trip_of_order?.status, delay)

    if (!trip_of_order ||
        !['ASSIGNED', 'AT_VENDOR', 'PICKED'].includes(trip_of_order.status)) {
        
        if (await costumer_model.is_order_delay_report_assigned_and_not_resolved(order_id)) {
            res.status(400).send({message: "It was queued before"})
            return;
        }
        try {
            await costumer_model.enqueue_order_delay_report(order_id)
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
        
        await costumer_model.update_delivery_time(order_id, new_delivery_time)
        res.send({message: "New delivery time", new_delivery_time})
        return;
    }
}

module.exports = {
    post_order: post_order
}