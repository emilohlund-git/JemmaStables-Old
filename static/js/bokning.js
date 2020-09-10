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
                createTimes();
                hämtaTider($("#sel1"));
                changeTimes(currentDay);
                hämtaBokadeTider(currentDay);
            }
        });
    });

    function matchStartTimes(time1, time2) {
        return time1.split("-")[0] == time2.split("-")[0];
    }

    function matchEndTimes(time1, time2) {
        return time1.replace(/[^0-9.\-\:]/g, "").split("-")[1] == time2.replace(/[^0-9.\-\:]/g, "").split("-")[1];
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
            document.getElementById("content").value = bookedTime;
        } else {}
    })

    /* Function to send an email and validating the information from the form,
    also removes the selected record from the database upon success */
    $("#booking-form").submit(function(event) {
        document.getElementById("day").value = months[myCalender.month] + " " + currentDay;
        var valid;
        valid = validateContact();
        if (valid) {
            jQuery.ajax({
                url: "../php/add_to_booking.php",
                data: 'userName=' + $("#userName").val() + '&userEmail=' +
                    $("#userEmail").val() + '&subject=' +
                    $("#subject").val() + '&content=' +
                    $(content).val() + '&day=' + $("#day").val(),
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
        jQuery.ajax({
            url: "../php/booking-mail.php",
            data: 'userName=' + $("#userName").val() + '&userEmail=' +
                $("#userEmail").val() + '&subject=' +
                $("#subject").val() + '&content=' +
                $(content).val() + '&day=' + $("#day").val(),
            type: "POST",
            success: function(data) {
                $("#mail-status").html(data);
                $("#userName").val("");
                $("#subject").val("");
                $("#userEmail").val("");
                $("#day").val("");
                $("#content").val("");
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
        $(".demoInputBox").css('background-color', '');
        $(".info").html('');
        if (!$("#userName").val()) {
            $("#userName-info").html("(required)");
            $("#userName").css('background-color', '#FFFFDF');
            valid = false;
        }
        if (!$("#userEmail").val()) {
            $("#userEmail-info").html("(required)");
            $("#userEmail").css('background-color', '#FFFFDF');
            valid = false;
        }
        if (!$("#userEmail").val().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)) {
            $("#userEmail-info").html("(invalid)");
            $("#userEmail").css('background-color', '#FFFFDF');
            valid = false;
        }
        if (!$("#subject").val()) {
            $("#subject-info").html("(required)");
            $("#subject").css('background-color', '#FFFFDF');
            valid = false;
        }
        if (!$("#content").val()) {
            $("#content-info").html("(required)");
            $("#content").css('background-color', '#FFFFDF');
            valid = false;
        }
        return valid;
    }

    hämtaTider();

    function hämtaTider(select) {
        jQuery.ajax({
            url: '../php/get_tid.php', // give complete url here'
            type: "GET",
            success: function(data) {
                var myArray = jQuery.parseJSON(data); // instead of JSON.parse(data)
                jQuery(myArray).each(function(index, element) {
                    for (i = 0; i < days.length; i++) {
                        if (days[i].innerHTML == element.dag.split("-")[2]) {
                            if (element.kategori == "Öppen ridning") {
                                days[i].classList.add("öppenRidbana");
                                days[i].style.color = "white";
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


    jQuery.ajax({
        url: '../php/get_bokade_tider.php', // give complete url here'
        type: "GET",
        success: function(data) {
            var myArray = jQuery.parseJSON(data); // instead of JSON.parse(data)
            jQuery(myArray).each(function(index, element) {
                for (i = 0; i < days.length; i++) {
                    if (days[i].innerHTML.replace(/^0+/, '') == element.dag.split(" ")[1]) {
                        if (!days[i].classList.contains("öppenRidbana") && !days[i].classList.contains("ridlektion")) {
                            days[i].style.background = "rgb(208 151 151)";
                        }
                    }
                }
            });
        },
        error: function(err) {
            console.log(err);
        }
    });

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
                                options[i].classList.add("ridlektion");
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
                                    /*
                                    
                                    Funktionen kollar efter start och slut tid, är sluttiden uppbokad så
                                    fungerar inte funktionen, då options[i].innerHTML blir "- Bokad av blabla"

                                    */
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