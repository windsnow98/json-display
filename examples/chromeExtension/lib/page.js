console.log("template page loaded")
coreLog();
postFormLog();
initForm();

document.addEventListener('DOMContentLoaded', function() {
  //const jsonStr = '{"key1":"value1", "key2":"value2", "ojb1":{ "key3":"value3", "obj2": { "key4": "value4"} }}';        
  //buildJson(JSON.parse(jsonStr), document.getElementById("newRoot"));

  /*
  document.getElementById("defaultOpen").click();

  const buttons = document.querySelectorAll('.tool-button');
  buttons.forEach(button => {
  button.addEventListener('click', () => {

    button.classList.toggle('tool-button-active');
    });
  });
  */

}, false);

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

