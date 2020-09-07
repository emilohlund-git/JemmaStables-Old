$(document).ready(function() {
    let bilder = document.getElementsByClassName("w-100");
    for (i = 0; i < bilder.length; i++) {
        bilder[i].addEventListener("click", function() {
            $("#imagemodal").modal("show");
            document.getElementById("imagepreview").src = this.src;
        })
    }
});