$(document).ready(function() {
    document.getElementById("subject").value = "Tidsbokning";

    // Get the firebase database into a variable for simplicity
    var now = new Date();
    // Initialize the calender
    const myCalender = new CalendarPicker('#myCalendarWrapper', {
        min: new Date(),
        max: new Date(now.getFullYear(), now.getMonth() + 2, 1)
    });

    // Add an array of all the months in the year in Swedish
    let times = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"]
    var months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];
    let currentDay;
    let days = document.querySelectorAll("time");

    const createTimes = () => {
        for (j = 0; j < times.length - 1; j++) {
            let option = document.createElement("a");
            option.classList.add("option-item");
            option.classList.add("list-group-item");
            option.classList.add("list-group-item-action");
            option.classList.add("list-group-item-light");
            option.innerHTML = times[j];
            option.innerHTML += "-" + times[j + 1];
            $("#sel1").append(option);
        }
        addClickToOptions();
    }

    function addClickToOptions() {
        let options = document.querySelectorAll(".option-item");
        options.forEach(option => {
            option.addEventListener("click", function() {
                unToggleAll(options);
                if (!this.classList.contains("disabled")) {
                    this.classList.toggle("selected");
                }
            })
        });
    }

    const unToggleAll = (elements) => {
        elements.forEach(el => {
            el.classList.remove("selected");
        })
    }

    let hinderPåRidbananFärg = "rgb(219 175 96 / 25%)";
    let ridlektionerFärg = "rgb(219 96 96 / 35%)";
    let öppenRidningFärg = "rgb(15 255 36 / 15%)";


    /*-----------------------------------*/

    /* Remove the options of the select element on closing so it doesn't fill up */
    $('#myModal').on('hidden.bs.modal', function() {
        $("#sel1").empty();
    })

    /* Adding an array for the current times of the day, so I can keep easier track on available times for each day
    to know exactly when to disable a certain day after a time has been booked */
    let currentTimes = [];

    /* Given a month and a day it will look through firebase to find if there are any available times that day and return
    them in the form of options for the select element, so that you can choose which time you want to book */


    /* Loops through each day of the month and adds a click event to each day, so if you press the day
    and its not disabled, it will give you the modal which shows you which available times exists for the chosen day */
    days.forEach(function(day) {
        day.addEventListener("click", function() {
            if (!day.classList.contains("disabled")) {
                $('#myModal').modal('show');
                $('#modal-title').text(myCalender.value.toDateString());
                let day = myCalender.value.toString().split(" ")[2].replace(/^0+/, '');
                currentDay = day;
                $.when(createTimes($('#sel1'))).done(function() {
                    hämtaTider();
                });
                $.when(hämtaBokadeTider(currentDay)).done(function() {
                    changeTimes(currentDay);
                });
            }
        });
    });

    function matchStartTimes(time1, time2) {
        return time1.split("-")[0] == time2.split("-")[0];
    }

    function matchEndTimes(time1, time2) {
        if (time1.split("-").length > 2) {
            return time1.split(" ")[0].split("-")[1] == time2.split("-")[1];
        }
        return time1.split("-")[1] == time2.split("-")[1];
    }

    let bookedTime;

    /* Adding an eventlistener for the booking button, hiding the first modal and showing the final one 
    and sets variables for the booked time and which time to remove from the select index of options */
    document.getElementById("boka-knapp").addEventListener("click", function() {
        let selected = false;
        let selectedOption;
        let options = document.querySelectorAll(".option-item");
        options.forEach(option => {
            if (option.classList.contains("selected")) {
                selectedOption = option;
                selected = true;
            }
        })
        if (selected) {
            bookedTime = selectedOption.innerHTML;
            $("#myModal").modal("hide");
            $("#myModal2").modal("show");
            document.getElementById("tid").value = bookedTime;
        } else {}
    })

    /* Function to send an email and validating the information from the form,
    also removes the selected record from the database upon success */
    $("#booking-form").submit(function(event) {
        let användarnamn = $("#förnamn").val() + " " + $("#efternamn").val();
        document.getElementById("dag").value = months[myCalender.month] + " " + currentDay;
        var valid;
        valid = validateContact();
        if (valid) {
            jQuery.ajax({
                url: "../php/add_to_booking.php",
                data: 'userName=' + användarnamn + '&userEmail=' +
                    $("#email").val() + '&subject=' +
                    $("#subject").val() + '&content=' +
                    $("#tid").val() + '&day=' + $("#dag").val(),
                type: "POST",
                success: function(data) {
                    sendMail();
                },
                error: function() {}
            });
        }
        event.preventDefault();
    });

    function sendMail() {
        let användarnamn = $("#förnamn").val() + " " + $("#efternamn").val();
        jQuery.ajax({
            url: "../php/booking-mail.php",
            data: 'userName=' + användarnamn + '&userEmail=' +
                $("#email").val() + '&subject=' +
                $("#subject").val() + '&content=' +
                $("#tid").val() + '&day=' + $("#dag").val(),
            type: "POST",
            success: function(data) {
                $("#mail-status").html(data);
                $("#förnamn").val("");
                $("#efternamn").val("");
                $("#subject").val("");
                $("#email").val("");
                $("#dag").val("");
                $("#tid").val("");
                $(this).delay(3000).queue(function() {
                    $("#mail-status").fadeOut().empty();
                    location.reload();
                    $(this).dequeue();
                });
            },
            error: function() {}
        });
    }

    $('#myModal2').on('hide', function() {
        $("#mail-status").html('');
    })

    /* Validation function for the form */
    function validateContact() {
        var valid = true;
        $(".info").html('');
        if (!$("#förnamn").val()) {
            $("#förnamn-label").addClass("varnings-text");
            $("#förnamn-label").text("Du måste fylla i ett namn i fältet.");
            valid = false;
            setTimeout(
                function() {
                    $("#förnamn-label").removeClass("varnings-text");
                    $("#förnamn-label").text("förnamn");
                }, 2000);
        }
        if ($("#förnamn").val().length > 15) {
            $("#förnamn-label").addClass("varnings-text");
            $("#förnamn-label").text("Ogiltigt namn.");
            valid = false;
            setTimeout(
                function() {
                    $("#förnamn-label").removeClass("varnings-text");
                    $("#förnamn-label").text("förnamn");
                }, 2000);
        }
        if (!$("#efternamn").val()) {
            $("#efternamn-label").addClass("varnings-text");
            $("#efternamn-label").text("Du måste fylla i ett namn i fältet.");
            valid = false;
            setTimeout(
                function() {
                    $("#efternamn-label").removeClass("varnings-text");
                    $("#efternamn-label").text("efternamn");
                }, 2000);
        }
        if ($("#efternamn").val().length > 20) {
            $("#efternamn-label").addClass("varnings-text");
            $("#efternamn-label").text("Ogiltigt namn.");
            valid = false;
            setTimeout(
                function() {
                    $("#efternamn-label").removeClass("varnings-text");
                    $("#efternamn-label").text("efternamn");
                }, 2000);
        }
        if (!$("#email").val()) {
            $("#email-label").addClass("varnings-text");
            $("#email-label").text("Du måste ange en epost address.");
            valid = false;
            setTimeout(
                function() {
                    $("#email-label").removeClass("varnings-text");
                    $("#email-label").text("email");
                }, 2000);
        }
        if (!$("#email").val().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)) {
            $("#email-label").addClass("varnings-text");
            $("#email-label").text("Ogiltig epost address.");
            valid = false;
            setTimeout(
                function() {
                    $("#email-label").removeClass("varnings-text");
                    $("#email-label").text("email");
                }, 2000);
        }
        if (!$("#subject").val()) {
            $("#subject-info").html("(required)");
            $("#subject").css('background-color', '#FFFFDF');
            valid = false;
        }
        if (!$("#tid").val()) {
            $("#tid").css('background-color', '#FFFFDF');
            valid = false;
        }
        return valid;
    }

    let bokadeTider = [];

    laddaBokadeTiderStart();

    function laddaBokadeTiderStart() {
        let red = 208;
        let green = 151;
        let blue = 151;
        jQuery.ajax({
            url: '../php/get_bokade_tider.php', // give complete url here'
            type: "GET",
            success: function(data) {
                var myArray = jQuery.parseJSON(data); // instead of JSON.parse(data)
                jQuery(myArray).each(function(index, element) {
                    for (i = 0; i < days.length; i++) {
                        if (days[i].innerHTML.replace(/^0+/, '') == element.dag.split(" ")[1]) {
                            bokadeTider.push(element.tid + "," + element.dag);
                            if (!days[i].classList.contains("öppenRidbana") && !days[i].classList.contains("ridlektion")) {
                                days[i].style.background = "rgb(" + red + " " + green + " " + blue + ")";
                                red++;
                                green++;
                                blue++;
                            }
                        }
                    }
                });
            },
            error: function(err) {
                console.log(err);
            }
        }).done(function() {
            hämtaTider()
        });
    }

    function hämtaTider() {
        jQuery.ajax({
            url: '../php/get_tid.php', // give complete url here'
            type: "GET",
            success: function(data) {
                var myArray = jQuery.parseJSON(data); // instead of JSON.parse(data)
                jQuery(myArray).each(function(index, element) {
                    for (i = 0; i < days.length; i++) {
                        if (days[i].innerHTML == element.dag.split("-")[2]) {
                            if (element.kategori == "Öppen ridning") {
                                /*
                                I want to check if all the times this day is booked, in that case I do not want to display
                                this category on this day.

                                So first I need to fetch all the booked times and match them by this day.

                                Lets say I got all the times in bokadeTider..
                                then I iterate through them and match them with the times given by 
                                element.tid, which would be 10:00-14:00, and if 10-11-12-13 is booked
                                I do not want to add the class 'öppenRidbana'

                                Or I can split element.tid on -, which would give me 10:00, 14:00 in array
                                Then I split : to get 10 & 14.
                                Then I count the steps from 10 to 14, which is four.

                                Then I iterate through bokadeTider to see if bokadeTider.split(":")[0]
                                matches all four times. Bingo!
                                */
                                let start = element.tid.split("-")[0].split(":")[0];
                                let end = element.tid.split("-")[1].split(":")[0];
                                let matchCount = 0;
                                let amtOfMatches = 0;
                                for (z = start; z < end; z++) {
                                    matchCount++;
                                }

                                for (j = 0; j < bokadeTider.length; j++) {
                                    bokadDag = bokadeTider[j].split(",")[1].split(" ")[1];
                                    if (bokadDag == days[i].innerHTML) {
                                        for (m = start; m < end; m++) {
                                            if (bokadeTider[j].split(",")[0].split("-")[0].split(":")[0] == m) {
                                                amtOfMatches++;
                                            }
                                        }
                                    }
                                }

                                if (amtOfMatches < matchCount) {
                                    days[i].classList.add("öppenRidbana");
                                    days[i].style.color = "white";
                                }
                            } else if (element.kategori == "Ridlektioner") {
                                days[i].classList.add("ridlektion");
                                days[i].style.color = "white";
                            }
                        }
                    }
                });
            },
            error: function(err) {
                console.log(err);
            }
        });
    }

    function hämtaBokadeTider(day) {
        let options = document.querySelectorAll(".option-item");
        jQuery.ajax({
            url: '../php/get_bokade_tider.php', // give complete url here'
            type: "GET",
            success: function(data) {
                var myArray = jQuery.parseJSON(data); // instead of JSON.parse(data)
                jQuery(myArray).each(function(index, element) {
                    if (day == element.dag.split(" ")[1]) {
                        for (i = 0; i < options.length; i++) {
                            if (options[i].innerHTML == element.tid) {
                                if (options[i].classList.contains("selected")) {
                                    options[i].classList.toggle("selected");
                                }
                                options[i].classList.add("bokad");
                                options[i].classList.add("disabled");
                                options[i].innerHTML += " - Bokad av " + element.namn;
                            }
                        }
                    }
                });
            },
            error: function(err) {
                console.log(err);
            }
        });
    }

    const changeTimes = (day) => {
        if (document.querySelectorAll(".option-item").length > 0) {
            let start;
            let end;
            let options = document.querySelectorAll(".option-item");
            jQuery.ajax({
                url: '../php/get_tid.php', // give complete url here'
                type: "GET",
                success: function(data) {
                    var myArray = jQuery.parseJSON(data); // instead of JSON.parse(data)
                    jQuery(myArray).each(function(index, element) {
                        if (element.dag.split("-")[2] == day) {
                            switch (element.kategori) {
                                case "Öppen ridning":
                                    for (i = 0; i < options.length; i++) {
                                        if (matchStartTimes(options[i].innerHTML, element.tid)) {
                                            start = i;
                                        }
                                        if (matchEndTimes(options[i].innerHTML, element.tid)) {
                                            end = i;
                                        }
                                    }
                                    for (i = start; i < end + 1; i++) {
                                        options[i].classList.add("öppenRidbana");
                                    }
                                    break;
                                case "Ridlektioner":
                                    for (i = 0; i < options.length; i++) {
                                        if (matchStartTimes(options[i].innerHTML, element.tid)) {
                                            start = i;
                                        }
                                        if (matchEndTimes(options[i].innerHTML, element.tid)) {
                                            end = i;
                                        }
                                    }
                                    for (i = start; i < end + 1; i++) {
                                        options[i].classList.add("ridlektion");
                                        options[i].classList.add("disabled");
                                    }
                                    break;
                            }
                        }
                    });
                },
                error: function(err) {
                    console.log(err);
                }
            });
        }
    }
});