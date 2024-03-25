console.log("hello bg.js 2.2");

try {
    importScripts("lib/message.js", "lib/storage.js");
} catch (e) {
    console.log(e);
}

var htmlText;
async function getTemplates(){    
    var url = chrome.runtime.getURL('/templates.html');    
    var fetchResponse = await fetch(url);
    htmlText = await fetchResponse.text();
}

getTemplates();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      if (request.greeting === "hello") {
        sendResponse({html: htmlText});
      }
    }
);