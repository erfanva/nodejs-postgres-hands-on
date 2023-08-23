
async function is_agent_assigned_and_not_resolved(agent_id) {
    const select_query = `
    SELECT id FROM delay_report_assignments
    WHERE agent_id = $1 AND status IS DISTINCT from $2`
    const result = await db.query(select_query, [agent_id, 'RESOLVED'])

    return result.rowCount > 0
}

async function save_agent_assignment(agent_id, order_id) {
    const insert_query = `
    INSERT INTO delay_report_assignments
        (agent_id, order_id)
    SELECT $1, $2
    WHERE
        NOT EXISTS (
            SELECT id FROM delay_report_assignments WHERE agent_id = $1 AND status IS DISTINCT from $3
        );`
    const result = await db.query(insert_query, [agent_id, order_id, 'RESOLVED'])

    return result.rowCount > 0
}

async function dequeue_delay_report() {
    const query = `
    DELETE
        FROM delay_reports_queue queue
        WHERE queue.id =
            (SELECT queue_inner.id
            FROM delay_reports_queue queue_inner
            ORDER BY queue_inner.queued_at ASC
                FOR UPDATE SKIP LOCKED
            LIMIT 1)
    RETURNING queue.id, queue.queued_at, queue.order_id;`
    const result = await db.query(query)
    
    return result.rowCount > 0 ? result.rows[0] : null 
}

module.exports = {
    is_agent_assigned_and_not_resolved: is_agent_assigned_and_not_resolved,
    save_agent_assignment: save_agent_assignment,
    dequeue_delay_report: dequeue_delay_report
}
