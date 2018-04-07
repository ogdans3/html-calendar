const moment = require("moment");
const css = require("./calendarCss");
const defaultSettings = require("./defaultSettings.js");

let getIdentifier = (settings, name) => {
    let identifier = "";
    identifier += "#" + settings.namespace + settings[name].id;
    identifier += "." + settings.namespace + settings[name].className;
    return identifier;
};

let getIdentifiers = (settings, name) => {
    let identifiers = [];
    identifiers.push(settings.namespace + settings[name].id);
    identifiers.push(settings.namespace + settings[name].className);
    return identifiers;
};

class Calendar {
    constructor(date, settings) {
        this.parseSettings(settings);

        moment.locale(this.settings.locale);

        this.date = date;
        this._momentDate = moment(date);

        this.yearFormat = "YYYY";
        this.monthFormat = "MMMM";
        this.dayFormat = "d";
    }

    parseSettings(settings) {
        function parseObject(settingsObj, newSettingsObj) {
            if(settingsObj === null || settingsObj === undefined)
                return undefined;
            console.log(settingsObj, newSettingsObj);
            for(let key of Object.keys(settingsObj)) {
                if(settingsObj[key].constructor === Array) {
                    settingsObj[key] = newSettingsObj[key];
                }
                else if(typeof settingsObj[key] === "object" && newSettingsObj[key] !== undefined) {
                    settingsObj[key] = parseObject(settingsObj[key], newSettingsObj[key]);
                }else if(newSettingsObj[key] !== undefined) {
                    settingsObj[key] = newSettingsObj[key];
                }
            }
            for(let key of Object.keys(newSettingsObj)) {
                if(settingsObj[key])
                    continue;
                settingsObj[key] = newSettingsObj[key];
            }
            return settingsObj
        }

        this.settings = defaultSettings;
        this.parseHighlights(settings, parseObject);
        for(let key of Object.keys(defaultSettings)) {
            if(settings[key] !== undefined && settings[key] !== null) {
                if(settings[key].constructor === Array) {
                    this.settings[key] = settings[key];
                }else if(typeof settings[key] === "object") {
                    let tmp = parseObject(this.settings[key], settings[key]);
                    if(tmp !== undefined)
                        this.settings[key] = tmp;
                }else {
                    this.settings[key] = settings[key];
                }
            }
        }

        if(settings["util"] !== null && settings["util"] !== undefined) {
            for(let key of Object.keys(settings["util"])) {
                this.settings["util"][key] = settings["util"][key];
            }
        }
    }

    parseHighlights(settings, parseObject) {
        function fill(setting, def) {
            for(let key of Object.keys(def)) {
                if(setting[key] === undefined || setting[key] === null) {
                    //TODO: Handle deep objects
                    setting[key] = def[key];
                }
            }
            return setting;
        }
        for(let key of Object.keys(this.settings.highlights)) {
            this.settings.highlights[key] = fill(this.settings.highlights[key], this.settings.highlights._default);
        }
        if(settings.highlights !== null && settings.highlights !== undefined) {
            for(let key of Object.keys(settings.highlights)) {
                if(this.settings.highlights[key])
                    this.settings.highlights[key] = parseObject(this.settings.highlights[key], settings.highlights[key]);
                else
                    this.settings.highlights[key] = parseObject(this.settings.highlights._default, settings.highlights[key])
            }
        }
        delete this.settings.highlights._default;
    }

    get year() {
        return this._momentDate.format(this.yearFormat);
    }

    get monthNumber() {
        return this._momentDate.format("MM");
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
        let identifiers = getIdentifiers(this.settings, "navigation");
        let html = "";
        let functionMapName = this.settings.namespace + this.settings.functionsMapName;
        html += "<li id = '" + identifiers[0] + "-" + this.settings.navigation.prevButtonName + "' class = '" + identifiers[1] + "-" + this.settings.navigation.prevButtonName + "'><button class = '" + identifiers[1] + "' onclick = '" + functionMapName + "[\"prevNavButton\"](event)'>" + "&#10094;" + "</button></li>";
        html += "<li id = '" + identifiers[0] + "-" + this.settings.navigation.nextButtonName + "' class = '" + identifiers[1] + "-" + this.settings.navigation.nextButtonName + "'><button class = '" + identifiers[1] + "' onclick = '" + functionMapName + "[\"nextNavButton\"](event)'>" + "&#10095;" + "</button></li>";
        return html;
    }

    generateMonth() {
        if(this.settings.month.hide)
            return "";
        let identifiers = getIdentifiers(this.settings, "month");
        let html = "";
        html += "<div id = '" + identifiers[0] + "' class = '" + identifiers[1] + "'>";
        html += "<ul>";
        html += this.generateNavigationButtons();
        html += "<li>" + this.month + "</br>" + "<span>" + this.year + "</span>" + "</li>";
        html += "</ul>";
        html += "</div>";

        return html;
    }

    generateWeekdays() {
        if(this.settings.weekdays.hide)
            return "";
        let identifiers = getIdentifiers(this.settings, "weekdays");
        let html = "";
        html += "<ul id = '" + identifiers[0] + "' class = '" + identifiers[1] + "'>";

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
        let identifiers = getIdentifiers(this.settings, "days");
        let html = "";
        html += "<ul id = '" + identifiers[0] + "' class = '" + identifiers[1] + "'>";

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
            let m = moment(this.year + this.monthNumber + stringDay);
            for(let key of Object.keys(this.settings.highlights)) {
                let obj = this.settings.highlights[key];
                if(obj === null || obj === undefined || obj.highlight === false) {
                    continue;
                }
                if(obj.condition && obj.condition(m, day, stringDay)) {
                    classes.push(obj.className);
                }
            }
            html += "<li><span class = '" + classes.join(" ") + "'>" + stringDay + "</span></li>";
        }

        html += "</ul>";
        return html;
    }

    generateCSS() {
        let html = "<style>" + css(this.settings, getIdentifier, getIdentifiers) + "</style>";
        return html;
    }

    generateWrapper() {
        let identifiers = getIdentifiers(this.settings, "wrapper");
        let html = "<div id = '" + identifiers[0] + "' class = '" + identifiers[1] + "' data-year = '" + this.year + "' data-month = '" + this._momentDate.month() + "' data-day = '" + this.day + "'>";
        html += this.generateMonth();
        html += this.generateWeekdays();
        html += this.generateDays();
        html += this.generateCSS();
        html += this.generateColorExplanation();
        html += this.generateNamespaceScript();
        html += "</div>";
        return html;
    }

    generateNamespaceScript() {
        let html = "";
        let wrapperIdentifiers = getIdentifiers(this.settings, "wrapper");
        let functionMapName = this.settings.namespace + this.settings.functionsMapName;
        html += "<script>" +
            "" + functionMapName + " = {";
        html += "getWrapper: function(ele){return this.util.getWrapper(ele, '" + wrapperIdentifiers[1] + "')},";
        html += "onPrev: " + this.settings.onPrev + ",";
        html += "onNext: " + this.settings.onNext + ",";
        html += "prevNavButton: function(event){this.onPrev(event, this.getWrapper(event.target))},";
        html += "nextNavButton: function(event){this.onNext(event, this.getWrapper(event.target))},";
        html += "util: {}, ";
        html += "host: '" + this.settings.host + "',";
        html += "port: '" + this.settings.port + "',";
        html += "};";

        //Add all util functions to the util map
        for(let utilFuncName of Object.keys(this.settings.util)) {
            html += functionMapName + "['util']['" + utilFuncName + "'] = " + this.settings.util[utilFuncName] + ";";
        }
        html += "</script>";
        return html;
    }

    generateColorExplanation() {
        if(this.settings.explanation.hide)
            return "";
        let identifiers = getIdentifiers(this.settings, "explanation");
        let html = "";
        html += "<ul id = '" + identifiers[0] + "' class = '" + identifiers[1] + "'>";

        for(let key of Object.keys(this.settings.highlights)) {
            let obj = this.settings.highlights[key];

            if(obj.highlight) {
                html += "<li class = '" + obj.className + "'>" + "<span class = '" + obj.className + "'>" + "<span style = 'visibility: hidden'>" + (obj.sizeString || "00") + "</span>" + "</span>" + obj.explanation + "</li>";
            }
        }

        html += "</ul>";
        return html;
    }

    toHTML() {
        return this.generateWrapper()
    }
}

module.exports = Calendar;
