<?php

$type = $_POST['type'];
$messages = $_POST['messages'];
$date = new \DateTime('now');
$format = $date->format('D M d, Y G:i');


if ($type) {
    if ($type == 'clicker') {
        file_put_contents("./logs/clicker/{$format}log.txt", $messages);
        echo "File Sent Successfully clicker! {$messages}";
    } else if ($type == 'vacancy') {
        file_put_contents("./logs/vacancy/{$format}log.txt", $messages);
        echo "File Sent Successfully vacancy! {$messages}";
    } else {
          echo "No Type";
    }
} else {
    echo "No Type";
}

?>
