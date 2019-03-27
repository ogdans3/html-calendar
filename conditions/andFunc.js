let andFunc = function(func1, func2) {
    return function(date, day, dayString) {
        return func1.call(this, date, day, dayString) && func2.call(this, date, day, dayString)
    }
}

module.exports = andFunc;

