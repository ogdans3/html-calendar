const moment = require("moment");

defaultSettings = {
    locale: "en",
    namespace: "calendar_ogdans3_",
    functionsMapName: "functions",
    host: "localhost",
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
            css: ""
        },
        today: {
            highlight: true,
            explanation: "Today",
            color: "#1abc9c",
            className: "today",
            condition: function(date, day, dayString) {
                return moment().isSame(date, "day");
            },
            css: "border-radius: 100%; padding:6px;"
        },
        blocked: {
            highlight: true,
            explanation: "Booked",
            color: "#cc0000",
            className: "blocked",
            condition: function(date, day, dayString) {
                for(let d of this.blockedDates) {
                    if(dayString === d)
                        return true;
                }
                return false;
            },
            blockedDates: [],
        }
    },

    wrapper: {
        hide: false,
        css: "",
        className: "wrapper",
        id: "wrapper"
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

        request: function(host, port, year, month, day, callback) {
            var self = this;
            var request = self.makeHttpObject();
            request.open("GET", "http://" + host + ":" + port + "/" + year + "/" + month + "/" + day, true);
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

        self.util.request(this.host, this.port, year, month, "01", function(html) {
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

        self.util.request(this.host, this.port, year, month, "01", function(html) {
            var newWrapper = self.util.createElementFromHTML(html);
            wrapper.parentElement.replaceChild(newWrapper, wrapper);
        });
    },
};

module.exports = defaultSettings;