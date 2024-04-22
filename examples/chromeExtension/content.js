console.log("hello content.js v.05")

const coreJsUrl = chrome.runtime.getURL("lib/json-core-1.0.0.js");
const scriptCoreJs = document.createElement("script");
scriptCoreJs.setAttribute("src", coreJsUrl);
document.head.appendChild(scriptCoreJs);

const formJsUrl = chrome.runtime.getURL("lib/json-post-form-1.0.0.js");
const scriptFormJs = document.createElement("script");
scriptFormJs.setAttribute("src", formJsUrl);
document.head.appendChild(scriptFormJs);

var port = chrome.runtime.connect({name: "content-to-bg"});
port.postMessage({task: "load-template"});

async function start() {    
    const pageUrl = chrome.runtime.getURL("lib/page.js");
    const scriptPageJs = document.createElement("script");
    scriptPageJs.setAttribute("src", pageUrl);
    document.head.appendChild(scriptPageJs);
}

// setTimeout(() => {
//     console.log("delay 2 second to start")
//     start();    
// }, 500);

port.onMessage.addListener(function(msg) {
    if (msg.task === "load-template") {    
        var json = document.getElementsByTagName("pre")[0].innerHTML;        
        document.body.innerHTML = msg.result + "<div id='divJson' style='display:none'>" + json + "</div>";
        start();
    } else if (msg.task === "http-get") {
        console.log(msg.result);
        var collectionObj = processCollections(msg.result);
        init_commandGroup(collectionObj);
    }
});

