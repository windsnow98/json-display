console.log("hello bg.js 2.2");

//try {
//    importScripts("lib/storage.js");
//} catch (e) {
//    console.log(e);
//}

async function getTemplates(){    
    var url = chrome.runtime.getURL('/templates.html');    
    var fetchResponse = await fetch(url);
    return await fetchResponse.text();
}

chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === "content-to-bg") {
    port.onMessage.addListener(async function(msg) {
      if (msg.task === "load-template") {
        var getHtml = await getTemplates();
        port.postMessage({result: getHtml, task: "load-template"});
      } 
    });
  }
});