const fs = require("fs");
const contents = fs.readFileSync("./calendar.css", 'utf8');
module.exports = contents;