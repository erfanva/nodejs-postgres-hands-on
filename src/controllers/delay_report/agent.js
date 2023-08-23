const agent_model = require('../../models/delay_report/agent')

async function post_assign(req, res) {
    const agent_id = req.body.agent_id; 
    if (!agent_id) return res.status(400).send({message: "agent_id?"})
    if (await agent_model.is_agent_assigned_and_not_resolved(agent_id)) {
        res.status(406).send({message: "You have an assignment."})
        return;
    }
    const delay_report = await agent_model.dequeue_delay_report()
    if (delay_report) {
        await agent_model.save_agent_assignment(agent_id, delay_report.order_id)
        res.send({message: "assigned", delay_report})
        return
    }
    res.status(404).send({message: "There isnt any report."})
}

module.exports = {
    post_assign: post_assign
}
