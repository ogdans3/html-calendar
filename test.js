const express = require('express');

const app = express();
const port = 8000;

const Calendar = require("./calendar");

app.get("/", (req, res) => {
    let html = '<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
    let cal = test("2018", "03", "06");
    html += cal;
    console.log(cal);
    html += "</body>";
    res.send(html);
});

function test(year, month, day) {
    let util = {
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
        }
    };

    let onNext = function(event, wrapper) {
        var year = parseInt(wrapper.getAttribute("data-year"));
        var month = parseInt(wrapper.getAttribute("data-month"));
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

        util.request("localhost", "8000", year, month, "01", function(html) {
            var newWrapper = util.createElementFromHTML(html);
            wrapper.parentElement.replaceChild(newWrapper, wrapper);
        });
    };
    let onPrev = function(event, wrapper) {
        var year = parseInt(wrapper.getAttribute("data-year"));
        var month = parseInt(wrapper.getAttribute("data-month"));
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

        util.request("localhost", "8000", year, month, "01", function(html) {
            var newWrapper = util.createElementFromHTML(html);
            wrapper.parentElement.replaceChild(newWrapper, wrapper);
        });
    };

    let cal = new Calendar("" + year + month + day, {
        blockedDates: ["01", "02","03","05","10","20","21"],
        onNext: onNext,
        onPrev: onPrev,
        locale: "nb",
        util: util,
        blocked: {
            explanation: "Bukket"
        },
        today: {
            highlight: false
        }
    }).toHTML();

    return cal;
}

app.get("/:year/:month/:day", (req, res) => {
    let year = req.params.year;
    let month = req.params.month;
    let day = req.params.day;

    let cal = test(year, month, day);
    res.send(cal);
});

app.listen(port, () => {
    console.log('We are live on ' + port);
});
