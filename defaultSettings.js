const moment = require("./moment-with-locales.min.js");
const Conditions = require("./conditions/index.js");

defaultSettings = {
    locale: "en",
    namespace: "calendar_ogdans3_",
    functionsMapName: "functions",
    host: "http://localhost",
    port: "8000",

    highlights: {
        _default: {
            highlight: true,
            explanation: "Default",
            color: "inherit",
            textColor: "#fff",
            explanationColor: "#000",
            className: "",
            condition: function(date, day, dayString) {},
            sizeString: "00",
            css: "",
            selectedDates: ["2019-03-13"],
        },
        today: {
            highlight: true,
            explanation: "Today",
            color: "#1abc9c",
            className: "today",
            condition: "TODAY",
            css: "border-radius: 100%; padding:6px;"
        },
        day: {
            highlight: false,
            explanation: "day",
            color: "#1ab000",
            className: "day",
            condition: "AND, TODAY,WEEKDAYS",
            css: "border-radius: 100%; padding:6px;"
        },
        blocked: {
            highlight: true,
            explanation: "Booked",
            color: "#cc0000",
            className: "blocked",
            condition: "SELECTED",
        }
    },

    wrapper: {
        fontSize: "1em",
        lineHeight: "1em",
        fontFamily: "Verdana, sans-serif",
        hide: false,
        css: "",
        className: "wrapper",
        id: "wrapper",
        attributes: {}
    },
    month: {
        hide: false,
        color: "#660099",
        css: "",
        className: "month",
        id: "month"
    },
    navigation: {
        hide: false,
        color: "#660099",
        css: "",
        className: "navigation",
        id: "navigation",
        prevButtonName: "previousButton",
        nextButtonName: "nextButton"
    },
    weekdays: {
        hide: false,
        color: "#666",
        ulColor: "#ddd",
        css: "",
        className: "weekdays",
        id: "weekdays"
    },
    days: {
        hide: false,
        color: "#eee",
        css: "",
        className: "days",
        id: "days"
    },
    explanation: {
        hide: false,
        color: "#666",
        ulColor: "#ddd",
        css: "",
        className: "explanation",
        id: "explanation"
    },
    util: {
        headers: {},
        createElementFromHTML: function(htmlString) {
            var div = document.createElement('div');
            div.innerHTML = htmlString;
            return div.firstChild;
        },

        makeHttpObject: function() {
            try {return new XMLHttpRequest();}
            catch (error) {}
            try {return new ActiveXObject("Msxml2.XMLHTTP");}
            catch (error) {}
            try {return new ActiveXObject("Microsoft.XMLHTTP");}
            catch (error) {}

            throw new Error("Could not create HTTP request object.");
        },

        request: function(host, port, headers, year, month, day, attributes, callback) {
            var self = this;
            var request = self.makeHttpObject();
            var url = host;
            if(port || port === 0) {
                url += ":" + port;
            }
            url += "?";
            url += "year=" + year + "&month=" + month + "&day=" + day;
            for(var i = 0; i < attributes.length; i++) {
                var name = attributes[i].name;
                if(name === "year" || name === "month" || name === "day")
                    continue;
                var value = attributes[i].value;
                url += "&" + name + "=" + value;
            }

            request.open("GET", url, true);
            for(var i = 0; i < Object.keys(headers).length; i++) {
                request.setRequestHeader(Object.keys(headers)[i], headers[Object.keys(headers)[i]])
            }
            request.send(null);
            request.onreadystatechange = function() {
                if (request.readyState === 4) {
                    var html = request.responseText;
                    callback(html);
                }
            };
        },

        getWrapper: function(element, wrapperClass) {
            var classes = element.getAttribute("class");
            while(classes === null || (classes !== null && classes.split(" ").indexOf(wrapperClass) === -1)) {
                element = element.parentElement;
                if(element === null)
                    return null;
                classes = element.getAttribute("class");
            }
            return element;
        }
    },

    onNext: function(event, wrapper) {
        var year = parseInt(wrapper.getAttribute("data-year"));
        var month = parseInt(wrapper.getAttribute("data-month"));
        var self = this;
        if(month === 11) {
            year = year + 1;
            month = 1;
        }else {
            month = month + 2;
        }
        year = "" + year;
        if(month < 10) {
            month = "0" + month;
        }else {
            month = "" + month;
        }

        var attributes = [].filter.call(wrapper.attributes, function(at) { return /^data-/.test(at.name); });
        for(var i = 0; i < attributes.length; i++) {
            var name = attributes[i].name.replace("data-", "");
            var value = attributes[i].value;
            attributes[i] = {name: name, value: value};
        }

        self.util.request(this.host, this.port, self.util.headers, year, month, "01", attributes, function(html) {
            var newWrapper = self.util.createElementFromHTML(html);
            wrapper.parentElement.replaceChild(newWrapper, wrapper);
        });
    },
    onPrev: function(event, wrapper) {
        var year = parseInt(wrapper.getAttribute("data-year"));
        var month = parseInt(wrapper.getAttribute("data-month"));
        var self = this;
        if(month === 0) {
            year = year - 1;
            month = 12;
        }else {
            month = month;
        }
        year = "" + year;
        if(month < 10) {
            month = "0" + month;
        }else {
            month = "" + month;
        }

        var attributes = [].filter.call(wrapper.attributes, function(at) { return /^data-/.test(at.name); });
        for(var i = 0; i < attributes.length; i++) {
            attributes[i].name = attributes[i].name.replace("data-", "");
        }

        self.util.request(this.host, this.port, self.util.headers, year, month, "01", attributes, function(html) {
            var newWrapper = self.util.createElementFromHTML(html);
            wrapper.parentElement.replaceChild(newWrapper, wrapper);
        });
    },
};

module.exports = defaultSettings;
