
(function(){
    var button = document.createElement("button");
    button.innerText = "Calendar";
    button.onclick = popup;

    var div = document.createElement('div');
    div.appendChild(button);
    document.body.appendChild(div);

    function popup() {
        var host = "localhost";
        var port = "8000";

        var win = null;
        if (navigator.appName == 'Microsoft Internet Explorer' ||  !!(navigator.userAgent.match(/Trident/))) {
            win = window.open("http://" + host + ":" + port + "/popup", "calendar", "toolbar=0,height=330,width=300");
        }else {
            win = window.open("", "calendar", "toolbar=0,height=330,width=300");
        }
        win.document.body.innerHTML = "";
        function getCal(callback) {
            var request = function(host, port, year, month, day, callback) {
                var makeHttpObject = function() {
                    try {return new XMLHttpRequest();}
                    catch (error) {}
                    try {return new ActiveXObject("Msxml2.XMLHTTP");}
                    catch (error) {}
                    try {return new ActiveXObject("Microsoft.XMLHTTP");}
                    catch (error) {}

                    throw new Error("Could not create HTTP request object.");
                };
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
                callback(html);
            });
        }

        getCal(function(html) {
            var scriptText = html.split(unescape("%3Cscript%3E"))[1].split(unescape("%3C/script%3E"))[0];
            var script =win.document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.innerText = scriptText;

            var div = win.document.createElement('div');
            div.innerHTML = html;
            div.appendChild(script);

            console.log("Div: ", div);

            //win.document.open();
            //win.document.write();
            //win.document.close();

            win.document.body.appendChild(div);
            win.document.body.style.margin = "0px";
            console.log(win.document.domain, document.domain);
            console.log(window.location.href, win.location.href);
            //win.document.domain = document.domain;
            //win.document.open();
            //win.document.write(getCal());
            //win.document.close();

            if (window.focus) {win.focus()}
        });
    }

})();


