const cors = require("cors");
const express = require('express');

const app = express();
const port = 8000;

const Calendar = require("./dist/main.js");
const fs = require("fs");
const client = fs.readFileSync("./client.js", 'utf8');
const popupClient = fs.readFileSync("./popupClient.js", 'utf8');

app.use(cors());

app.get("/test", (req, res) => {
    let html = '<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
    /*let cal = test("2018", "03", "06");
    html += cal;*/
    html += "<script>" + client + "</script>";
    html += "<script>" + client + "</script>";
    html += "</body>";
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.send(html);
});

app.get("/popup", (req, res) => {
    let html = '<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
    /*let cal = test("2018", "03", "06");
    html += cal;*/
    html += "<script>" + popupClient + "</script>";
    html += "</body>";
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.send(html);
});

function test(year, month, day) {
    let cal = new Calendar("" + year + "-" + month + "-" + day, {
        util: {
            headers: {
                "x-api-key": "api-key-test"
            }
        },
        highlights: {
            blocked: {
            },
        },
        wrapper: {
            attributes: {
                "equipment": "testing"
            }
        },
        clickable: true,
    }).toHTML();

    return cal;
};

app.get("/", (req, res) => {
    let year = req.query.year;
    let month = req.query.month;
    let day = req.query.day;

    let cal = test(year, month, day);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.send(cal);
});

app.get("/:year/:month/:day", (req, res) => {
    let year = req.params.year;
    let month = req.params.month;
    let day = req.params.day;

    let cal = test(year, month, day);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.send(cal);
});

app.listen(port, () => {
    console.log('We are live on ' + port);
});
