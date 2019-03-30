const moment = require("moment/min/moment-with-locales.js");

let today = (date, day, dayString) => {
    return moment().isSame(date, "day");
}

module.exports = today;
