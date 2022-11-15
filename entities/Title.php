<?php

class Title implements JsonSerializable {

    private $lib_no;
    private $titleplatf_no;
    private $title_name;
    private $platf_name;
    private $type_name;
    private $publi_name;
    private $manuf_name;

    public function __construct($lib_no, $titleplatf_no, $title_name, $platf_name, $type_name, $publi_name, $manuf_name){
        $this->lib_no = $lib_no;
        $this->titleplatf_no = $titleplatf_no;
        $this->title_name = $title_name;
        $this->platf_name = $platf_name;
        $this->type_name = $type_name;
        $this->publi_name = $publi_name;
        $this->manuf_name = $manuf_name;
    }

    public function getLibNo(){
        return $this->lib_no;
    }

    public function getTitleplatfNo(){
        return $this->titleplatf_no;
    }

    public function jsonSerialize() {
        return get_object_vars($this);
    }

}