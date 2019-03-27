let today = require("./today.js");
let weekdays = require("./weekdays.js");
let weekends = require("./weekends.js");
let selected = require("./selected.js");
let orFunc = require("./orFunc.js");
let andFunc = require("./andFunc.js");

let conditions = {
    TODAY: today,
    WEEKDAYS: weekdays,
    WEEKENDS: weekends,
    SELECTED: selected,
};

class Conditions {
    static fromString(str) {
        switch(str.trim().toLowerCase()) {
            case "today":
                return conditions.TODAY;
            case "weekends":
                return conditions.WEEKENDS;
            case "weekdays":
                return conditions.WEEKDAYS;
            case "selected":
                return conditions.SELECTED;
        }
        let commaSeperated = str.toLowerCase().split(",");
        if(commaSeperated[0] === "or") {
            return Conditions.handleBOOLEAN(str).func;
        }
        if(commaSeperated[0] === "and") {
            return Conditions.handleBOOLEAN(str).func;
        }
        return null;
    }

    static handleBOOLEAN(str) {
        let commaSeperated = str.toLowerCase().split(",");
        let first = commaSeperated[0].trim();
        if(first === "or" || first === "and") {
            let func1 = null;
            let func2 = null;
            let second = commaSeperated[1].trim();
            if(second === "or" || second === "and") {
                let obj = Conditions.handleBOOLEAN(commaSeperated.slice(1).join(","));
                func1 = obj.func;
                str = obj.remainingString;
                commaSeperated = str.split(",");
                func2 = Conditions.fromString(commaSeperated[0]);
                return {
                    func: first === "or" ? orFunc(func1, func2) : andFunc(func1, func2),
                    remainingString: commaSeperated.slice(1).join(","),
                };
            }else {
                func1 = Conditions.fromString(commaSeperated[1]);
                func2 = Conditions.fromString(commaSeperated[2]);
                return {
                    func: commaSeperated[0].trim() === "or" ? orFunc(func1, func2) : andFunc(func1, func2),
                    remainingString: commaSeperated.slice(3).join(","),
                };
            }
        }
    }
}

module.exports = Conditions;



