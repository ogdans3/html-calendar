const fs = require("fs");
const contents = fs.readFileSync("./calendar.css", 'utf8');

let getIdentifier = function(){return ""};
let getIdentifiers = function(){return ["", ""]}
let get = (settings, _getIdentifier, _getIdentifiers) => {
    let css = "";
    getIdentifier = _getIdentifier;
    getIdentifiers = _getIdentifiers;
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
        let identifier = getIdentifier(settings, "wrapper");
        css += "" + identifier + "{\
            width: 300px;\
            height: 300px;\
        }";
        css += settings.wrapper.css;
        return css;
    },

    month: (settings) => {
        let css = "";
        let identifier = getIdentifier(settings, "month");
        css += "\
            " + identifier + "{\
                padding: 10px 25px;\
                background-color: " + settings.month.color + ";\
                text-align: center;\
            }\
            " + identifier + " ul {\
                margin: 0;\
                padding: 0;\
            }\
            " + identifier + " ul li {\
                color: white;\
                font-size: 20px;\
                text-transform: uppercase;\
                letter-spacing: 3px;\
            }\
            " + identifier + " ul li span {\
                font-size: 18px;\
            }";
        css += settings.month.css;
        return css;
    },

    navigation: (settings) => {
        let css = "";

        let identifiers = getIdentifiers(settings, "navigation");
        let identifier = getIdentifier(settings, "navigation");
        let monthIdentifier = getIdentifier(settings, "month");
        css += "\
            " + monthIdentifier + " #" + identifiers[0] + "-" + settings.navigation.prevButtonName + "." + identifiers[0] + "-" + settings.navigation.prevButtonName + " {\
                float: left;\
                padding-top: 10px;\
            }\
            " + monthIdentifier + " #" + identifiers[0] + "-" + settings.navigation.nextButtonName + "." + identifiers[0] + "-" + settings.navigation.nextButtonName + " {\
                float: right;\
                padding-top: 10px;\
            }\
            " + monthIdentifier + " ." + identifiers[1] + "{\
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
        let identifier = getIdentifier(settings, "weekdays");
        css += "\
            " + identifier + "{\
                    margin: 0;\
                    padding: 10px 0;\
                    background-color:" + settings.weekdays.ulColor + ";\
            }\
            " + identifier + " li {\
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
        let identifier = getIdentifier(settings, "days");
        css += "\
            " + identifier + "{\
                padding: 10px 0;\
                background: " + settings.days.color + ";\
                margin: 0;\
            }\
            " + identifier + " li {\
                list-style-type: none;\
                display: inline-block;\
                width: 13.6%;\
                text-align: center;\
                margin-bottom: 10px;\
                font-size:12px;\
                color: #777;\
                font-weight: bold;\
            }";
        for(let key of Object.keys(settings.highlights)) {
            let obj = settings.highlights[key];
            css += "" + identifier + " li span." + obj.className + "{ \
                    padding: 4px; \
                    color:" + obj.textColor + "; \
                    background: " + obj.color + ";" +
                obj.css +
                "}";
        }
        //.days li span.today, .explanation li span.today{\
        //.days li span.blocked, .explanation li span.blocked {\
        css += settings.days.css;
        return css;
    },

    explanation: (settings) => {
        let css = "";
        let identifier = getIdentifier(settings, "explanation");
        css += "" + identifier + "{\
                    margin: 0;\
                    padding: 10px 0;\
                    background-color:" + settings.explanation.ulColor + ";\
                }";
        css += "\
            " + identifier + " li {\
                list-style-type: none;\
                display: inline-block;\
                text-align: center;\
                font-size:10px;\
                font-weight: bold;\
                padding-left: 10px;\
            }\
            " + identifier + " li span {\
                margin-right: 5px;\
                font-size: 8px;\
            }";

        for(let key of Object.keys(settings.highlights)) {
            let obj = settings.highlights[key];
            css += "" + identifier + " li span." + obj.className + "{ \
                    padding: 4px; \
                    background: " + obj.color + ";" +
                    obj.css +
                    "}";
            css += "" + identifier + " li." + obj.className + "{ \
                        color: " + obj.explanationColor + ";\
                    }";
        }
        css += settings.explanation.css;
        return css;
    }
};

//module.exports = () => {return contents};
module.exports = get;