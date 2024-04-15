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

let collectionUrl = "https://raw.githubusercontent.com/windsnow98/json-display/main/examples/httpPost/collection1.txt";
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
        var collectionObj = processCollections(xhr.responseText);
        init_commandGroup(collectionObj);
    }
}
xhr.open('GET', collectionUrl, true);
xhr.send(null);
