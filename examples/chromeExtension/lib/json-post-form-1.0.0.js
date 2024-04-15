function postFormLog() {
  console.log("loading json-post-form");
}

var curlHistorys = [];

var collectionObj = {};

var restForm = {};

function initForm() {
  restForm.httpMethodSelect = document.getElementById('httpMethodSelect');
  restForm.textEndpoint = document.getElementById('textEndpoint');
  restForm.textHeaders = document.getElementById('textHeaders');
  restForm.textData = document.getElementById('textData');
  restForm.curlCommandInput = document.getElementById("curlCommand");
  restForm.historySelector = document.getElementById("historySelector");
  restForm.commandGroupSelector = document.getElementById("commandGroupSelector");
  restForm.commandSelector = document.getElementById("commandSelector");
}

// *** UI events ***

// switch tab by click event
function tabClick(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// show curl tab
function showCurl(evt, tabName) {
  let curlObj = uiToCurlObject();
  let curlCmd = curlCommandBuilder(curlObj);
  tabClick(evt, tabName);
  restForm.curlCommandInput.value = curlCmd;
}

// show form ui tab -- this method take `textCurlCommandId`
function showUI(evt, tabName, textCurlCommandId) {
  var command = document.getElementById(textCurlCommandId).value;
  
  if (command === undefined || command === ""){
    tabClick(evt, tabName); 
    return;
  }

  let curlObj = commandToCurlObject(command);        
  tabClick(evt, tabName);

  setFormUiFeidls(curlObj);
}

// set element value
function clicked_setValue(inputId, val) {
  document.getElementById(inputId).value = val;
}

// format json data
function clicked_formatJson() {
  restForm.textData.value = JSON.stringify(JSON.parse(restForm.textData.value), null, 2);
}

// compact json data
function clicked_compactJson() {
  restForm.textData.value = JSON.stringify(JSON.parse(restForm.textData.value));
}

// create a new history
function clicked_newHistory() {              
  // add a new option
  var nextIndex = curlHistorys.length+1;
  var option = document.createElement("option");
  option.text = "History " + nextIndex;
  option.value = nextIndex;
  restForm.historySelector.add(option);
  // put existing one to history 
  let curlObj = uiToCurlObject();
  let curlCmd = curlCommandBuilder(curlObj);
  curlHistorys.push(curlCmd);
  console.log("command:" + curlCmd);                
}

function changed_selectedHistory() {
  var newIndex = restForm.historySelector.selectedIndex;
  var curlCommand = curlHistorys[newIndex];
  // set on curl command ui
  restForm.curlCommandInput.value = curlCommand; 
  // set on UI
  let curlObj = commandToCurlObject(curlCommand);
  setFormUiFeidls(curlObj);
}

function init_commandGroup(obj) {
  collectionObj = obj;
  var groups = collectionObj["commandGroup"];
  for(let i = 0; i < groups.length; i++) {
    var option = document.createElement("option");
    option.text = groups[i];
    option.value = i;
    restForm.commandGroupSelector.add(option);
  }
}

function changed_selectedCommandGroup() {
  var newIndex = restForm.commandGroupSelector.selectedIndex;
  var i, L = restForm.commandSelector.options.length - 1;
  for(i = L; i >= 0; i--) {
    restForm.commandSelector.remove(i);
  }
  var commandGroup = collectionObj["commandGroup"][newIndex];
  var commands = collectionObj[commandGroup];
  for (let i = 0; i < commands.length; i++) {
    var option = document.createElement("option");
    option.text = commands[i].name;
    option.value = commands[i].curl;
    restForm.commandSelector.add(option);
  }
}

function changed_selectedCommand() {
  var commandGroupIndex = restForm.commandGroupSelector.selectedIndex;  
  var comandIndex = restForm.commandSelector.selectedIndex;
  var commandGroup = collectionObj["commandGroup"][commandGroupIndex];
  var curlCommand = collectionObj[commandGroup][comandIndex].curl;
  // set on curl command ui
  restForm.curlCommandInput.value = curlCommand; 
  // set on UI
  let curlObj = commandToCurlObject(curlCommand);
  setFormUiFeidls(curlObj); 
}

function setFormUiFeidls(curlObj) {
  
  if (curlObj["request"] !== undefined) {
    if (curlObj["request"]["method"] !== undefined) {
      restForm.httpMethodSelect.value = curlObj["request"]["method"];
    }
    if (curlObj["request"]["url"] !== undefined) {
      restForm.textEndpoint.value = curlObj["request"]["url"];
    }
  }
  if (curlObj["headers"] !== undefined) {              
    restForm.textHeaders.value = curlObj.headers.join(";");
  }
  if (curlObj["body"] !== undefined && curlObj["body"].trim() != "") {
    restForm.textData.value = curlObj.body;            
  }
}

// *** helper methods for curl command ***

const curlType = Object.freeze({
  HEADERS: 'headers',
  BODY: 'body',
  REQUEST: 'request',
})

const backslashRegex = /\\/gi;
const newLineRegex = /\\n/gi;

// return curl command in string
function curlCommandBuilder(curlObj) {
  var curl = "curl";
  if (curlObj["request"] === undefined) {
    return "";
  }
  else {
    if (curlObj["request"]["method"] !== undefined)
      curl += " -X " + curlObj["request"]["method"] + " '" + curlObj["request"]["url"] + "'";
    else
      curl += " -X " + "GET" + " '" + curlObj["request"]["url"] + "'";
  }
  if (curlObj["headers"] !== undefined) {
    var headers = curlObj["headers"];
    for(var index in headers) {
      curl += " -H '" + headers[index] + "'";
    }
  }
  if (curlObj["body"] !== undefined && curlObj["body"].trim() != "") {
      curl += " -d '" + curlObj["body"] + "'";
  }
  
  return curl;
}

// parse curl command by type: ["headers", "body", "request"]
function curlCommandParser(command, parse){

  command = command.replace(backslashRegex, '');

  let object = {};
  let _command = command;
  let rx1, rx2, rx3;
  let _splitXXX;
  switch (parse) {
    case curlType.HEADERS:
      var headers = [];
      rx1 = /-X/gi;
      rx2 = /-d/gi;
      rx3 = /-P/gi;
      _command = _command.replace(rx1, 'XXX')
      _command = _command.replace(rx2, 'XXX')
      _command = _command.replace(rx3, 'XXX')
      // split by XXX
      _splitXXX = _command.split("XXX");
      _splitXXX.map(each => {
        _each = each.replace(newLineRegex, '');
        if (_each.includes('-H')) {
          let headersArr = _each.split('-H').slice(1,);
          headersArr.map(header => {
            headers.push(util_trim(header));
          })
        };
      });
      return headers;
    case curlType.BODY:
      var body = "";
      rx1 = /-X/gi;
      rx2 = /-H/gi;
      rx3 = /-P/gi;
      _command = _command.replace(rx1, 'XXX')
      _command = _command.replace(rx2, 'XXX')
      _command = _command.replace(rx3, 'XXX')
      // split by XXX
      _splitXXX = _command.split("XXX");
      _splitXXX.map(each => {
        _each = each.replace(newLineRegex, '');
        if (_each.includes('-d')) {
          let bodyArr = _each.split('-d').slice(1,);
          bodyArr.map(data => {
            body = util_trim(data);
          })
        };
      });
      return body;
    case curlType.REQUEST:
      rx1 = /-d/gi;
      rx2 = /-H/gi;
      rx3 = /-P/gi;
      _command = _command.replace(rx1, 'XXX')
      _command = _command.replace(rx2, 'XXX')
      _command = _command.replace(rx3, 'XXX')
      // split by XXX
      _splitXXX = _command.split("XXX");
      _splitXXX.map(each => {
        _each = each.replace(newLineRegex, '');
        if (_each.includes('-X')) {
          let urlArr = _each.split('-X').slice(1,);
          urlArr.map(url => {
            _url = url.trim().split(" ");
            object['method'] = _url[0];
            object['url'] = util_trim(_url[1]);
          })
        };
      });
      return object;
    default: 
      return object;
  }
}

// build curlObject from command
function commandToCurlObject(command) {
  var parts = command.split(" ");
  var cmd = parts[0];
  command.replace(cmd,"");
  var curlObj = {};
  curlObj["request"] =  curlCommandParser(command, curlType.REQUEST);
  curlObj["headers"] =  curlCommandParser(command, curlType.HEADERS);
  curlObj["body"] =  curlCommandParser(command, curlType.BODY);
  return curlObj;
}

// build curlObject from UI inputs
function uiToCurlObject() {

  var url = restForm.textEndpoint.value;
  var httpMethod = restForm.httpMethodSelect.value;
  var headers = [];
  var headerInput = restForm.textHeaders.value;
  if (!!headerInput) {
    headers = headerInput.split(";");
  }
  var dataInput = restForm.textData.value;
  var curlObj = {};
  curlObj["request"] =  {};
  curlObj["request"]["url"] = url;
  curlObj["request"]["method"] = httpMethod;
  curlObj["headers"] =  headers;
  curlObj["body"] = dataInput;
  return curlObj;            
}

// build global collection object from text
// text format:
//
// collection: DataAPI
// name: collection A
// 
// collection 1
// curl -X GET 'http://staging.test12345.com/api/1' -H 'Content-Type: application/json' -d '{"a":1}'
//
// collection 2
// curl -X GET 'http://staging.test12345.com/api/2' -H 'Content-Type: application/json' -d '{"a":1}'
// 
// name: collection B
//
// collection 3
// curl -X GET 'http://staging.test12345.com/api/1' -H 'Content-Type: application/json' -d '{"a":1}'
//
// 
// collectionObj = {}
// collectionObj[commandGroup]= ["collection A", "collection B"]
// collectionObj["collection A""] = [ {"name": "collection 1", "curl": "... cmd ..."},  {"name": "collection 2", "curl": "... cmd ..."}]
// collectionObj["collection B""] = [ {"name": "collection 3", "curl": "... cmd ..."} ]
function processCollections(text) {
  var collectionObj = {};
  const splitLines = str => str.split(/\r?\n/);
  var lines = splitLines(text);
  collectionObj["commandGroup"] = [];
  var commands = [];
  let i = 0;
  while (i < lines.length) {
    var line = lines[i].trim();
    if (line.startsWith("collection:")) {
      collectionObj["name"] = line.replace("collection:","").trim();
      i++;
    } else if (line.startsWith("name:")) {                  
      groupName = line.replace("name:","").trim();
      collectionObj["commandGroup"].push(groupName);  
      commands = [];
      collectionObj[groupName] = commands;
      i++;
    } else if (line.length > 1) {
      let commandObj = {};
      commandObj.name = line;
      i++;
      commandObj.curl = lines[i];
      i++;  
      commands.push(commandObj);
    } else {
      i++;
    }
  }
  return collectionObj;
}

// *** general utility ***
function sendHttpRequest(httpMethodSelectId, urlInputId, headerInputId, dataInputId, cookieName) {

  var xhr = new XMLHttpRequest();

  var url = document.getElementById(urlInputId).value;
  var httpMethod = document.getElementById(httpMethodSelectId).value;
  xhr.open(httpMethod, url, true);

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
    console.log("response text: " + this.responseText);
    globalJson = JSON.parse(this.responseText);
    buildJson(globalJson, document.getElementById("newRoot"));
  }
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function util_trim(str) {
  if (str !== undefined){
    str = str.trim();
    if (str.charAt(0) === "'" && str.charAt(str.length-1) === "'")
      return str.slice(1, -1);
    else if (str.charAt(0) === '"' && str.charAt(str.length-1) === '"')
      return str.slice(1, -1);
    else 
      return str;
  }
  return "";
}