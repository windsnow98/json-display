const classExpand = "expand";
const classNewline = "newline";
const classLineContainer = "lineContainer";
const classRootCollapse = "rootCollapse";
const classLineCollapse = "lineCollapse";

var globalJson = {};

var bracketExtender = {};

var fieldsToHide = new Set();

var fieldsToUpdate = new Map();

// create the structure 'V{ ... }'
function buildJson(json, container) {
    
    while(container.lastChild) {
        container.lastChild.remove();
    }

    // 1. create newline                    
    const newline = document.createElement("span");
    newline.classList.add(classNewline);
    // 2. create expand and add to newline
    const expand = document.createElement("span");
    expand.classList.add(classExpand);
    newline.appendChild(expand);
    // 3. create json object value { ... } and add it to newline            
    var spans = buildValueObj(json, [], 0);
    for(var i in spans){
        newline.appendChild(spans[i]);
    }
    // 4. add newline to container
    container.appendChild(newline);     

    // 5. attch collapse click listener
    const collection = document.getElementsByClassName(classExpand);
    for (let i = 0; i < collection.length; i++) {                    
        collection[i].addEventListener('click', collapse);
    }
}

// return a list of span to represent json object
function buildValueObj(json, path, idx) {
    var spans = [];
    
    // 1. build `{`
    const bracketStart = document.createElement("span");
    bracketStart.classList.add('b');
    bracketStart.innerHTML = '{';
    if ('{' in bracketExtender) {
        bracketExtender['{'](bracketStart, json, path, idx);
    }
    spans.push(bracketStart);

    // 2. build line container for top level json fields
    const spanBlock = document.createElement("span");
    spanBlock.classList.add(classLineContainer);
    spans.push(spanBlock);       
    
    // 3. build newlines
    var keys = Object.keys(json);
    for (var key in keys) {
        const spanEntry = document.createElement("span");
        spanEntry.classList.add(classNewline);
        spanBlock.appendChild(spanEntry);                

        var fieldName = keys[key];
        var fieldValue = json[keys[key]];

        if (fieldsToHide.has(fieldName)) {
            continue;                        
        }
        if (fieldsToUpdate.has(fieldName)) {
            fieldValue =  fieldsToUpdate.get(fieldName)(fieldName, fieldValue);
        }

        var subSpans = buildKeyValueSpans(fieldName, fieldValue, path, ++idx);
        for(var i in subSpans){
            spanEntry.appendChild(subSpans[i]);
        }
    }

    // 4. build '}'                
    const bracketEnd = document.createElement("span");
    bracketEnd.classList.add('b');
    bracketEnd.innerHTML = '}';
    spans.push(bracketEnd);

    return spans;
}

// build html structure for rendering out the json `key` and `value`
// key:
//   <span>"</span><span>key1</span><span>"</span><span>:&nbsp;</span>
// value:
//   <span>"</span><span class="s">@12345</span><span>"</span>
function buildKeyValueSpans(key, val, path, idx) {
    
    // An array to keep all key value spans
    var spans = [];

    // Build the keys 
    // If the value is object, it needs an extra span with class `classExpand` for the key
    if (typeof val === "object") {
                            
        const spanE = document.createElement("span");
        spanE.classList.add(classExpand);
        spans.push(spanE);
        
        var keySpans = buildKeySpan(key);
        for(var i in keySpans) {
            spans.push(keySpans[i]);
        }
        
    } else {
        var keySpans = buildKeySpan(key);
        for(var i in keySpans) {
            spans.push(keySpans[i]);
        }
    }

    // Build the values
    if (typeof val === "object") {
        path.push(key);
        var subSpans = buildValueObj(val, path, idx);
        for(var i in subSpans){
            spans.push(subSpans[i]);
        }                                        
    } else if (val === null) {
        const spanT1 = document.createElement("span");            
        spanT1.innerHTML = "null";
        spans.push(spanT1);                    
    } else if (typeof val == "boolean") {
        const spanT1 = document.createElement("span");            
        spanT1.innerHTML = val;
        spans.push(spanT1);                    
    } else if (typeof val === "number") {
        const spanT1 = document.createElement("span");            
        spanT1.innerHTML = val;
        spans.push(spanT1);
    } else if (typeof val === "string") {
        const spanT1 = document.createElement("span");            
        spanT1.innerHTML = '"';

        const spanT2 = document.createElement("span");            
        spanT2.innerHTML = val;
        spanT2.classList.add("s");

        const spanT3 = document.createElement("span");            
        spanT3.innerHTML = '"';

        spans.push(spanT1);
        spans.push(spanT2);
        spans.push(spanT3);
    } else if (Array.isArray(val)) {

        const spanT1 = document.createElement("span");            
        spanT1.innerHTML = '[';
        spans.push(spanT1);
        
        for(var i = 0; i < val.length; i++) {
            let arrayVal = val[i];
            const spanT = document.createElement("span");            
            if (i < val.length - 1) {
                spanT.innerHTML = arrayVal + ", &nbsp";
            } else {
                spanT.innerHTML = arrayVal;
            }
            spanT.classList.add("s");
            spans.push(spanT);
        }

        const spanT3 = document.createElement("span");            
        spanT3.innerHTML = ']';
        spans.push(spanT3);
    } 
    
    return spans;
}

function buildKeySpan(key) {
    var spans = [];
    const spanT1 = document.createElement("span");            
    spanT1.innerHTML = '"';

    const spanT2 = document.createElement("span");            
    spanT2.innerHTML = key;

    const spanT3 = document.createElement("span");            
    spanT3.innerHTML = '"';

    const spanT4 = document.createElement("span");            
    spanT4.innerHTML = ':&nbsp;';
    
    spans.push(spanT1);
    spans.push(spanT2);
    spans.push(spanT3);
    spans.push(spanT4);
    return spans;
}

function collapse(evt) {
    evt.target.classList.toggle(classLineCollapse);            
    evt.target.parentElement.classList.toggle(classRootCollapse);
}