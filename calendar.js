const moment = require("moment");
const css = require("./calendarCss");

defaultSettings = {
    blockedDates: [],
    today: {
        highlight: true,
        explanation: "Today",
        color: "#1abc9c"
    },
    blocked: {
        highlight: true,
        explanation: "Booked",
        color: "#cc0000"
    },

    wrapper: {
        hide: false,
        css: ""
    },
    month: {
        hide: false,
        color: "#660099",
        css: ""
    },
    navigation: {
        hide: false,
        color: "#660099",
        css: ""
    },
    weekdays: {
        hide: false,
        color: "#666",
        ulColor: "#ddd",
        css: ""
    },
    days: {
        hide: false,
        color: "#eee",
        css: ""
    },
    explanation: {
        hide: false,
        color: "#666",
        css: ""
    },

    locale: "en",
    onPrev: function(event, wrapper) {console.error("Prev function not implemented")},
    onNext: function(event, wrapper) {console.error("Next function not implemented!")},
    util: {},
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
        function parseObject(settingsObj, newSettingsObj) {
            for(let key of Object.keys(settingsObj)) {
                if(typeof settings[key] === "object") {
                    settingsObj[key] = parseObject(settingsObj[key], newSettingsObj[key]);
                }else if(newSettingsObj[key] !== undefined) {
                    settingsObj[key] = newSettingsObj[key];
                }
            }
            return settingsObj
        }

        this.settings = defaultSettings;
        for(let key of Object.keys(defaultSettings)) {
            if(settings[key] !== undefined && settings[key] !== null) {
                if(settings[key].constructor === Array) {
                    this.settings[key] = settings[key];
                }else if(typeof settings[key] === "object") {
                    this.settings[key] = parseObject(this.settings[key], settings[key]);
                }else {
                    this.settings[key] = settings[key];
                }
            }
        }

        for(let key of Object.keys(settings["util"])) {
            this.settings["util"][key] = settings["util"][key];
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

    generateNavigationButtons() {
        if(this.settings.navigation.hide)
            return "";
        let html = "";
        html += "<li class = 'prev'><button id = 'prevNavButton' class = 'navButton' onclick = 'prevNavButton(event)' >" + "&#10094;" + "</button></li>";
        html += "<li class = 'next'><button id = 'nextNavButton' class = 'navButton' onclick = 'nextNavButton(event)'>" + "&#10095;" + "</button></li>";
        return html;
    }

    generateMonth() {
        if(this.settings.month.hide)
            return "";
        let html = "";
        html += "<div class = 'month'>";
        html += "<ul>";
        html += this.generateNavigationButtons();
        html += "<li>" + this.month + "</br>" + "<span>" + this.year + "</span>" + "</li>";
        html += "</ul>";
        html += "</div>";

        html += "<script>" +
            "function getWrapper(ele){return (" + this.settings.getWrapper + ")(ele)}" +
            "function prevNavButton(event){(" + this.settings.onPrev + ")(event, getWrapper(event.target))};" +
            "function nextNavButton(event){(" + this.settings.onNext + ")(event, getWrapper(event.target))};" +
            "util = {};";
        //Add all util functions to the util map
        for(let utilFuncName of Object.keys(this.settings.util)) {
            html += "util['" + utilFuncName + "'] = " + this.settings.util[utilFuncName] + ";";
        }
        html += "</script>";
        return html;
    }

    generateWeekdays() {
        if(this.settings.weekdays.hide)
            return "";
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
        if(this.settings.days.hide)
            return "";
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
        let html = "<style>" + css(this.settings) + "</style>";
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
        if(this.settings.explanation.hide)
            return "";
        let html = "";
        html += "<ul class = 'explanation'>";

        if(this.settings.today.highlight) {
            html += "<li>" + "<span class = 'today'>" + "<span class = 'hidden'>00</span>" + "</span>" + this.settings.today.explanation + "</li>";
        }
        if(this.settings.blocked.highlight) {
            html += "<li>" + "<span class = 'blocked'>" + "<span class = 'hidden'>00</span>" + "</span>" + this.settings.blocked.explanation + "</li>";
        }

        html += "</ul>";
        return html;
    }

    toHTML() {
        return this.generateWrapper()
    }
}

module.exports = Calendar;
