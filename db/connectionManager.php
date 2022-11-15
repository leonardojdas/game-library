<?php

require ("../ChromePhp.php");

class ConnectionManager {

    function connectdb() {
        $db = new PDO("mysql:host=localhost;dbname=videogames", "php-user", "php");
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // throw exceptions
        return $db;
    }

}