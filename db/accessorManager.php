<?php
$url = explode("/", $_SERVER['REQUEST_URI']);
$path = $_SERVER['DOCUMENT_ROOT'] . "/" . $url[1] . "/" . $url[2];
// $path = $_SERVER['DOCUMENT_ROOT'] . '/las/a6-crud-entities-accessors';

require ("connectionManager.php");
require ("../entities/Library.php");
require ("../entities/Title.php");

class accessorManager {
    private $conn               = NULL;
    private $getLibraries       = NULL;
    private $getTitles          = NULL;
    private $getLibrary         = NULL;
    private $updateLibrary      = NULL;
    private $createLibrary      = NULL;
    private $deleteLibrary      = NULL;
    private $getAvailableTitles = NULL;
    private $createTitle        = NULL;
    private $deleteTitle        = NULL;

    private $getLibrariesQuery       = " SELECT " .
                                       "     l.lib_no, " .
                                       "     l.lib_name, " .
                                       "     l.owner_name, " .
                                       "     DATE_FORMAT(l.creation_date, '%b %d, %y at %T') as creation_date, " .
                                       "     DATE_FORMAT(l.update_date, '%b %d, %y at %T') as update_date " .
                                       " FROM libraries l ; ";
    private $getTitlesQuery          = " SELECT " .
                                       "     lt.titleplatf_no as titleplatf_no, " .
                                       "     t.title_name as title_name, " .
                                       "     p.platf_name as platf_name, " .
                                       "     ty.type_name as type_name, " .
                                       "     pb.publi_name as publi_name, " .
                                       "     m.manuf_name as manuf_name " .
                                       " FROM lib_titles lt " .
                                       " LEFT JOIN titles_platf tp on tp.titleplatf_no = lt.titleplatf_no " .
                                       " LEFT JOIN titles t on t.title_no = tp.title_no " .
                                       " LEFT JOIN platforms p on p.platf_no = tp.platf_no " .
                                       " LEFT JOIN manufacturers m on m.manuf_no = p.manuf_no " .
                                       " LEFT JOIN types ty on ty.type_no = t.type_no " .
                                       " LEFT JOIN publishers pb on pb.publi_no = t.publi_no " .
                                       " WHERE lt.lib_no = :lib_no " .
                                       " ORDER BY p.platf_no, t.title_name; ";
    private $getLibraryQuery         = " SELECT * FROM libraries WHERE lib_no = :lib_no; ";
    private $updateLibraryQuery      = " UPDATE libraries SET lib_name = :lib_name, owner_name = :owner_name, update_date = NOW() WHERE lib_no = :lib_no; ";
    private $createLibraryQuery      = " INSERT INTO libraries(lib_name, owner_name, creation_date) VALUES(:lib_name, :owner_name, NOW()); ";
    private $deleteLibraryQuery      = " DELETE FROM lib_titles WHERE lib_no = :lib_no; " .
                                       " DELETE FROM libraries WHERE lib_no = :lib_no; ";
    private $getAvailableTitlesQuery = " SELECT " .
                                       "     tp.titleplatf_no as titleplatf_no, " .
                                       "     t.title_name as title_name, " .
                                       "      p.platf_name as platf_name " .
                                       " FROM titles_platf tp " .
                                       " INNER JOIN titles t on t.title_no = tp.title_no " .
                                       " INNER JOIN platforms p on p.platf_no = tp.platf_no " .
                                       " WHERE tp.titleplatf_no NOT IN(SELECT titleplatf_no FROM lib_titles lt WHERE lib_no = :lib_no); ";
    private $createTitleQuery        = " INSERT INTO lib_titles VALUES(:lib_no,:titleplatf_no); " .
                                       " UPDATE libraries SET update_date = NOW() WHERE lib_no = :lib_no; ";
    private $deleteTitleQuery        = " DELETE FROM lib_titles WHERE lib_no = :lib_no AND titleplatf_no = :titleplatf_no; ";

    public function __construct(){
        $cm = new ConnectionManager();

        $this->conn = $cm->connectdb();
        if(is_null($this->conn)) throw new Exception("AccessorManager: no connection");

        $this->getLibraries = $this->conn->prepare($this->getLibrariesQuery);
        if(is_null($this->getLibraries)) throw new Exception("AccessorManager: bad statement: '" . $this->getLibrariesQuery . "'");

        $this->getTitles = $this->conn->prepare($this->getTitlesQuery);
        if(is_null($this->getTitles)) throw new Exception("AccessorManager: bad statement: '" . $this->getTitlesQuery . "'");

        $this->getLibrary = $this->conn->prepare($this->getLibraryQuery);
        if(is_null($this->getLibrary)) throw new Exception("AccessorManager: bad statement: '" . $this->getLibraryQuery . "'");

        $this->updateLibrary = $this->conn->prepare($this->updateLibraryQuery);
        if(is_null($this->updateLibrary)) throw new Exception("AccessorManager: bad statement: '" . $this->updateLibraryQuery . "'");

        $this->createLibrary = $this->conn->prepare($this->createLibraryQuery);
        if(is_null($this->createLibrary)) throw new Exception("AccessorManager: bad statement: '" . $this->createLibraryQuery . "'");

        $this->deleteLibrary = $this->conn->prepare($this->deleteLibraryQuery);
        if(is_null($this->deleteLibrary)) throw new Exception("AccessorManager: bad statement: '" . $this->deleteLibraryQuery . "'");
        
        $this->getAvailableTitles = $this->conn->prepare($this->getAvailableTitlesQuery);
        if(is_null($this->getAvailableTitles)) throw new Exception("AccessorManager: bad statement: '" . $this->getAvailableTitlesQuery . "'");

        $this->createTitle = $this->conn->prepare($this->createTitleQuery);
        if(is_null($this->createTitle)) throw new Exception("AccessorManager: bad statement: '" . $this->createTitleQuery . "'");

        $this->deleteTitle = $this->conn->prepare($this->deleteTitleQuery);
        if(is_null($this->deleteTitle)) throw new Exception("AccessorManager: bad statement: '" . $this->deleteTitleQuery . "'");

    }

    public function getLibraries(){
        $res = [];

        try{
            $this->getLibraries->execute();
            $dbRes = $this->getLibraries->fetchAll(PDO::FETCH_ASSOC);
            
            foreach($dbRes as $l){
                $titles = $this->getTitles($l["lib_no"]);
                $obj = new Library($l["lib_no"], $l["lib_name"], $l["owner_name"], $l["creation_date"], $l["update_date"], $titles);
                array_push($res, $obj);
            }
        }catch(Exception $e){
            $res = [];
        }finally{
            if (!is_null($this->getLibraries)) {
                $this->getLibraries->closeCursor();
            } 
        }

        return $res;
    }

    private function getTitles($lib_no){
        $res = [];

        try{
            $this->getTitles->bindParam(":lib_no", $lib_no);
            $this->getTitles->execute();
            $dbRes = $this->getTitles->fetchAll(PDO::FETCH_ASSOC);

            foreach($dbRes as $t){
                $obj = new Title($lib_no, $t["titleplatf_no"], $t["title_name"], $t["platf_name"], $t["type_name"], $t["publi_name"], $t["manuf_name"]);
                array_push($res, $obj);
            }
        }catch(Exception $e){
            $res = [];
        }finally{
            if (!is_null($this->getTitles)) {
                $this->getTitles->closeCursor();
            }
        }

        return $res;
    }

    public function getLibrary($lib){
        $res = "";

        try{
            $lib_no = $lib->getLibNo();
            $titles = $this->getTitles($lib_no);
            $this->getLibrary->bindParam(":lib_no", $lib_no);
            $this->getLibrary->execute();
            $l = $this->getLibrary->fetch(PDO::FETCH_ASSOC);
            if(boolval($l)) $res = new Library($lib_no, $l["lib_name"], $l["owner_name"], $l["creation_date"], $l["update_date"], $titles);
        }catch(Exception $e){
            $res = "";
        }finally{
            if (!is_null($this->getLibrary)) {
                $this->getLibrary->closeCursor();
            }
        }

        return $res;
    }

    public function updateLibrary($lib){
        $res = false;

        try{
            $lib_no = $lib->getLibNo();
            $lib_name = $lib->getLibName();
            $owner_name = $lib->getOwnerName();
            $this->updateLibrary->bindParam(":lib_no", $lib_no);
            $this->updateLibrary->bindParam(":lib_name", $lib_name);
            $this->updateLibrary->bindParam(":owner_name", $owner_name);
            $res = $this->updateLibrary->execute();
        }catch(Exception $e){
            $res = false;
        }finally{
            if (!is_null($this->updateLibrary)) {
                $this->updateLibrary->closeCursor();
            }
        }

        return $res;
    }

    public function createLibrary($lib){
        $res = false;

        try{
            $lib_name = $lib->getLibName();
            $owner_name = $lib->getOwnerName();
            $this->createLibrary->bindParam(":lib_name", $lib_name);
            $this->createLibrary->bindParam(":owner_name", $owner_name);
            $res = $this->createLibrary->execute();
        }catch(Exception $e){
            $res = false;
        }finally{
            if (!is_null($this->createLibrary)) {
                $this->createLibrary->closeCursor();
            }
        }

        return $res;
    }

    public function deleteLibrary($lib){
        $res = false;

        try{
            $lib_no = $lib->getLibNo();
            $this->deleteLibrary->bindParam(":lib_no", $lib_no);
            $res = $this->deleteLibrary->execute();
        }catch(Exception $e){
            $res = false;
        }finally{
            if (!is_null($this->deleteLibrary)) {
                $this->deleteLibrary->closeCursor();
            }
        }

        return $res;
    }

    public function getAvailableTitles($lib){
        $res = [];

        try{
            $lib_no = $lib->getLibNo();
            $this->getAvailableTitles->bindParam(":lib_no", $lib_no);
            $this->getAvailableTitles->execute();
            $dbRes = $this->getAvailableTitles->fetchAll(PDO::FETCH_ASSOC);

            foreach($dbRes as $t){
                $obj = new Title($lib_no, $t["titleplatf_no"], $t["title_name"], $t["platf_name"], null, null, null);
                array_push($res, $obj);
            }
        }catch(Exception $e){
            $res = [];
        }finally{
            if (!is_null($this->getAvailableTitles)) {
                $this->getAvailableTitles->closeCursor();
            }
        }

        return $res;
    }

    public function createTitle($tit){
        $res = false;

        try{
            $lib_no = $tit->getLibNo();
            $titleplatf_no = $tit->getTitleplatfNo();
            $this->createTitle->bindParam(":lib_no", $lib_no);
            $this->createTitle->bindParam(":titleplatf_no", $titleplatf_no);
            $res = $this->createTitle->execute();
        }catch(Exception $e){
            $res = false;
        }finally{
            if (!is_null($this->createTitle)) {
                $this->createTitle->closeCursor();
            }
        }

        return $res;
    }

    public function deleteTitle($tit){
        $res = false;

        try{
            $lib_no = $tit->getLibNo();
            $titleplatf_no = $tit->getTitleplatfNo();
            $this->deleteTitle->bindParam(":lib_no", $lib_no);
            $this->deleteTitle->bindParam(":titleplatf_no", $titleplatf_no);
            $res = $this->deleteTitle->execute();
        }catch(Exception $e){
            $res = false;
        }finally{
            if (!is_null($this->deleteTitle)) {
                $this->deleteTitle->closeCursor();
            }
        }

        return $res;
    }
}

?>