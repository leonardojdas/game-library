<?php

require ("../db/accessorManager.php");

try {
    $am = new accessorManager();
    $res = $am->getLibraries();
    $res = json_encode($res, JSON_NUMERIC_CHECK);
    echo $res;
} catch (PDOException $e) {
    echo "*** ERROR: " . $e->getMessage();
}