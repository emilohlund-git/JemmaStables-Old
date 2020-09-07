$(document).ready(function() {
    document.getElementById("subject").value = "Tidsbokning";

    // Get the firebase database into a variable for simplicity
    var db = firebase.firestore();

    // Initialize the calender
    const myCalender = new CalendarPicker('#myCalendarWrapper', {
        min: new Date()
    });

    // Add an array of all the months in the year in Swedish
    var months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"]
    let dateToDisable = myCalender.value.getDay();
    let currentDay;
    let days = document.querySelectorAll("time");

    /* NOT USING THESE BUTTONS AS OF NOW */
    /* I need to get them to run some code */
    /* Everytime I press them */
    let up = document.getElementById("previous-month");
    let down = document.getElementById("next-month");
    up.classList.add("d-none");
    down.classList.add("d-none");
    /*-----------------------------------*/

    /* Remove the options of the select element on closing so it doesn't fill up */
    $('#myModal').on('hidden.bs.modal', function() {
        $("#sel1").empty();
    })

    // Disable all days, check if days are available later and remove the disabled class.
    for (i = 0; i < days.length; i++) {
        days[i].classList.add("disabled");
    }

    /* Adding an array for the current times of the day, so I can keep easier track on available times for each day
    to know exactly when to disable a certain day after a time has been booked */
    let currentTimes = [];

    /* Given a month and a day it will look through firebase to find if there are any available times that day and return
    them in the form of options for the select element, so that you can choose which time you want to book */
    const getTimesSelectedMonth = (month, day) => {
        currentTimes = [];
        db.collection(month).doc(day).collection("Tider")
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    let option = document.createElement("option");
                    option.text = doc.data().Tid;
                    $('#sel1').append(option);
                    currentTimes.push(option.text);
                });
            })
            .catch(function(error) {
                return error;
            });
    }

    // If the day is available remove the disabled class
    const checkIfDateIsAvailable = (month, day) => {
        db.collection(month).doc(day).collection("Tider")
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    if (!querySnapshot.empty) {
                        days[day - 1].classList.remove("disabled");
                    }
                });
            })
            .catch(function(error) {
                return error;
            });
    }

    /* Loops through each day of the month and adds a click event to each day, so if you press the day
    and its not disabled, it will give you the modal which shows you which available times exists for the chosen day */
    days.forEach(function(day) {
        day.addEventListener("click", function() {
            if (!day.classList.contains("disabled")) {
                $('#myModal').modal('show');
                $('#modal-title').text(myCalender.value.toDateString());
                let day = myCalender.value.toString().split(" ")[2].replace(/^0+/, '');
                currentDay = day;
                getTimesSelectedMonth(months[myCalender.month], day)
            }
        });
    });

    /* Runs on document load, checking which days have available times */
    days.forEach(function(day) {
        checkIfDateIsAvailable(months[myCalender.month], day.innerHTML.replace(/^0+/, ''))
    });

    let bookedTime;
    let timeToRemove;
    let s = document.getElementById("sel1");

    /* Adding an eventlistener for the booking button, hiding the first modal and showing the final one 
    and sets variables for the booked time and which time to remove from the select index of options */
    document.getElementById("boka-knapp").addEventListener("click", function() {
        bookedTime = s.options[s.selectedIndex].value;
        timeToRemove = s.selectedIndex;
        //removeTimeFromDB(months[myCalender.month], currentDay, bookedTime, timeToRemove);
        $("#myModal").modal("hide");
        $("#myModal2").modal("show");
        document.getElementById("content").value = bookedTime;
    })

    /* Function to remove a record from the database, given a month, day, time & index
    I am not using the index anymore though, since I'm creating an array mirroring the times of the day */
    function removeTimeFromDB(month, day, time, index) {
        db.collection(month).doc(day).collection("Tider")
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    if (doc.data().Tid == time) {
                        db.collection(month).doc(day).collection("Tider").doc(doc.id).delete().then(function() {
                            for (i = 0; i < currentTimes.length; i++) {
                                if (currentTimes[i] == time) {
                                    currentTimes.splice(i, 1);
                                }
                            }
                            if (currentTimes.length == 0) {
                                days[currentDay - 1].classList.remove("selected");
                                days[currentDay - 1].classList.add("disabled");
                            } else {
                                return;
                            }
                        });
                    }
                });
            })
            .catch(function(error) {
                return error;
            });
    }

    /* Function to send an email and validating the information from the form,
    also removes the selected record from the database upon success */
    document.getElementById("send-button").addEventListener("click", function() {
        document.getElementById("day").value = months[myCalender.month] + " " + currentDay;
        var valid;
        valid = validateContact();
        if (valid) {
            jQuery.ajax({
                url: "booking-mail.php",
                data: 'userName=' + $("#userName").val() + '&userEmail=' +
                    $("#userEmail").val() + '&subject=' +
                    $("#subject").val() + '&content=' +
                    $(content).val() + '&day=' + $("#day").val(),
                type: "POST",
                success: function(data) {
                    $("#mail-status").html(data);
                    removeTimeFromDB(months[myCalender.month], currentDay, bookedTime, timeToRemove);
                    $("#userName").val("");
                    $("#subject").val("");
                    $("#userEmail").val("");
                    $("#day").val("");
                    $("#content").val("");
                },
                error: function() {}
            });
        }
    });

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
});