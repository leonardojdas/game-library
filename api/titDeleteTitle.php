<?php

require ("../db/accessorManager.php");

$data = json_decode(file_get_contents("php://input"), true);
$dummyObj = new Title($data["lib_no"], $data["titleplatf_no"], null, null, null, null, null);

try {
    $am = new AccessorManager();
    $res = $am->deleteTitle($dummyObj);
    $res = json_encode($res, JSON_NUMERIC_CHECK);
    echo  $res;
} catch (PDOException $e) {
    echo "*** ERROR: " . $e->getMessage();
}