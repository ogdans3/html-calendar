const moment = require("moment/min/moment-with-locales.js");

let weekends = (date) => {
    let day = moment(date).day();
    return day === 6 || day === 0;
}

module.exports = weekends;
