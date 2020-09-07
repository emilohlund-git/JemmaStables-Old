//Hästar
let hästar = []
let bilder = []
let födelseår = []
let kön = []
let färg = []
let beskrivning = []

readTextFile("../static/json/unghästar.json", function(text) {
    var data = JSON.parse(text);
    var horseContainer = document.getElementById("häst-container");
    let container = document.createElement("div");
    horseContainer.appendChild(container);
    container.classList.add("container");
    let row = document.createElement("div");
    row.classList.add("row");
    for (i = 0; i < data.length; i++) {
        let col = document.createElement("div");
        col.classList.add("col-md-4");
        let card = document.createElement("div");
        card.classList.add("card");
        let namn = document.createElement("a");
        namn.href = "../horse.html";
        namn.classList.add("card-title");
        namn.innerHTML = data[i].namn;
        let img = document.createElement("img");
        img.classList.add("card-img-top")
        img.src = data[i].bild;

        row.appendChild(col);
        col.appendChild(card);
        card.appendChild(img);
        card.appendChild(namn);

        beskrivning.push(data[i].beskrivning);
        hästar.push(namn);
        bilder.push(data[i].bild);
        födelseår.push(data[i].född);
        kön.push(data[i].kön);
        färg.push(data[i].färg);
    }

    hästar.forEach(function(häst) {
        häst.addEventListener("click", function() {
            localStorage.setItem("currentHäst", häst.innerHTML);
            localStorage.setItem("currentHästBild", bilder[hästar.indexOf(häst)]);
            localStorage.setItem("currentHästFödd", födelseår[hästar.indexOf(häst)]);
            localStorage.setItem("currentHästKön", kön[hästar.indexOf(häst)]);
            localStorage.setItem("currentHästFärg", färg[hästar.indexOf(häst)]);
            localStorage.setItem("currentBeskrivning", beskrivning[hästar.indexOf(häst)]);
        });
    });

    container.appendChild(row);
})