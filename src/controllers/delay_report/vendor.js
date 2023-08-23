const vendor_model = require('../../models/delay_report/vendor')

async function get_by_id(req, res) {
    const vendor_id = req.params.id
    if (!vendor_id) return res.status(400).send({message: "vendor_id?"})
    try {
        await vendor_model.get_delay_reports(vendor_id).then(r => res.send(r.rows))
    } catch (e) {
        res.status(500).send({status: "ERROR", error: e})
    }
}

module.exports = {
    get_by_id: get_by_id
}