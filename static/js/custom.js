// When the user scrolls down 80px from the top of the document, change the navbars background to transparent
$(function() {
    $(document).scroll(function() {
        var windowsize = $(window).width();
        if (windowsize > 1300) {
            $("nav").toggleClass(
                "bg-dark",
                $(this).scrollTop() > $("nav").height()
            );
            $(".nav-link").toggleClass(
                "text-white",
                $(this).scrollTop() > $("nav").height()
            );
            $(".navbar-brand").toggleClass(
                "logo-filter",
                $(this).scrollTop() > $("nav").height()
            );
        }
    });
});

$(document).ready(function() {
    $(".dmenu").hover(
        function() {
            $(this).find(".sm-menu").first().stop(true, true).slideDown(150);
        },
        function() {
            $(this).find(".sm-menu").first().stop(true, true).slideUp(105);
        }
    );
});

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
                logo.alt = data[i].beskrivning;
                let col = document.createElement("div");
                col.classList.add("col-md-3");
                col.classList.add("partner-icon");
                let link = document.createElement("a");
                link.href = data[i].länk;
                link.target = "_blank";
                link.appendChild(logo);
                col.appendChild(link);
                row.appendChild(col);
            }
        }
    }
});

$(document).ready(function() {
    document.getElementById("copyright").innerHTML = "@ " + new Date().getFullYear() + " Copyright: Jemmastables.com | Design av Emil Öhlund"
});