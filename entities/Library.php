<?php

class Library implements JsonSerializable {

    private $lib_no;
    private $lib_name;
    private $owner_name;
    private $creation_date;
    private $update_date;
    private $titles;

    public function __construct($lib_no, $lib_name, $owner_name, $creation_date, $update_date, $titles){
        $this->lib_no = $lib_no;
        $this->lib_name = $lib_name;
        $this->owner_name = $owner_name;
        $this->creation_date = $creation_date;
        $this->update_date = $update_date;
        $this->titles = $titles;
    }

    public function getLibNo(){
        return $this->lib_no;
    }

    public function getLibName(){
        return $this->lib_name;
    }

    public function getOwnerName(){
        return $this->owner_name;
    }

    public function jsonSerialize() {
        return get_object_vars($this);
    }

}

?>