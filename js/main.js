const ERROR_ACCESSOR_MSG = "Error handling db accessor";

window.onload = function () {

    let page = window.location.pathname.split("/")[3];
    let destiny = window.location.search.split("&")[0]; // d = l: library; d = t: title
    let id = window.location.search;
    
    page += destiny;

    switch(page){
        case "libraries.php":
            getLibraries();
            break;
        case "library.php?d=l":
            id = Number(id.split("=")[2]);
            getLibrary(id, "l");
            break;
        case "library.php?d=t":
            id = Number(id.split("=")[2]);
            //getTitles(id);
            getLibrary(id, "t");
            break;
        default:
            loadEventHandlers();
            break;
    }
};

// -----------------  SECTION 1 - Button events handlers and helpers

function loadEventHandlers(){
    document.querySelectorAll("button").forEach(e => {
        e.addEventListener("click", handleActionButton);
    });
}

function handleActionButton(e){
    let operation = e.target.name;
    let id = e.target.value;
    let url = "";
    
    switch(operation){
        case "read-libraries":
            url = "libraries.php";
            break;
        case "create-lib":
            createLibrary();
            break;
        case "read-library":
            url = "library.php?d=l&id=" + id;
            break;
        case "update-lib":
            updateLibrary();
            break;
        case "delete-lib":
            deleteLibrary(id);
            break;
        case "create-title":
            createTitle();
            break;
        case "read-title":
            url = "library.php?d=t&id=" + id;
            break;
        case "delete-title":
            deleteTitle(id);
            break;
        case "back-lib":
            url = "libraries.php";
            break;
        case "back-index":
            url = "index.php";
            break;
        default:
            url = "index.php";
            break;
    }

    if(url !== ""){
        window.location.href = url;
    }
}

function toggleMessage(msg){
    container = document.querySelector("#message-container");
    message = document.querySelector("#message-container-inner");
    
    message.innerHTML = msg;
    container.classList.add("show");
    setTimeout(() =>{ container.classList.remove("show"); }, 1500);
}

function isValidResponse(res){
    let r = true;
    if(res === "[]" || res === '""' || res === "false") r = false;
    return r;
}

// -----------------  END OF SECTION 1 - Button events handlers


// -----------------  SECTION 2 - Libraries Read

function getLibraries(){
    let url = "api/libGetLibraries.php";
    let xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let resp = xhr.responseText;

            try{
                if(isValidResponse(resp)) buildLibraryContainer(JSON.parse(resp));
                else{
                    console.log(ERROR_ACCESSOR_MSG);
                    toggleMessage(ERROR_ACCESSOR_MSG);
                }
            } catch(e){
                console.log("Error handling getLibraries");
                console.log(e);
            }
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
}

function buildLibraryContainer(arr){
    let container = document.querySelector("#content-container-inner");
    let html = "";
    
    arr.forEach(e => {
        html += "<table>";
        html += "   <tr>";
        html += "       <td>";
        html += "           <div class='library-container'>";        

        html += "               <div><div class='lib-name'>" + e.lib_name + "</div>";
        html += "                   <div class='lib-buttons'>";
        html += "                       <button type='button' class='lib-buttons-add' name='read-title' value='" + e.lib_no + "' title='Add game title'>&#10010;</button>";
        html += "                       <button type='button' class='lib-buttons-update' name='read-library' value='" + e.lib_no + "' title='Update library'>&#9998;</button>";
        html += "                       <button type='button' class='lib-buttons-delete' name='delete-lib' value='" + e.lib_no + "' title='Delete library'>&#10006;</button>";
        html += "                   </div>";
        html += "               </div>";
        html += "               <div class='lib-owner'>by " + e.owner_name + "</div>";
        html += "               <div id='creation_date' class='lib-creation-date'>created in " + e.creation_date + (e.update_date !== null ? ", and updated in " + e.update_date : "") + "</div>";

        html += "               <div id='current_titles_container'>";
        
        if(e.titles.length === 0){
            html += "               <div class='lib-item-empty'>Your library is empty!</div>";
        } else {
            html += "               <div class='lib-header-container'>";
            html += "                   <div class='lib-header lib-header-title'>Title</div>";
            html += "                   <div class='lib-header lib-header-platf'>Platform</div>";
            html += "                   <div class='lib-header lib-header-type'>Type</div>";
            html += "                   <div class='lib-header lib-header-publi'>Publisher</div>";
            html += "                   <div class='lib-header lib-header-remove'></div>";
            html += "               </div>";
            
            e.titles.forEach(t => {
                html += "           <div class='lib-items'>";
                html += "               <div class='lib-item lib-item-title lib-item-manuf-" + t.manuf_name.toLowerCase() + "'>" + t.title_name + "</div>";
                html += "               <div class='lib-item lib-item-platf'>" + t.platf_name + "</div>";
                html += "               <div class='lib-item lib-item-type'>" + t.type_name + "</div>";
                html += "               <div class='lib-item lib-item-publi'>" + t.publi_name + "</div>";
                html += "               <div class='lib-item lib-item-remove'>";
                html += "                   <button type='button' class='lib-buttons-remove' name='delete-title' value='" + e.lib_no + "-" + t.titleplatf_no + "'>&#10006;</button>";
                html += "               </div>";
                html += "           </div>";
            });
        }
        
        html += "               </div>";
        html += "           </div>";
        html += "       </td>";
        html += "   </tr>";
        html += "</table>";
    });
    
    html += "<table>";
    html += "   <tr>";
    html += "       <td>";
    html += "           <button type='button' id='submit' class='button' name='read-library' value='0'>Add library</button>";
    html += "       </td>";
    html += "   </tr>";
    html += "</table>";

    container.innerHTML = html;
    loadEventHandlers();
}

// -----------------  END OF SECTION 2 - Libraries Read


// -----------------  SECTION 3 - Library Details CRUD

function getLibrary(lib_no, page){   
    let url = "api/libGetLibrary.php";
    let xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = async function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let resp = xhr.responseText;

            try{
                if(lib_no === 0){ // add new lib
                    buildLibraryDetails(lib_no, 0);
                } else if(isValidResponse(resp)){
                    if(page === "l") {
                        buildLibraryDetails(lib_no, JSON.parse(resp));
                    } else {
                        let availableTitles = await getAvailableTitles(lib_no);
                        buildLibraryTitles(JSON.parse(resp), availableTitles);
                    }
                } else {
                    console.log(ERROR_ACCESSOR_MSG);
                    toggleMessage(ERROR_ACCESSOR_MSG);
                }

            } catch(e){
                console.log("Error handling getLibrary");
                console.log(e);
            }
        }
    };
    xhr.open("POST", url, true);
    let obj = {lib_no: lib_no};
    xhr.send(JSON.stringify(obj));
}

function buildLibraryDetails(lib_no, lib){
    let html = "";
    let btnName = (lib_no === 0 ? "create-lib" : "update-lib");
    let btnText = (lib_no === 0 ? "Create new library" : "Update library");
    let lib_name = (lib === 0 ? "" : lib.lib_name);
    let owner_name = (lib === 0 ? "" : lib.owner_name);
    
    html += "<table>";
    html += "   <tr>";
    html += "       <td>";
    html += "           <div class='library-container'>";
    html += "               <input type='hidden' id='lib_no' name='lib_no' value='" + lib_no + "'>";
    html += "               <div class='lib-name'>" + btnText + "</div>";
    html += "               <div class='library-section'>Library name</div>";
    html += "               <div class='library-titles-input'><input type='text' id='lib_name' name='lib_name' value='" + lib_name + "' maxlength='50'></div>";

    html += "               <div class='library-section'>Library author</div>";
    html += "               <div class='library-titles-input'><input type='text' id='owner_name' name='owner_name' value='" + owner_name + "' maxlength='50'></div>";
    html += "           </div>";
    html += "       </td>";
    html += "   </tr>";

    html += "   <tr>";
    html += "       <td class='last-button'>";
    html += "           <button type='button' id='submit' class='button' name='" + btnName + "' value=''>" + btnText + "</button>";
    html += "       </td>";
    html += "   </tr>";
    html += "</table>";
    
    document.querySelector("#content-container-inner").innerHTML = html;
    loadEventHandlers();
}

function updateLibrary(){
    let lib_no = document.querySelector("#lib_no").value;;
    let lib_name = document.querySelector("#lib_name").value;
    let owner_name = document.querySelector("#owner_name").value;
    
    if(lib_no === "" || lib_name === "" || owner_name === ""){
        toggleMessage("Please inform a name/author!");
    } else {
        let url = "api/libUpdateLibrary.php";
        let xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let resp = xhr.responseText;

                try{
                    if(isValidResponse(resp)){
                        toggleMessage("Library updated succeeded!");
                        setTimeout(() => { window.location.href = "libraries.php"; }, 1500);
                    } else {
                        console.log(ERROR_ACCESSOR_MSG);
                        toggleMessage(ERROR_ACCESSOR_MSG);
                    }
                }catch(e){
                    console.log("Error handling updateLibrary");
                    console.log(e);
                }
            }
        };

        xhr.open("POST", url, true);
        let obj = {
            lib_no: lib_no,
            lib_name: lib_name,
            owner_name: owner_name
        };
        xhr.send(JSON.stringify(obj));
    }
}

function createLibrary(){
    let lib_name = document.querySelector("#lib_name").value;
    let owner_name = document.querySelector("#owner_name").value;
    
    if(lib_name === "" || owner_name === ""){
        toggleMessage("Please inform a name/author!");
    } else {
        let url = "api/libCreateLibrary.php";
        let xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let resp = xhr.responseText;

                try{
                    if(isValidResponse(resp)){
                        toggleMessage("Library created succeeded!");
                        setTimeout(() => { window.location.href = "libraries.php"; }, 1500);
                    } else {
                        console.log(ERROR_ACCESSOR_MSG);
                        toggleMessage(ERROR_ACCESSOR_MSG);
                    }
                }catch(e){
                    console.log("Error handling createLibrary");
                    console.log(e);
                }
            }
        };

        xhr.open("POST", url, true);
        let obj = {
            lib_name: lib_name,
            owner_name: owner_name
        };
        xhr.send(JSON.stringify(obj));
    }
}

function deleteLibrary(lib_no){
    if(lib_no === ""){
        toggleMessage("Please inform the id!");
    } else {
        let url = "api/libDeleteLibrary.php";
        let xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let resp = xhr.responseText;

                try{
                    if(isValidResponse(resp)){
                        toggleMessage("Library deleted succeeded!");
                        setTimeout(() => { window.location.href = "libraries.php"; }, 1500);
                    } else {
                        console.log(ERROR_ACCESSOR_MSG);
                        toggleMessage(ERROR_ACCESSOR_MSG);
                    }
                }catch(e){
                    console.log("Error handling createLibrary");
                    console.log(e);
                }
            }
        };

        xhr.open("POST", url, true);
        let obj = {lib_no: lib_no};
        xhr.send(JSON.stringify(obj));
    }
}

// -----------------  END OF ECTION 3 - Library Details CRUD


// -----------------  SECTION 4 - Library Titles CRUD

function getAvailableTitles(lib_no){    
    return new Promise((resolve, reject) =>{
        url = "api/titGetTitles.php";
        let xhr = new XMLHttpRequest();
        xhr.onload = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let resp = xhr.responseText;
    
                try{
                    resolve(resp === "[]" ? "" : JSON.parse(resp));
                }catch(e){
                    console.log("Error handling getAvailableTitles");
                    console.log(e);
                }
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.responseText
                });
            }
        };
    
        xhr.open("POST", url, true);
        let obj = {lib_no: lib_no};
        xhr.send(JSON.stringify(obj));
    });
}

function buildLibraryTitles(currentTitles, availableTitles){
    let container = document.querySelector("#content-container-inner");
    let lib_no = currentTitles.lib_no;
    let lib_name = currentTitles.lib_name;
    let owner_name = currentTitles.owner_name;
    let title_no = currentTitles.title_no;
    let hasGamesAvailable = (availableTitles.length === 0 ? false : true);
    let disabled = "";
    let html = "";
    
    html += "<table>";
    html += "   <tr>";
    html += "       <td>";
    html += "           <div class='library-container'>";
    html += "               <input type='hidden' id='lib_no' name='lib_no' value='" + lib_no + "'>";
    html += "               <div id='lib-name' class='lib-name'>" + lib_name + "</div>";
    html += "               <div id='owner_name' class='lib-owner'>" + owner_name + "</div>";                    
    html += "               <div id='titles_container'>";
    
    // available games library
    if(!hasGamesAvailable){
        html += "               <div class='lib-item-empty'>Your selected all titles!</div>";
        disabled = "disabled";
    } else {
        html += "                <div class='library-section'>Select a title</div>";
        html += "               <div class='library-titles-input'>";
        html += "                   <select id='titleplatf_no' name='titleplatf_no'>";
        html += "                       <option></option>";
        availableTitles.forEach(e => {
            html += "                   <option value='" + e.titleplatf_no + "'>" + e.title_name + " (" + e.platf_name + ")</option>";
        });
        html += "";
        html += "                   </select>";
        html += "               </div>";
    }
    html += "               </div>";
    
    // current games library
    html += "               <div id='current_titles_container' >";
    if(title_no === null){
        html += "               <div class='lib-item-empty'>Your library is empty!</div>";
    } else {
        html += "               <div class='library-section'>Current list</div>";
        html += "                   <div class='lib-header-container'>";
        html += "                   <div class='lib-header lib-header-title lib-header-no-remove'>Title</div>";
        html += "                   <div class='lib-header lib-header-platf'>Platform</div>";
        html += "                   <div class='lib-header lib-header-type'>Type</div>";
        html += "                   <div class='lib-header lib-header-publi'>Publisher</div>";
        html += "               </div>";

        currentTitles.titles.forEach(e => {
            html += "           <div class='lib-items'>";
            html += "               <div class='lib-item lib-item-title lib-item-no-remove lib-item-manuf-" + e.manuf_name.toLowerCase() + "'>" + e.title_name + "</div>";
            html += "               <div class='lib-item lib-item-platf'>" + e.platf_name + "</div>";
            html += "               <div class='lib-item lib-item-type'>" + e.type_name + "</div>";
            html += "               <div class='lib-item lib-item-publi'>" + e.publi_name + "</div>";
            html += "           </div>";
        });
    }

    html += "               </div>";
    html += "           </div>";
    html += "       </td>";
    html += "   </tr>";
    html += "   <tr>";
    html += "       <td class='last-button'>";
    html += "           <button type='button' id='submit' class='button' name='create-title' value='' " + disabled + ">Add title</button>";
    html += "       </td>";
    html += "   </tr>";
    html += "</table>";
            
    container.innerHTML = html;
    loadEventHandlers();
}

function createTitle(){
    let lib_no = document.querySelector("#lib_no").value;
    let titleplatf_no = document.querySelector("#titleplatf_no").value;
    
    if(lib_no === "" || titleplatf_no === ""){
        toggleMessage("Please selected a title!");
    } else {
        let url = "api/titCreateTitle.php";
        let xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let resp = xhr.responseText;

                if(isValidResponse(resp)){
                    toggleMessage("Title added succeeded!");
                    setTimeout(() => { window.location.href = "libraries.php"; }, 1500);
                } else {
                    console.log(ERROR_ACCESSOR_MSG);
                    toggleMessage(ERROR_ACCESSOR_MSG);
                }
            }
        };

        xhr.open("POST", url, true);
        let obj = {
            lib_no: lib_no,
            titleplatf_no: titleplatf_no
        };
        xhr.send(JSON.stringify(obj));
    }
}

function deleteTitle(id){
    let lib_no = id.split("-")[0];
    let titleplatf_no = id.split("-")[1];
    
    if(lib_no === "" || titleplatf_no === ""){
        console.log("show message");
    } else {
        let url = "api/titDeleteTitle.php";
        let xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let resp = xhr.responseText;

                if(isValidResponse(resp)){
                    toggleMessage("Title removed succeeded!");
                    setTimeout(() => { window.location.href = "libraries.php"; }, 1500);
                } else {
                    console.log(ERROR_ACCESSOR_MSG);
                    toggleMessage(ERROR_ACCESSOR_MSG);
                }
            }
        };

        xhr.open("POST", url, true);
        let obj = {
            lib_no: lib_no,
            titleplatf_no: titleplatf_no
        };
        xhr.send(JSON.stringify(obj));
    }
}

// -----------------  END OF SECTION 4 - Library Titles CRUD