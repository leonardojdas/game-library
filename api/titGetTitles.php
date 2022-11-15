<?php

require ("../db/accessorManager.php");

$data = json_decode(file_get_contents("php://input"), true);
$dummyObj = new Library($data["lib_no"],null, null, null, null, null);

try {
    $am = new AccessorManager();
    $res = $am->getAvailableTitles($dummyObj);
    $res = json_encode($res, JSON_NUMERIC_CHECK);
    echo $res;
} catch (PDOException $e) {
    echo "*** ERROR: " . $e->getMessage();
}