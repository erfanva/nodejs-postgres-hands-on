const express = require('express')
const axios = require('axios')
const router = express.Router()

router.use((req, res, next) => {
  console.log('[router::delayReport::agent]')
  next()
})

router.post('/assign', async (req, res) => {
    const agent_id = req.body.agent_id; 
    if (!agent_id) return res.status(400).send({message: "agent_id?"})
    if (await is_agent_assigned_and_not_resolved(agent_id)) {
        res.status(406).send({message: "You have an assignment."})
        return;
    }
    const delay_report = await dequeue_delay_report()
    if (delay_report) {
        await save_agent_assignment(agent_id, delay_report.order_id)
        res.send({message: "assigned", delay_report})
        return
    }
    res.status(404).send({message: "There isnt any report."})
})

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

module.exports = router
