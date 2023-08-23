
async function get_delay_reports(vendor_id, limit = 50) {
    const select_query = `
    SELECT 
    MAX(delay)/(COUNT(*) OVER ()) AS average_delay, 
    MAX(delay_reports.created_at) AS created_at, 
    order_id FROM delay_reports
        LEFT JOIN orders ON delay_reports.order_id = orders.id
        WHERE 
            vendor_id = $2 AND
            delay_reports.created_at >= NOW() - interval '1 week'
        GROUP BY order_id 
        ORDER BY created_at DESC
        LIMIT $1;`
    const result = await db.query(select_query, [limit, vendor_id])

    return result
}

module.exports = {
    get_delay_reports: get_delay_reports,
}