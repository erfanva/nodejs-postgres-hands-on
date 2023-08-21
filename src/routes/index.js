const delay_report = require('./delay_report')

module.exports = {
    config: (app) => {
        app.use('/', delay_report);
    }
}