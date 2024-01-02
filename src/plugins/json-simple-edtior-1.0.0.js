var optionaHtml = '<span style="background-color: lightgrey; font-size:10px" onclick="openForm(\'$formId\')">Edit</span>';
var popupHtml = '<div class="form-popup" id="$formId"><span class="form-close" onclick="closeForm(\'$formId\')">&times;</span><div><textarea id="$textAreaId" rows="10" cols="80">$obj</textarea></div><button type="button" class="btn" onclick="deleteForm(\'$formId\', \'$pathStr\')">Delete</button>&nbsp;<button type="button" class="btn" onclick="updateForm(\'$formId\', \'$textAreaId\', \'$pathStr\')">Update</button></div>';

bracketExtender = {
    '{' : function(element, json, path, idx) { 
        var pathStr = path.join();
        var copyOptionaHtml = optionaHtml + " ";
        var copyPopupHtml = popupHtml + " ";
        var innerHtml = "{" + copyOptionaHtml + copyPopupHtml;
        innerHtml= innerHtml.replaceAll("$formId",  "formId_" + idx);
        innerHtml= innerHtml.replaceAll("$textAreaId",  "textAreaId_" + idx);
        innerHtml= innerHtml.replaceAll("$pathStr",  pathStr);
        innerHtml= innerHtml.replace("$obj",  JSON.stringify(json, undefined, 4));
        element.innerHTML = innerHtml; 
    }
}

function openForm(formId) {  
    document.getElementById(formId).style.display = "inline-block";
}

function closeForm(formId) {  
    document.getElementById(formId).style.display = "none";
}

function deleteForm(formId, pathStr) {  
    if (pathStr != "") {
        var path = pathStr.split(",");
        var lastObj = globalJson;
        var lastPath = path[0];
        for(var i = 1; i < path.length; i++) {
            lastObj = lastObj[lastPath];
            lastPath = path[i];
        }
        delete lastObj[lastPath];
    } else {
        globalJson = {};
    }

    var jsonContainer = document.getElementById("newRoot");
    buildJson(globalJson, jsonContainer);
    document.getElementById(formId).style.display = "none";
}


function updateForm(formId, inputId, pathStr) {

    var modifiedJson = document.getElementById(inputId).value;
    if (pathStr != "") {
        var path = pathStr.split(",");
        var lastObj = globalJson;
        var lastPath = path[0];
        for(var i = 1; i < path.length; i++) {
            lastObj = lastObj[lastPath];
            lastPath = path[i];
        }
        if (modifiedJson != ""){
            lastObj[lastPath] = JSON.parse(modifiedJson);
        } else {
            delete lastObj[lastPath];
        }
    } else {
        
        if (modifiedJson != ""){
            globalJson = JSON.parse(modifiedJson);
        } else {
            globalJson = {};
        }
    }

    var jsonContainer = document.getElementById("newRoot");
    buildJson(globalJson, jsonContainer);
    document.getElementById(formId).style.display = "none";
}