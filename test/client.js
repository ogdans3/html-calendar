(function(){
    var makeHttpObject = function() {
        try {return new XMLHttpRequest();}
        catch (error) {}
        try {return new ActiveXObject("Msxml2.XMLHTTP");}
        catch (error) {}
        try {return new ActiveXObject("Microsoft.XMLHTTP");}
        catch (error) {}

        throw new Error("Could not create HTTP request object.");
    };

    var request = function(host, port, year, month, day, callback) {
        var request = makeHttpObject();
        request.open("GET", "http://" + host + ":" + port + "/" + year + "/" + month + "/" + day, true);
        request.send(null);
        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                var html = request.responseText;
                callback(html);
            }
        };
    };

    var today = new Date();
    var year = "" + today.getFullYear();
    var month = "" + (today.getMonth() + 1);
    var day = "" + today.getDate();
    if(month < 10) {
        month = "0" + month;
    }
    if(day < 10) {
        day = "0" + day;
    }
    request("localhost", "8000", year, month, day, function(html) {
        var scriptText = html.split(unescape("%3Cscript%3E"))[1].split(unescape("%3C/script%3E"))[0];
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.innerText = scriptText;

        var div = document.createElement('div');
        div.innerHTML = html;
        document.body.appendChild(div);
        div.appendChild(script);
    });
})();

