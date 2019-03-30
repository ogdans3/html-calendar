const moment = require("moment/min/moment-with-locales.js");

let selected = function(date, day, dayString) {
    for(let d of this.selectedDates) {
        if(moment(d).isSame(date))
            return true;
    }
    return false;
}

module.exports = selected;
