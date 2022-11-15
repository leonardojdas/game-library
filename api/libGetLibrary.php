<?php

require ("../db/accessorManager.php");

$lib_no = json_decode(file_get_contents("php://input"), true)["lib_no"];
$dummyObj = new Library($lib_no, null, null, null, null, null);

try {
    $am = new accessorManager();
    $res = $am->getLibrary($dummyObj);
    $res = json_encode($res, JSON_NUMERIC_CHECK);
    echo $res;
} catch (PDOException $e) {
    echo "*** ERROR: " . $e->getMessage();
}

?>