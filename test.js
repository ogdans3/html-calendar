const express = require('express');

const app = express();
const port = 8000;

const Calendar = require("./calendar");

app.get("/", (req, res) => {
    let html = '<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
    let cal = test("2018", "03", "06");
    html += cal;
    html += "</body>";
    res.send(html);
});

function test(year, month, day) {
    let cal = new Calendar("" + year + month + day, {
        highlights: {
            blocked: {
                blockedDates: ["01", "02","03","05","10","20","21"],
            },
            holiday: {
                highlight: true,
                explanation: "Holiday",
                color: "#fff",
                textColor: "#000",
                className: "holiday",
                condition: function(date, day, dayString) {
                    for(let d of this.holidays) {
                        if(dayString === d)
                            return true;
                    }
                    return false;
                },
                holidays: ["29", "30"],
                sizeString: "00",
                css: ""
            }
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
