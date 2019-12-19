<?php

$to      = $_POST["email"];
$subject = 'HH CLICKER';
$message = "Сделано: {$_POST["doneClicks"]} кликов.
Задача сделать: {$_POST["maxClicks"]} кликов.
Время начала: {$_POST["timeStart"]}.
Время окончания: {$_POST["timeEnd"]}.
";
$headers = 'From: clicker-hh@extention.com' . "\r\n" .
    'Reply-To: clicker-hh@extention.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

mail($to, $subject, $message, $headers);

echo "File Sent Successfully."; 
?>