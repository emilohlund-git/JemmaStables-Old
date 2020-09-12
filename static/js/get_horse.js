$(document).ready(function() {
    document.getElementById("häst").innerHTML = localStorage.getItem("currentHäst");
    document.getElementById("bild").src = localStorage.getItem("currentHästBild");
    document.getElementById("född").innerHTML = "Födelseår: " + localStorage.getItem("currentHästFödd");
    document.getElementById("kön").innerHTML = "Kön: " + localStorage.getItem("currentHästKön");
    document.getElementById("färg").innerHTML = "Färg: " + localStorage.getItem("currentHästFärg");
    document.getElementById("bild").alt = localStorage.getItem("currentBeskrivning");
    //localStorage.removeItem("currentHäst");
    //localStorage.removeItem("currentHästBild")
    /*
    jQuery.ajax({
        url: '../php/equipe_api_get.php', // give complete url here'
        type: "GET",
        success: function(data) {
            console.log(data);
            var myArray = jQuery.parseJSON(data); // instead of JSON.parse(data)
            jQuery(myArray).each(function(index, element) {
                console.log(element);
            });
        },
        error: function(err) {
            console.log(err);
        }
    });
    */
});