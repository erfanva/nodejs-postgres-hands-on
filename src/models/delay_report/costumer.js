
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

module.exports = {
    is_order_delay_report_assigned_and_not_resolved: is_order_delay_report_assigned_and_not_resolved,
    enqueue_order_delay_report: enqueue_order_delay_report,
    calculate_remaining_time: calculate_remaining_time,
    get_order: get_order,
    get_trip_of_order: get_trip_of_order,
    save_delay_report: save_delay_report,
    update_delivery_time: update_delivery_time,
}