const delay_report = require('./delay_report')
const orders = require('./orders')

module.exports = {
    config: (app) => {
        app.use('/delay_report', delay_report);
        app.use('/orders', orders);
    }
}