console.log("hello content.js v.05")

/*
const jsonStr = '{"key1":"value1", "ojb1":{ "key2":"value2"}}';
document.body.innerHTML = '<div id="newRoot"></div>';
buildJson(JSON.parse(jsonStr), document.getElementById("newRoot"));
*/

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
        document.body.innerHTML = msg.result;
        start();
    } else if (msg.task === "http-get") {
        console.log(msg.result);
        var collectionObj = processCollections(msg.result);
        init_commandGroup(collectionObj);
    }
});

