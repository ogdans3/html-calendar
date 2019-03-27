const moment = require("./../moment-with-locales.min.js");

let weekends = (date) => {
    let day = moment(date).day();
    return day === 6 || day === 0;
}

module.exports = weekends;
