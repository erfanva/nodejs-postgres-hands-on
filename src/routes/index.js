const delay_report = require('./delay_report/index')
const orders = require('./orders')

module.exports = {
    config: (app) => {
        app.use('/delayReport', delay_report);
        app.use('/orders', orders);
    }
}