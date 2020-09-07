# Jemma Stables Website
![Image of website header](https://i.ibb.co/0JKP2rn/Jemma-Stables.jpg)
> Website made for horse stables company

## Main features
> I've spent a lot of time working on SEO readability & automating tasks so the end user don't have to do much if they wish
> To take it upon themselves to update the website, I'm storing & loading some content using JSON & caching.

```javascript
// For example!
[{
    "name": "Horse",
    "year_of_birth": "0000",
    "sex": "male",
    "color": "brown",
    "src": "../static/img/horses/horse1.webp",
    "alt": "Picture of horse"
}]
// ^ This is how I would store information that I would pass on to
// the page where I display the information.

let horses = [];

readTextFile("../static/json/tävlingshästar.json", function(text) {
    // Then add the logic here to append the information to elements within the website
    // Alternatively, what I did is to store it in Cache to load on another page.
    horses.push(data[i].name);
    horses.forEach(function(horse) {
        horse.addEventListener("click", function() {
            localStorage.setItem("currentHorse", horses[horses.indexOf(horse)]);
        });
    });
});

// And then load it on the final page with a function like this
$(document).ready(function() {
    document.getElementById("horse").innerHTML = localStorage.getItem("currentHorse");

});
```

> I also added an API from [Instafeed](https://instafeedjs.com/) to dynamically load 
> the instagram feed from one of the owners.

> Aswell as using [Firebase](https://firebase.google.com/) to power the booking system on the website.
