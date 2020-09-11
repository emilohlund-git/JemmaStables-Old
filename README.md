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
    var data = JSON.parse(text);
    // Then add the logic here to append the information to elements within the website
    // Alternatively, what I did is to store it in Cache to load on another page.
    for (i = 0; i < data.length; i++) {
        horses.push(data[i].name);
    }
    // There would be a redirection to the next page after the click, so I sent the data
    // Through localStorage to the next page.
    horses.forEach(function(horse) {
        horse.addEventListener("click", function() {
            localStorage.setItem("currentHorse", horses[horses.indexOf(horse)]);
        });
    });
});

// And then load it on the next page with a function like this
$(document).ready(function() {
    document.getElementById("horse").innerHTML = localStorage.getItem("currentHorse");
});
```

> I also added an API from [Instafeed](https://instafeedjs.com/) to dynamically load 
> the instagram feed from one of the owners. I will link to some good guides for this part. It was long.

1. Start here: [https://developers.facebook.com/docs/instagram-basic-display-api/getting-started]
2. Go to [https://developers.facebook.com/], log in and go to App Dashboard > Products > Instagram > Basic Display tab. To get yourself a starting access token.
3. Then head on over to [https://github.com/companionstudio/instagram-token-agent]. These tokens only last for about an hour and then it needs a refresh.
> So what you do is either develop an app which does this refreshing of tokens on a regular basis, or you use the one I've linked here and deploy it to heroku.
> It will do all the magic for you and you don't even have to scratch your head!
4. When this is done the fun part begins, you get to use the API, finally. Here is how you would initialize it with JavaScript:
```javascript
// First include the script tag that you recieve from your Heroku app in your header
<script src='https://yourherokuprojektname.herokuapp.com/token.js'></script>
// Like so. Then catch the token with a global variable.

// Then you can create a referense to the Instafeed class and give it whatever properties you wish!
// The documentation seemed kind of slim, but this is what I found that works well for me.
var feed = new Instafeed({
    // InstagramToken is a global variable which you can get via the script you put in your header.
    accessToken: InstagramToken,
    resolution: 'thumbnail',
    template: '<div class="col-lg-3 col-md-4 col-xs-6 thumb"><a rel="noreferrer" alt="description" href="{{link}}" target="_blank"><figure><img alt="description"class="img-fluid img-thumbnail" src="{{image}}"></a></figure></div>',
    sortBy: 'most-recent',
    limit: 8,
    // You can filter the images you wish to display with their #tags.
    // I'm using this feature a lot.
    filter: function(image) {
        let images = [];
        for (i = 0; i < image.tags.length; i++) {
            if (image.tags[i] == "JEMMAstables") {
                return image;
            }
        }
    }
});
// And finally you need to order your referenced Instafeed class to start working.
feed.run();
```

> ~~Aswell as using [Firebase](https://firebase.google.com/) to power the booking system on the website.~~
> Correction, I was using Firebase. But I didn't want to end up paying for additional writing / reading.
> So I swapped it for MariaDB which is included in my hosting domains payment plan.
> It was a pain since I've never really worked with MySQLi before, but it was well worth it in the end.

> I'm trying to get access to [Equipe](http://www.equipe.com/)'s API to fetch more information regarding the horses
> on the website, still no luck. (I need to get a hold of the developers to get a log-in, and to see if what I'm searching for is possible).

> The main feature of the website is the booking system, which I developed from scratch. I am using a calendar developed by [Mathias Picker](https://github.com/MathiasWP/CalendarPickerJS).
> It's extremely well written and easy to understand once you dive into the source code. Basically I'm using it to pick a date, and display a modal 
> which contains available, or none-available days for users of the website to book a time for riding. Like this:
![Example of calendar](https://i.ibb.co/TgjrSSS/displaycalendar.jpg)

> The selected day, month, name, email & time then gets sent to the database. Aswell as an e-mail to both the user and the company.
> Which I'm handling using [PHPMailer](https://github.com/PHPMailer/PHPMailer). Which is amazing.
> Just download the ZIP from Github, extract it to your projects folder and require it from your PHP file.

```php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;
// Import PHPMailer classes into the global namespace
// These must be at the top of your script, not inside a function
require("../PHPMailer-master/src/PHPMailer.php");
require("../PHPMailer-master/src/SMTP.php");
require("../PHPMailer-master/src/Exception.php");

$mail = new PHPMailer(true);
```

> Sending e-mails using PHPMailer is a breeze. For sure. And they have great documentation for it, aswell as a big userbase.

