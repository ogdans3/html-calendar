const moment = require("moment/min/moment-with-locales.js");

let weekdays = (date) => {
    let day = moment(date).day();
    return day === 1 || day === 2 || day === 3 || day === 4 || day === 5;
}

module.exports = weekdays;
