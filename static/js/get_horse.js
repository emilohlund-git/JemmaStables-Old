$(document).ready(function() {
    document.getElementById("häst").innerHTML = localStorage.getItem("currentHäst");
    document.getElementById("bild").src = localStorage.getItem("currentHästBild");
    document.getElementById("född").innerHTML = "Födelseår: " + localStorage.getItem("currentHästFödd");
    document.getElementById("kön").innerHTML = "Kön: " + localStorage.getItem("currentHästKön");
    document.getElementById("färg").innerHTML = "Färg: " + localStorage.getItem("currentHästFärg");
    document.getElementById("bild").alt = localStorage.getItem("currentBeskrivning");
    //localStorage.removeItem("currentHäst");
    //localStorage.removeItem("currentHästBild")
});