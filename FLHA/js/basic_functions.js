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

function detectDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    if(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
        return 'mobile';
    } else {
        return 'desktop';
    }
}

function isMobileDevice(){
    return detectDeviceType() === 'mobile';
}
// HTML CREATION //
function make_textInput_tableHtml(row, identifier, label_str){ // done
    // Helper function
    // creates html table cell elements for a text input with corresponding label
    // INPUT:   row - tr element - row to place the cell in
    //          identifier - string - unique identifier
    //          label_str - string - text for the label element
    // RETURN:  none
    const cell_label = row.insertCell();
    cell_label.classList.add('label');
    const cell_input = row.insertCell();
    cell_input.classList.add('input');

    const content = makeTextInputLabelPair(identifier, label_str);
    cell_label.appendChild(content.label);
    cell_input.appendChild(content.input);
}

function makeTextInputLabelPair(identifier, label_str){
    // Helper function for make_textInput_tableHtml
    // creates text input element with corresponing label
    // does not place these elements on the graph
    // INPUT:   identifier - string - unique identifier
    //          label_str - string - text for the label element
    // RETURN:  tuple - input/label pair
    const input = document.createElement('input');
    input.type = 'text';
    input.id = `input-text-${identifier}`;
    input.classList.add('text');

    const label = document.createElement('label');
    label.textContent = `${label_str}:`;
    label.htmlFor = input.id;

    return {input: input, label: label};
}

function make_numericInput_tableHtml(row, identifier, label_str, unit = null) { // done
    // Helper function
    // creates html table cell elements for a text input with corresponding label
    // INPUT:   row - tr element - row to place the cell in
    //          identifier - string - unique identifier
    //          label_str - string - text for the label element
    //          unit - string - optional, will place a unit at the end of the number input
    // RETURN:  none
    // TBD:     requires validation
    const cell_label = row.insertCell();
    cell_label.classList.add('label');
    const cell_input = row.insertCell();
    cell_input.classList.add('input');

    const content = makeNumericInputLabelPair(identifier, label_str, unit);
    cell_label.appendChild(content.label);
    cell_input.appendChild(content.input);
}
function makeNumericInputLabelPair(identifier, label_str, unit_str=null) {
    // Helper function for make_numberInput_tableHtml
    // creates number input element with corresponing label
    // does not place these elements on the graph
    // INPUT:   identifier - string - unique identifier
    //          label_str - string - text for the label element
    //          unit - string - optional, will place a unit at the end of the number input
    // RETURN:  tuple - input/label pair
    const input = document.createElement('input');
    input.type = 'text';
    input.id = `input-number-${identifier}`;
    input.inputMode = 'numeric';
    input.pattern = '[0-9]*'
    input.classList.add('text', 'numeric');

    input.addEventListener('input', e => {
        if(isNaN(input.value)){
            input.classList.add('error');
        } else if (input.classList.contains('error')){
            input.classList.remove('error');
        }
    });

    const label = document.createElement('label');
    label.textContent = `${label_str}:`;
    label.htmlFor = input.id;

    if(unit_str){
        const unit = document.createElement('label');
        unit.classList.add('unit');
        unit.appendChild(input);
        const unit_text = document.createElement('span');
        unit_text.innerHTML = unit_str;
        unit.appendChild(unit_text);
        return {input: unit, label: label};
    } 
    return {input: input, label: label}
}
function validateNumericInputs() { // wip
    const inputs = document.querySelectorAll('input.numeric');
}

function make_dropdown_tableHtml(row, identifier, label_str, options){
    // Helper function
    // creates html table cell elements for a dropdown selector with corresponding label
    // INPUT:   row - tr element - row to place the cell in
    //          identifier - string - unique identifier
    //          label_str - string - text for the label element
    //          options - list - the different options available for selection
    // RETURN:  none
    const cell_label = row.insertCell();
    cell_label.classList.add('label');
    const cell_input = row.insertCell();
    cell_input.classList.add('input');

    const content = makeDropdownLabelPair(identifier, label_str, options);
    cell_label.appendChild(content.label);
    cell_input.appendChild(content.input);
}
function makeDropdownLabelPair(identifier, label_str, options){ 
    // Helper function for make_dropdown_tableHtml
    // creates dropdown selector element with corresponing label
    // does not place these elements on the graph
    // INPUT:   identifier - string - unique identifier
    //          label_str - string - text for the label element
    //          options - list - the different options available for selection
    // RETURN:  tuple -  input/label pair
    const dropdown = document.createElement('select');
    dropdown.id = `input-dropdown-${identifier}`;

    const undecided = document.createElement('option');
    undecided.value = '';
    undecided.selected = true;
    undecided.disabled = true;
    undecided.hidden = true;
    undecided.textContent = 'Please select an option';
    undecided.classList.add('placeholder');
    dropdown.appendChild(undecided);
    options.forEach(option_str => {
        const option = document.createElement('option');
        option.textContent = option_str;
        option.value = option_str;
        dropdown.appendChild(option);
    });

    const label = document.createElement('label');
    label.textContent = `${label_str}:`;
    label.htmlFor = dropdown.id;

    return {input: dropdown, label: label};
}

function makeRadioInputLabelPairs(name, identifiers, labels){
    // Helper function
    // creates radio input elements with corresponing label
    // all created elements will share the same name
    // DOES NOT place these elements on the graph
    // INPUT:   name - string - unique name for the radio elements
    //          identifiers - list - strings - unique identifiers
    //          labels - list - strings - text for the label element
    //      identifiers and labels must be the same length
    // RETURN:  list - tuples - location input/label pair
    //              will have the same length and order of identifiers
    if((typeof identifiers !== 'object') || (typeof identifiers !== typeof labels) || (identifiers.length !== labels.length)){
        throw new Error('invalid input');
    }
    let radios = []
    identifiers.forEach((identifier_str, index) => {
        const input = document.createElement('input');
        input.type = 'radio';
        input.value = labels[index];
        input.id = `input-radio-${identifier_str}`;
        input.classList.add('radio');
        input.name = name;

        const label = document.createElement('label');
        label.textContent = labels[index];
        label.htmlFor = input.id;

        radios.push({input: input, label: label});
    })
    return radios;
}

function getRadioInput(name){
    // gets value of selected radio input with matching name
    // INPUT:   name - string - unique name for the radio elements
    // RETURN:  string - value of selected radio element
    const radios = document.getElementsByName(name);
    let selectedValue;
    for (const radio of radios) {
        if (radio.checked) {
            selectedValue = radio.value;
            break;
        }
    }

    return selectedValue;
}

function makeTextareaInputLabelPair(identifier, label_str){
    // creates textarea input element with corresponing label
    // does not place these elements on the graph
    // INPUT:   identifier - string - unique identifier
    //          label_str - string - text for the label element
    // RETURN:  tuple -  input/label pair
    const textarea = document.createElement('textarea');
    textarea.id = `input-textarea-${identifier}`;

    const label = document.createElement('label');
    label.textContent = label_str;
    label.htmlFor = textarea.id;

    return {input: textarea, label: label};

}