const fs = require("fs");
const contents = fs.readFileSync("./calendar.css", 'utf8');

let get = (settings) => {
    let css = "";
    for(let func of Object.keys(cssFuncs)) {
        css += cssFuncs[func](settings);
    }
    return css;
};

let cssFuncs = {
    body: (settings) => {
        let css = "";
        css += "ul {list-style-type: none;}";
        css += "body {font-family: Verdana, sans-serif;}";
        return css;
    },

    wrapper: (settings) => {
        let css = "";
        css += ".wrapper {\
            width: 300px;\
            height: 300px;\
        }";
        css += settings.wrapper.css;
        return css;
    },

    month: (settings) => {
        let css = "";
        css += "\
            .month {\
                padding: 10px 25px;\
                background-color: " + settings.month.color + ";\
                text-align: center;\
            }\
            .month ul {\
                margin: 0;\
                padding: 0;\
            }\
            .month ul li {\
                color: white;\
                font-size: 20px;\
                text-transform: uppercase;\
                letter-spacing: 3px;\
            }\
            .month ul li span {\
                font-size: 18px;\
            }";
        css += settings.month.css;
        return css;
    },

    navigation: (settings) => {
        let css = "";

        css += "\
            .month .prev {\
                float: left;\
                padding-top: 10px;\
            }\
            .month .next {\
                float: right;\
                padding-top: 10px;\
            }\
            .month .navButton{\
                background-color: " + settings.navigation.color + ";\
                border: none;\
                color: white;\
                text-align: center;\
                text-decoration: none;\
                display: inline-block;\
                font-size: 16px;\
            }";
        css += settings.navigation.css;
        return css;
    },

    weekdays: (settings) => {
        let css = "";
        css += "\
            .weekdays, .explanation {\
                margin: 0;\
                padding: 10px 0;\
                background-color:" + settings.weekdays.ulColor + ";\
            }\
            .weekdays li {\
                display: inline-block;\
                width: 13.6%;\
                color: #" + settings.weekdays.color +";\
                text-align: center;\
            }";
        css += settings.weekdays.css;
        return css;
    },

    days: (settings) => {
        let css = "";
        css += "\
            .days {\
                padding: 10px 0;\
                background: " + settings.days.color + ";\
                margin: 0;\
            }\
            .days li {\
                list-style-type: none;\
                display: inline-block;\
                width: 13.6%;\
                text-align: center;\
                margin-bottom: 10px;\
                font-size:12px;\
                color: #777;\
                font-weight: bold;\
            }\
            .days span.hidden, .explanation span.hidden {\
                visibility: hidden;\
            }";
        css += settings.days.css;
        return css;
    },

    explanation: (settings) => {
        let css = "";
        css += "\
            .explanation li {\
                list-style-type: none;\
                display: inline-block;\
                text-align: center;\
                font-size:10px;\
                font-weight: bold;\
                padding-left: 10px;\
            }\
            .explanation li span {\
                margin-right: 5px;\
                font-size: 8px;\
            }";
        css += "\
                .days li span.today, .explanation li span.today{\
                    border-radius: 100%;\
                    padding: 6px;\
                    background: " + settings.today.color + ";\
                    color: white !important\
                }\
                .days li span.blocked, .explanation li span.blocked {\
                    padding: 4px;\
                    background: " + settings.blocked.color + ";\
                    color: white !important\
                }";
        css += settings.explanation.css;
        return css;
    }
};

//module.exports = () => {return contents};
module.exports = get;