const moment = require("./../moment-with-locales.min.js");

let today = (date, day, dayString) => {
    return moment().isSame(date, "day");
}

module.exports = today;
