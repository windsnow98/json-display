console.log("template page loaded")
coreLog();
postFormLog();
initForm();

var defaultOpen = document.getElementById("defaultOpen");
if (defaultOpen) {
  console.log("default open clicked");
  document.getElementById("defaultOpen").click();
}

function toggleCollection(){
  document.getElementById("containerCommandGroup").classList.toggle("container-ext-active");
}

function toggleHistory(){
  document.getElementById("containerHistory").classList.toggle("container-ext-active");
}

function toggleAction(){
  document.getElementById("containerAction").classList.toggle("container-ext-active");
}

const buttons = document.querySelectorAll('.tool-button');
buttons.forEach(button => {
  button.addEventListener('click', () => {

    button.classList.toggle('tool-button-active');
    });
});

function toggle(id, className, id2, className2, id3, className3) {
  document.getElementById(id).classList.toggle(className);
  if (id2 && className2) {
    document.getElementById(id2).classList.toggle(className2);
  }
  if (id3 && className3) {
    document.getElementById(id3).classList.toggle(className3);
  }
}

function loadCollection() {
  let collectionUrl = document.getElementById("collectionInput").value;
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
          var collectionObj = processCollections(xhr.responseText);
          init_commandGroup(collectionObj);
      }
  }
  xhr.open('GET', collectionUrl, true);
  xhr.send(null);
}

shouldLoadCollection = false;

if (shouldLoadCollection) {
  loadCollection();
  //let collectionUrl = "https://raw.githubusercontent.com/windsnow98/json-display/main/examples/httpPost/collection1.txt";
}

try {
  var json = document.getElementById("divJson").innerHTML;
  globalJson = JSON.parse(json);
  buildJson(globalJson, document.getElementById("newRoot"));
} catch (e) {
  console.log("invalid json: " + json);
}