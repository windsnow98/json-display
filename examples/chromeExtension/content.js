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

/*
const coreCssUrl = chrome.runtime.getURL("lib/json-core-1.0.0.css");
const scriptCoreCss = document.createElement("link");
scriptCoreCss.setAttribute("href", coreCssUrl);
scriptCoreCss.setAttribute("rel", "stylesheet");
scriptCoreCss.setAttribute("type", "text/css");
document.head.appendChild(scriptCoreCss);

const formCssUrl = chrome.runtime.getURL("lib/json-post-form-1.0.0.css");
const scriptFormCss = document.createElement("link");
scriptFormCss.setAttribute("href", formCssUrl);
scriptFormCss.setAttribute("rel", "stylesheet");
scriptFormCss.setAttribute("type", "text/css");
document.head.appendChild(scriptFormCss);
*/

async function init() {
    console.log("content script sending");
    const response = await chrome.runtime.sendMessage({greeting: "hello"});
    // do something with response here, not outside the function    
    console.log(response.html);
    document.body.innerHTML = response.html;
}

init();

function start() {
    const pageUrl = chrome.runtime.getURL("lib/page.js");
    const scriptPageJs = document.createElement("script");
    scriptPageJs.setAttribute("src", pageUrl);
    document.head.appendChild(scriptPageJs);
}

setTimeout(() => {
    console.log("delay 2 second to start")
    start();    
}, 500);


