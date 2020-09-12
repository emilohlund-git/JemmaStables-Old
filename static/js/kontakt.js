$(document).ready(function() {
    /* Function to send an email and validating the information from the form,
    also removes the selected record from the database upon success */
    document.getElementById("send-button-kontakt").addEventListener("click", function() {
        var valid;
        valid = validateContact();
        if (valid) {
            jQuery.ajax({
                url: "contact-mail.php",
                data: 'namn=' + $("#namn").val() + '&email=' +
                    $("#email").val() + '&ämne=' +
                    $("#ämne").val() + '&meddelande=' +
                    $(meddelande).val(),
                type: "POST",
                success: function(data) {
                    $("#email-status-kontakt").html(data);
                    $("#namn").val("");
                    $("#ämne").val("");
                    $("#email").val("");
                    $("#meddelande").val("");
                },
                error: function() {}
            });
        }
    });

    /* Validation function for the form */
    function validateContact() {
        var valid = true;
        if (!$("#namn").val()) {
            $("#namn-info").html("(obligatoriskt)");
            $("#namn").val("Du måste fylla i ditt namn.");
            valid = false;
        }
        if (!$("#email").val()) {
            $("#email-info").html("(obligatoriskt)");
            $("#email").val("Du måste fylla i en epost adress.")
            valid = false;
        }
        if (!$("#email").val().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)) {
            $("#email-info").html("(ogiltig  )");
            $("#email").val("Ogilig epost adress.")
            valid = false;
        }
        if (!$("#ämne").val()) {
            $("#ämne-info").html("(obligatoriskt)");
            $("#ämne").css('background-color', '#FFFFDF');
            valid = false;
        }
        if (!$("#meddelande").val()) {
            $("#meddelande-info").html("(obligatoriskt)");
            $("#meddelande").css('background-color', '#FFFFDF');
            valid = false;
        }
        return valid;
    }
});