<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;
// Import PHPMailer classes into the global namespace
// These must be at the top of your script, not inside a function
require("PHPMailer-master/src/PHPMailer.php");
require("PHPMailer-master/src/SMTP.php");
require("PHPMailer-master/src/Exception.php");

$mail = new PHPMailer(true);

try {
    //Server settings
    $mail->SMTPDebug = 0;                      // Enable verbose debug output
    $mail->isSMTP();                                            // Send using SMTP
    $mail->Host       = 'send.one.com';                         // Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
    $mail->Username   = 'info@jemmastables.com';                // SMTP username
    $mail->Password   = 'Jemma2019';                            // SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
    $mail->Port       = 587;                                    // TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above

    //Recipients
    $mail->setFrom('info@jemmastables.com', 'Kontakt Jemmastables.com');
    $mail->addAddress('info@jemmastables.com');           // Add a recipient
    $mail->addReplyTo('info@jemmastables.com', 'Information');

    // Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = "Kontaktformulär";
    $mail->Body    = "<b><h2>" . "Från hemsidan" . "</b></h2>" . "<br>" . "<b>" . $_POST["email"] . "</b>" . " har skickat meddelandet: " . "<br>" . $_POST["meddelande"] . "<br><br>" . "Mailet skickades " . date("h:i") . " - " . date("Y/m/d");

    $mail->send();
    echo 'Ditt mail har skickats!';
} catch (Exception $e) {
    echo "Mailet kunde inte skickas. Felmeddelande: {$mail->ErrorInfo}";
}