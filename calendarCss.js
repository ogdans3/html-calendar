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
    days: (settings) => {
        let css = "";
        let identifier = getIdentifier(settings, "days");
        for(let key of Object.keys(settings.highlights)) {
            let obj = settings.highlights[key];
            css += `
                ${identifier} li span.${obj.className}{
                    color: ${obj.textColor};
                    background-color: ${obj.color};
                    ${obj.css}
                }
                ${identifier} li span.${obj.className} {
                    ${obj.css}
                }
            `;
        }
        css += settings.days.css;
        return css;
    },

    explanation: (settings) => {
        let css = "";
        let identifier = getIdentifier(settings, "explanation");

        for(let key of Object.keys(settings.highlights)) {
            let obj = settings.highlights[key];
            css += `
                ${identifier} li span.${obj.className}{
                    background-color: ${obj.color};
                    ${obj.css}
                }
                ${identifier} li.${obj.className} {
                    color: ${obj.explanationColor};
                }
            `;
        };
        css += settings.explanation.css;
        return css;
    }
};

module.exports = get;
