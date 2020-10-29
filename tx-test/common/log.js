var highlights = {
 'good': 'hlt-good',
 'bad': 'hlt-bad',
 'default': 'hlt-default'
}
function applyHighlights(text,sentiment) {
    return `<span class="${highlights[sentiment] || 'hlt-default'}">${text}</span>`;
}
function selfLog(stringValue, sentiment='default'){
    if(!logContainer){
        logContainer = document.getElementById("log-container");
    }
    let highlightedText = logContainer.innerHTML + applyHighlights(stringValue,sentiment) + "\n\n";
    logContainer.innerHTML = highlightedText;
    logContainer.scrollTop = logContainer.scrollHeight;
}