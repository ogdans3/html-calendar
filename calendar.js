const moment = require("moment");
const css = require("./calendarCss");

defaultSettings = {
    blockedDates: [],
    today: {
        highlight: true,
        explanation: "Today"
    },
    blocked: {
        highlight: true,
        explanation: "Booked"
    },
    locale: "en",
    onPrev: function(event, wrapper) {console.error("Prev function not implemented")},
    onNext: function(event, wrapper) {console.error("Next function not implemented!")},
    getWrapper: function(element) {
        var classes = element.getAttribute("class");
        while(classes === null || (classes !== null && classes.split(" ").indexOf("wrapper") === -1)) {
            element = element.parentElement;
            if(element === null)
                return null;
            classes = element.getAttribute("class");
        }
        return element;
    },
};

class Calendar {
    constructor(date, settings) {
        this.parseSettings(settings);
        this.parseBlockedDates(this.settings.blockedDates);

        moment.locale(this.settings.locale);

        this.date = date;
        this._momentDate = moment(date);

        this.yearFormat = "YYYY";
        this.monthFormat = "MMMM";
        this.dayFormat = "d";
    }

    parseSettings(settings) {
        this.settings = defaultSettings;
        for(let key of Object.keys(defaultSettings)) {
            if(settings[key] !== undefined && settings[key] !== null) {
                this.settings[key] = settings[key];
            }
        }
    }

    parseBlockedDates(dates) {
        this._blockedDates = {};
        for(let day of dates) {
            this._blockedDates[day] = true;
        }
    }

    get year() {
        return this._momentDate.format(this.yearFormat);
    }

    get month() {
        return this._momentDate.format(this.monthFormat);
    }

    get day() {
        return this._momentDate.format(this.dayFormat);
    }

    generateMonth() {
        let html = "";
        html += "<div class = 'month'>";
        html += "<ul>";
        html += "<li class = 'prev'><button id = 'prevNavButton' class = 'navButton' onclick = 'prevNavButton(event)' >" + "&#10094;" + "</button></li>";
        html += "<li class = 'next'><button id = 'nextNavButton' class = 'navButton' onclick = 'nextNavButton(event)'>" + "&#10095;" + "</button></li>";
        html += "<li>" + this.month + "</br>" + "<span>" + this.year + "</span>" + "</li>";
        html += "</ul>";
        html += "</div>";

        html += "<script>" +
            "function getWrapper(ele){return (" + this.settings.getWrapper + ")(ele)}" +
            "function prevNavButton(event){(" + this.settings.onPrev + ")(event, getWrapper(event.target))};" +
            //"function prevNavButton(event){};" +
            "function nextNavButton(event){(" + this.settings.onNext + ")(event, getWrapper(event.target))};" +
            //"function nextNavButton(event){};" +
            "</script>";

        /*html += "<script>" +
            "document.getElementById('nextNavButton').addEventListener('click'," + this.settings.onNext + ");" +
            "document.getElementById('prevNavButton').addEventListener('click'," + this.settings.onPrev + ");" +
            "</script>";*/
        return html;
    }

    generateWeekdays() {
        let html = "";
        html += "<ul class = 'weekdays'>";

        let weekdays = moment.weekdaysShort();
        for(let day of weekdays) {
            html += "<li>" + day + "</li>";
        }
        html += "</ul>";
        return html;
    }

    generateDays() {
        let html = "";
        html += "<ul class = 'days'>";

        let days = this._momentDate.daysInMonth();
        let firstDay = this._momentDate.clone().startOf("month");
        //Skip the first x days, the first day of the month is usually not on monday
        for(let i = 0; i < firstDay.day(); i++) {
            html += "<li></li>";
        }
        for(let day = 1; day <= days; day++) {
            let classes = [];
            let stringDay = "" + day;
            if(day < 10) {
                stringDay = "0" + stringDay;
            }
            if(this.settings.blocked.highlight && (this._blockedDates[stringDay] || this._blockedDates[stringDay])) {
                classes.push("blocked");
            }
            if(this.settings.today.highlight && this._momentDate.date() === day) {
                classes.push("active");
            }
            html += "<li><span class = '" + classes.join(" ") + "'>" + stringDay + "</span></li>";
        }

        html += "</ul>";
        return html;
    }

    generateCSS() {
        let html = "<style>" + css + "</style>";
        return html;
    }

    generateWrapper() {
        let html = "<div class = 'wrapper' data-year = '" + this.year + "' data-month = '" + this._momentDate.month() + "' data-day = '" + this.day + "'>";
        html += this.generateMonth();
        html += this.generateWeekdays();
        html += this.generateDays();
        html += this.generateCSS();
        html += this.generateColorExplanation();
        html += "</div>";
        return html;
    }

    generateColorExplanation() {
        let html = "";
        html += "<ul class = 'explanation'>";

        html += "<li>" + "<span class = 'active'>" + "<span class = 'hidden'>00</span>" + "</span>" + this.settings.today.explanation + "</li>";
        html += "<li>" + "<span class = 'blocked'>" + "<span class = 'hidden'>00</span>" + "</span>" + this.settings.blocked.explanation + "</li>";

        html += "</ul>";
        return html;
    }

    toHTML() {
        return this.generateWrapper()
    }
}

module.exports = Calendar;
