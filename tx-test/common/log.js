var highlights = {
 'good': 'hlt-good',
 'bad': 'hlt-bad',
 'warning': 'hlt-warn',
 'extra': 'hlt-extra',
 'default': 'hlt-default',
 'debug': 'hlt-extra'
}
function applyHighlights(text,sentiment) {
    return `<span class="${highlights[sentiment] || 'hlt-default'}">${text}</span>`;
}
function selfLog(value, sentiment='default'){
    // Only log debug statements if we have set the global hideDebugMsgs to false or is undefined
    if(hideDebugMsgs && sentiment == 'debug'){
        return;
    }
    let stringValue;
    if(value.toString() !== '[object Object]') {
        stringValue = value; 
    }
    else {
        if('message' in value) {
            stringValue = value.message;
        }
        else {
            // Try to use toJsonReplace if available
            try {
                stringValue = JSON.stringify(value,toJsonReplace,1);
            }
            catch {
                stringValue = JSON.stringify(value);
            }
        }
    }
    if(!logContainer){
        logContainer = document.getElementById("log-container");
    }
    let highlightedText = logContainer.innerHTML + applyHighlights(stringValue,sentiment) + "\n\n";
    logContainer.innerHTML = highlightedText;
    logContainer.scrollTop = logContainer.scrollHeight;
}