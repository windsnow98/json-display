function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

function sendPostRequest(urlInputId, headerInputId, dataInputId, cookieName) {

    var xhr = new XMLHttpRequest();

    var url = document.getElementById(urlInputId).value;
    console.log(url);
    xhr.open("POST", url, true);

    var headers = [];
    var headerInput = document.getElementById(headerInputId).value;
    if (!!headerInput) {
      headers = headerInput.split(";");
    }
    for(let key in headers){
      if (!!key){
        xhr.setRequestHeader(key, headers[key]) 
      }
    }
    if (!!cookieName) {
      xhr.setRequestHeader("Authorization", "Bearer " + getCookie(cookieName));
    }

    var dataInput = document.getElementById(dataInputId).value;
    xhr.send("");
    
    xhr.onload = function() {
      console.log(this.responseText);
      globalJson = JSON.parse(this.responseText);
      buildJson(globalJson, document.getElementById("newRoot"));
    }
}