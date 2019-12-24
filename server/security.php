<?php

$ALLOW_IDS = array(
'd41d8cd98f00b204e9800998ecf8427e',
'75d4bfaaf83cd3d3db817ef7b18bc55b',
'09ce1029cef09a3149814f295e168b1c'
);


$id = $_POST['id'];

$key = in_array($id, $ALLOW_IDS);

if ($key) {
    echo 'true';
} else {
    echo 'false';
}

?>
