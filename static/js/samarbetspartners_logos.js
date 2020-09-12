$(document).ready(function() {
    // READ JSON FILE AND GET CONTENTS
    function readTextFile(file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        };
        rawFile.send(null);
    }

    readTextFile("../static/json/samarbetspartners.json", function(text) {
        if (document.getElementById("partners")) {
            var data = JSON.parse(text);
            let row = document.createElement("div");
            row.classList.add("row");
            document.getElementById("partners").appendChild(row);
            for (i = 0; i < data.length; i++) {
                if (data[i].bild != "") {
                    let logo = document.createElement("img");
                    logo.src = data[i].bild;
                    logo.alt = data[i].alt;
                    let col = document.createElement("div");
                    col.classList.add("col-md-3");
                    col.classList.add("partner-icon");
                    let link = document.createElement("a");
                    link.href = data[i].länk;
                    link.rel = "noreferrer";
                    link.target = "_blank";
                    link.appendChild(logo);
                    col.appendChild(link);
                    row.appendChild(col);
                }
            }
        }
    });
});