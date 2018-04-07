const express = require('express');

const app = express();
const port = 8000;

const Calendar = require("../calendar");
const fs = require("fs");
const client = fs.readFileSync("./test/client.js", 'utf8');

app.get("/", (req, res) => {
    let html = '<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
    /*let cal = test("2018", "03", "06");
    html += cal;*/
    html += "<script>" + client + "</script>";
    html += "<script>" + client + "</script>";
    html += "</body>";
    res.send(html);
});

function test(year, month, day) {
    let cal = new Calendar("" + year + month + day, {
        highlights: {
            blocked: {
            },
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
