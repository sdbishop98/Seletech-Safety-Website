function link_stylesheet(href){
    if(!has_stylesheet(href)){
        const ss = document.createElement('link');
        ss.rel = 'stylesheet';
        ss.type = 'text/css';
        ss.href = href // eg: 'css/signature_block.css';
        document.head.appendChild(ss)
    }
}

function has_stylesheet(href){
    const links = document.getElementsByTagName('link');
    for (let i=0; i<links.length; i++) {
        if(links[i].rel == 'stylesheet' && links[i].href.includes(href)) {
            return true;
        }
    }
    return false;
}