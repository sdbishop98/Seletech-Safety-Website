function getAncestorsWithClass(element, className) {
    const ancestors = [];
    while (element) {
        if (element.classList && element.classList.contains(className)){
            ancestors.push(element);
        }
        element = element.parentElement;
    }
    return ancestors;
}

function getAncestorWithClass(element, className){
    while (element) {
        if (element.classList && element.classList.contains(className)){
            return element;
        }
        element = element.parentElement;
    }
    return null;
}