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
    $mail->Password   = 'xxxxxxxxx';                            // SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
    $mail->Port       = 587;                                    // TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above

    //Recipients
    $mail->setFrom('info@jemmastables.com', 'Tidsbokning Jemmastables.com');
    $mail->addAddress('info@jemmastables.com');           // Add a recipient
    $mail->addReplyTo($_POST['userEmail'], 'Information');

    // Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = $_POST['subject'];
    $mail->Body    = "<b><h2>" . $_POST['subject'] . "</b></h2>" . "<br>" . "<b>" . "Namn: " . "</b>" . $_POST['userName'] . "<br>" . "<b>" . "E-mail: " . "</b>" . $_POST["userEmail"] . "<br>" . "<b>" . "Dag: " . "</b>" . $_POST["day"] . "<br>" . "<b>" . "Klockan: " . "</b>" . $_POST["content"] . "<br><br>" . "Tidbokningen gjordes " . date("h:i") . " - " . date("Y/m/d");

    $mail->send();
    curl_setopt_array($ch = curl_init(), array(
        CURLOPT_URL => "https://api.pushed.co/1/push",
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => array(
          "app_key" => "wBY7IP9MGwbCB1e6N8an",
          "app_secret" => "zCZjuCNMahjKi9pw5j6vvz29Sp4IXI5pU2vJl5b7uD9Th1uM3Mt7bkADcj1EWb26",
          "target_type" => "app",
          "content" => $mail->Body
        ),
        CURLOPT_SAFE_UPLOAD => true,
        CURLOPT_RETURNTRANSFER => true
      ));
      curl_exec($ch);
      curl_close($ch);
    echo 'Din tid har blivit bokad!';
} catch (Exception $e) {
    echo "Tiden kunde inte bokas. Felmeddelande: {$mail->ErrorInfo}";
}