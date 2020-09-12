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

    readTextFile("/static/json/samarbetspartners.json", function(text) {
        var data = JSON.parse(text);
        for (i = 0; i < data.length; i++) {
            let row = document.createElement("div");
            row.classList.add("row");
            row.classList.add("samarbets-row");
            let col4 = document.createElement("div");
            col4.classList.add("col-md-4");
            let col8 = document.createElement("div");
            col8.classList.add("col-md-8");

            let header = document.createElement("h1");
            header.innerHTML = data[i].namn;
            let description = document.createElement("p");
            description.innerHTML = data[i].beskrivning;
            let link = document.createElement("a");
            link.href = data[i].länk;
            link.rel = "noreferrer";
            link.target = "_blank";
            link.innerHTML = data[i].länk;
            if (data[i].bild) {
                let img = document.createElement("img");
                img.src = data[i].bild;
                img.alt = data[i].alt;
                col4.appendChild(img);
            }
            col8.appendChild(header);
            col8.appendChild(link);
            col8.appendChild(description);
            row.appendChild(col4);
            row.appendChild(col8);
            document.getElementById("om-oss-container").appendChild(row);
        }
    });
});