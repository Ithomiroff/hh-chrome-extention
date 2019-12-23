<?php

$messages = $_POST['messages'];
$date = new \DateTime('now');
$format = $date->format('D M d, Y G:i');
file_put_contents("./logs/{$format}log.txt", $messages);
$version = phpversion();

echo "File Sent Successfully {$messages}";
?>
