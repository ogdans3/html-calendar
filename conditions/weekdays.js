const moment = require("./../moment-with-locales.min.js");

let weekdays = (date) => {
    let day = moment(date).day();
    return day === 1 || day === 2 || day === 3 || day === 4 || day === 5;
}

module.exports = weekdays;
