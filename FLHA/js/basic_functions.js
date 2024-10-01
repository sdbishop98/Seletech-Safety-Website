// CLASSES
class Modal {
    // static #modals = []
    static #instances = []
    #wrapper
    #buttons = {}
    #modal
    /**
     * 
     * @param {string} id 
     * @param {HTMLElement} content 
     * @param {HTMLButtonElement[]} extra_buttons 
     */
    constructor(id = null, content = null, extra_buttons = null) {
        this.#wrapper = document.createElement('div');
        this.#wrapper.classList.add('fill');

        this.#init_buttons();
        this.#wrapper.appendChild(this.#buttons.open);

        this.#buttons.open.onclick = () => this.openClick();
        this.#buttons.close.onclick = () => this.closeClick();

        this.#modal = document.createElement('div');
        if (id) this.#modal.id = `modal-${id}`;
        this.#modal.classList.add('modal');
        this.#wrapper.appendChild(this.#modal);

        const m_content = document.createElement('div');
        m_content.classList.add('modal-content');
        this.#modal.appendChild(m_content);
        if (content) m_content.appendChild(content);

        const wrapper_buttons = document.createElement('div');
        wrapper_buttons.style.display = 'flex';
        wrapper_buttons.style.width = '100%';
        if (isMobileDevice()) {
            wrapper_buttons.style.flexDirection = 'column';
        } else {
            wrapper_buttons.style.flexDirection = 'row';
        }
        wrapper_buttons.appendChild(this.#buttons.close);
        if (extra_buttons) {
            extra_buttons.forEach(button => {
                button.classList.add('fill');
                wrapper_buttons.appendChild(button);
            })
        }
        m_content.appendChild(wrapper_buttons);

        Modal.#instances.push(this);
    }

    static getInstances(){
        return Modal.#instances;
    }
    static removeLast(){
        Modal.#instances.pop()
    }

    #init_buttons(){
        const open = document.createElement('button');
        open.textContent = 'Sign Document';
        open.classList.add('signature');
        open.style.height = '100%';
        this.#buttons.open = open;

        const close = document.createElement('button');
        close.textContent = 'Close';
        close.classList.add('fill');
        this.#buttons.close = close;
    }
    getHTML() {
        return this.#wrapper;
    }
    getModal(){
        return this.#modal;
    }

    setOpenButtonText(text = null) {
        if (text) {
            this.#buttons.open.textContent = text;
        } else {
            this.#buttons.open.textContent = ''
        }
    }
    addOpenButtonContent(content) {
        this.#buttons.open.appendChild(content);
    }

    openClick() {
        this.#modal.style.display = 'block';
    }
    closeClick() {
        this.#modal.style.display = 'none';
    }
}
class Modal_SignaturePad extends Modal {
    #sp
    constructor(id = null, thumbnail_height = 50) {
        const sp = new SignaturePad(`canvas-signature-${id}`);
        super(`signature-${id}`, sp.getHTML(), [sp.getClearBtn()]);
        this.#sp = sp;
        this.thumbnail_height = thumbnail_height;
    }

    openClick() {
        super.openClick();
        this.#sp.resize()
    }
    closeClick() {
        super.closeClick();
        try {
            const img = this.#sp.getThumbnail(this.thumbnail_height, 'Sign Document');
            this.setOpenButtonText();
            this.addOpenButtonContent(img);
        } catch (error) {
            this.setOpenButtonText('Sign Document');
            console.log ('Failed to update button prompt');
        }
    }
    getSignaturePad(){
        return this.#sp;
    }
}

class SignaturePad {
    static #pads = {};
    #Module = window.SignaturePad;
    #canvas
    #clear
    #sp
    #id

    /**
     * @param {string} id unique identifier
     */
    constructor(id) {
        this.#id = id;

        this.#canvas = document.createElement('canvas');
        this.#canvas.id = `canvas-signature-${id}`;
        this.#canvas.classList.add('signaturePad');

        this.#sp = new this.#Module(this.#canvas);
        SignaturePad.#pads[id] = this.#sp;

        this.#clear = document.createElement('button');
        this.#clear.textContent = "Clear";
        this.#clear.onclick = () => this.#sp.clear();

    }

    static getPads() {
        return SignaturePad.#pads;
    }

    getPad() {
        return SignaturePad.#pads[this.#id];
    }

    getHTML() {
        return this.#canvas;
    }

    getClearBtn() {
        return this.#clear;
    }

    getSVG_URL(suppress = false) {
        if(this.#sp.isEmpty()) {
            if(!suppress) {
                throw new Error ('Signature does not exist')
            }
        } else {
            const dataURL = this.#sp.toDataURL('image/svg+xml');
            return dataURL;
        }
    }

    getPNG_URL(suppress = false) {
        if(this.#sp.isEmpty()) {
            if(!suppress) {
                throw new Error ('Signature does not exist');
            }
        } else {
            const dataURL = this.#sp.toDataURL('image/png');
            return dataURL;
        }
    }

    /**
     * 
     * @param {number} maxHeight maximum height in pixels
     * @param {string} altText 
     * @returns 
     */
    getThumbnail(maxHeight = null, altText = null) {
        try {
            const img = document.createElement('img');
            img.src = this.getSVG_URL();
            if (altText) {
                img.alt = altText;
            }
            if (maxHeight) {
                img.style.maxHeight = maxHeight + 'px';
            }
            return img;
        } catch (error) {
            console.log(error);
            return null;
        }  
    }

    resize(){
        const canvas = this.#canvas

        const ratio = Math.max(window.devicePixelRatio || 1, 1);

        const oldWidth = canvas.width;
        const oldHeight = canvas.height;

        const data = this.getPad().toData();

        // this part causes the canvas to be cleared
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext('2d').scale(ratio, ratio);

        // scale the signature
        const scale = {};
        scale.x = canvas.width / oldWidth;
        scale.y = canvas.height / oldHeight;
        scale.data = data.map(group => ({
            ...group,
            points:
            group.points.map(point => ({
                x: point.x * scale.x,
                y: point.y * scale.y,
                pressure: point.pressure,
                time: point.time
            })),
            maxWidth: group.maxWidth * Math.min(scale.x, scale.y),
            minWidth: group.minWidth * Math.min(scale.x, scale.y)
        }));

        this.getPad().fromData(scale.data);
    }
}

class Collapsible {
    #wrapper;
    #header;
    #header_con;
    #body;
    #btn_expand;
    #ancestors;
    constructor(){
        this.#wrapper = document.createElement('div');
        this.#wrapper.classList.add('collapsible-wrapper');
        this.#header = document.createElement('div');
        this.#header.classList.add('collapsible-header');
        this.#body = document.createElement('div');
        this.#body.classList.add('collapsible-content');
        this.#wrapper.appendChild(this.#header);
        this.#wrapper.appendChild(this.#body);

        this.#header_con = document.createElement('div');
        this.#header.appendChild(this.#header_con);

        this.#btn_expand = document.createElement('button');
        this.#btn_expand.classList.add('collapsible-expand');
        this.#header.appendChild(this.#btn_expand);
        this.#btn_expand.onclick = () => this.#expand();
    }

    #expand(){
        this.#btn_expand.classList.toggle('collapsible-active');
        this.getAncestors();
        if (this.#body.style.maxHeight) {
            this.#header.style.borderRadius = '10px';
            this.#body.style.maxHeight = null;
            if(this.#ancestors.length >= 1) {
                this.#ancestors.forEach(ancestor => {
                    ancestor.style.maxHeight = `${ancestor.scrollHeight - this.#body.scrollHeight}px`
                });
            }
            
        } else {
            this.#header.style.borderBottomRightRadius = '0';
            this.#header.style.borderBottomLeftRadius = '0';
            this.#body.style.maxHeight = this.#body.scrollHeight + 'px';
            if(this.#ancestors.length >= 1) {
                this.#ancestors.forEach(ancestor => {
                    ancestor.style.maxHeight = `${ancestor.scrollHeight + this.#body.scrollHeight}px`;
                });
            }
            
        }
    }

    getAncestors(){
        this.#ancestors = []
        let element = this.#wrapper.parentElement;
        while (element) {
            if (element.classList && element.classList.contains('collapsible-content')){
                this.#ancestors.push(element);
            }
            element = element.parentElement;
        }
        return this.#ancestors;
    }

    getHTML(){
        return this.#wrapper;
    }

    getHeaderHTML() {
        return this.#header_con;
    }

    getContentHTML() {
        return this.#body;
    }

    setHeader(html) {
        this.#header_con.appendChild(html);
    }

    setContent(html) {
        this.#body.appendChild(html);
    }
}

class Input_Collection{
    static #objects = [];
    static #instances = []
    constructor (obj) {
        this.obj = obj;
        Input_Collection.#objects.push(this.obj);
        Input_Collection.#instances.push(this);
    }
    static getObjects(){
        const instances = this.getInstances();
        const objects = instances.map(instance => instance.getObject());
        return objects;
    }
    static getInstances(){
        const instances = Input_Collection.#instances;
        const filtered = instances.filter(instance => {
            return instance.constructor.name === this.name;
        });
        return filtered;
    }
    getObject(){
        return this.obj;
    }
    getLabel(){
        return this.obj.getLabelValue();
    }
    getValue(){
        return this.obj.getInputValue();
    }
}
// INPUT CLASSES
class AbstractInput {
    static #instances = []
    /** 
     * 
     * @param {string} identifier - a unique identifier for the HTML input element
     * @param {string} [label_str = null] - textContent for optional label element
     * @param {boolean} [required = false]  affects the required property of input element
     */
    constructor(identifier, label_str = null, required = false, ...rest) {
        this._createInput(identifier, required, ...rest);

        this._editListener();

        if(label_str){
            this.label = this._createLabel(label_str);
        }

        AbstractInput.#instances.push(this);
    }
    // CONSTRUCTOR HELPERS
    _editListener(){
        this.input.addEventListener('input', () => {
            this.input.classList.remove('error');
        })
    }
    _elementType(){
        return document.createElement('input');
    }
    _createInput(identifier, required){
        this.input = this._elementType();
        this.input.id = identifier;
        this.input.required = required;
    }
    _createLabel(label_str) {
        const label = document.createElement('label');
        label.textContent = label_str;
        label.htmlFor = this.input.id;
        return label;
    }
    // STATIC METHODS
    static getInstances() {
        const instances = AbstractInput.getSuperInstances();
        const filtered = instances.filter(instance => {
            return instance.constructor.name === this.name;
        })
        return filtered;
    }
    static getSuperInstances(){
        return AbstractInput.#instances;
    }
    // GETTERS
    getLabelHTML(){
        return this.label;
    }
    getLabelValue(){
        return this.label.textContent;
    }
    getInputValue(){
        if(this.input.required && !this.input.value){
            this.input.classList.add('error');
            throw new Error('required input not provided');
        }
        return this.input.value;

    }
    getInputHTML() {
        return this.input;
    }
}
class TextInput extends AbstractInput {
    /** creates a text input element and optional corresponding label
     * 
     * @param {string} identifier - a unique identifier for the HTML input element
     * @param {string} [label_str = null] - textContent for optional label element
     * @param {boolean} [required = false] - affects the required property of input element
     */
    constructor(identifier, label_str = null, required = false){
        identifier = `input-text-${identifier}`;
        super(identifier, label_str, required);
        this.input.type = 'text';
    }
}
class NumericTextInput extends TextInput {
    constructor(identifier, label_str, required = false){
        identifier = `numeric-${identifier}`;
        super(identifier, label_str, required);
        this.input.inputMode = 'numeric';
        this.input.pattern = '[0-9]*';
        this.input.classList.add('numeric');
    }
    _editListener(){
        this.input.addEventListener('input', () => {
            if(isNaN(this.input.value)){
                this.input.classList.add('error');
            } else if (this.input.classList.contains('error')){
                this.input.classList.remove('error');
            }
        })
    }
    getInputHTML(unit_str = null){
        if(unit_str){
            const label = document.createElement('label');
            label.classList.add('unit');
            label.appendChild(this.input);
            const unit = document.createElement('span');
            unit.innerHTML = unit_str;
            label.appendChild(unit);
            return label;
        }
        return this.input;
    }
}
class DateInput extends TextInput {
    /**creates a date input element and optional corresponding label
     * 
     * @param {string} [identifier = null] - a unique identifier for the HTML input element
     * @param {string} [label_str = null] - textContent for optional label element
     * @param {boolean} [populate = true] - if true, autopopulates field with current date
     * @param {boolean} [required = false] - affects the required property of input element
     */
    constructor(identifier = null, label_str = null, populate = true, required = false){
        super('', label_str, required);
        if(identifier){
            this.input.id = `input-date-${identifier}`
        } else {
            this.input.id = 'input-date';
        }
        this.input.type = 'date';
        this.input.classList.add('dateTime');
        if(populate){
            this.#setCurrentDate()
        }
        if(label_str){
            this.label.htmlFor = this.input.id;
        }
    }
    #setCurrentDate(){
        const now = new Date();
        this.input.value = now.toISOString().split('T')[0];
    }
    
}
class TimeInput extends TextInput {
    /**creates a time input element and optional corresponding label
     * 
     * @param {string} [identifier = null] - a unique identifier for the HTML input element
     * @param {string} [label_str = null] - textContent for optional label element
     * @param {boolean} [populate = true] - if true, autopopulates field with current time
     * @param {boolean} [required = false] - affects the required property of input element
     */
    constructor(identifier = null, label_str = null, populate = true, required = false){
        super('', label_str, required);
        if(identifier){
            this.input.id = `input-time-${identifier}`
        } else {
            this.input.id = 'input-time';
        }
        this.input.type = 'time';
        this.input.classList.add('dateTime');
        if(populate){
            this.#setCurrentTime()
        }
        if(label_str){
            this.label.htmlFor = this.input.id;
        }
    }

    #setCurrentTime(){
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        this.input.value = `${hours}:${minutes}`;
    }

    getInputValue(){
        const value = this.input.value;
        let [hours, minutes] = value.split(':');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
    }
}
class SelectInput extends AbstractInput {
    /** creates a select element and optional corresponding label
     * 
     * @param {string} identifier - a unique identifier for the HTML input element
     * @param {string[]} options - the options available for selection
     * @param {boolean} [start_blank = true] - if true, inserts a blank default element
     * @param {string} [label_str = null] - textContent for optional label element
     * @param {boolean} [required = false] - affects the required property of input element
     */
    constructor (identifier, options, start_blank = true, label_str = null, required = false) {
        identifier = `input-select-${identifier}`;
        super(identifier, label_str, required);

        if (start_blank) {
            const undecided = document.createElement('option');
            undecided.value = '';
            undecided.selected = true;
            undecided.disabled = true;
            undecided.hidden = true;
            undecided.textContent = 'Please select an option';
            undecided.classList.add('placeholder');
            this.input.appendChild(undecided);
        }
        options.forEach(option_str => {
            const option = document.createElement('option');
            option.textContent = option_str;
            option.value = option_str;
            this.input.appendChild(option);
        })
    }
    _editListener() {
        this.input.addEventListener('change', () => {
            this.input.classList.remove('error');
        })
    }
    _elementType() {
        return document.createElement('select');
    }
}
class RadioInput extends AbstractInput {
    /**
     * 
     * @param {string} name 
     * @param {string[]} options 
     * @param {string} label_str 
     * @param {boolean} required 
     */
    #required
    constructor (name, options, label_str = null, required = false) {
        super(options, label_str, required, name)
        this.#required = required;
    }
    _createInput(options, required, name) {
        // const identifiers = options.map((option) => toCamelCase(option));
        this.input = [];
        this.radios = []
        options.forEach((option, index) => {
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.value = option;
            radio.id = `input-radio-${name}-${toCamelCase(option)}`;
            radio.name = name;
            radio.required = required;
            radio.addEventListener('input', () => {
                this.removeClass('error')
            });
            this.radios.push(radio);

            const label = document.createElement('label');
            label.textContent = option;
            label.htmlFor = radio.id;

            label.insertBefore(radio, label.firstChild)

            this.input.push(label);
        })
    }
    _editListener(){
        return;
    }
    _createLabel(label_str){
        const p = document.createElement('p');
        p.textContent = label_str;
        return p;
    }
    // GETTERS
    getInputValue(){
        let selectedValue = null;
        for(const radio of this.radios) {
            if(radio.checked){
                selectedValue = radio.value;
            }
        }
        if(this.#required && !selectedValue) {
            this.addClass('error');
            throw new Error('required input not provided');
        }
        return selectedValue;
    }
    // SETTERS
    removeClass(className){
        this.radios.forEach(radio => {
            radio.classList.remove(className)
        })
    }
    addClass(className){
        this.radios.forEach(radio => {
            radio.classList.add(className);
        })
    }
}
class TextAreaInput extends AbstractInput {
    /**
     * 
     * @param {string} identifier - a unique identifier for the HTML input element
     * @param {number} rows - how many rows (height) should the textarea have
     * @param {number} cols - how many cols (width) should the textarea have
     * @param {string} label_str - textContent for optional label element
     * @param {boolean} required - affects the required property of input element
     */
    constructor (identifier, rows, cols, label_str = null, required = false) {
        identifier = `input-textArea-${identifier}`;
        super(identifier, label_str, required);
        this.input.rows = rows;
        this.input.cols = cols;
    }
    _elementType(){
        return document.createElement('textarea');
    }
}

/** links a stylesheet to the html 
 * @param {string} href - a link in href format eg: 'css/signature_block.css'
 */
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

function toCamelCase(str){
    const words = str.trim().split(/\s+/);
    let camelCaseStr = words.shift().toLowerCase();
    words.forEach(word => {
        camelCaseStr += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    return camelCaseStr;
}   

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

function getAncestorWithTag(element, tagName) {
    while (element && element.tagName !== tagName.toUpperCase()) {
        element = element.parentElement;
    }
    return element;
}
// HTML CREATION //
function make_textInput_tableHtml(row, identifier, label_str, required = false){ // done
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

    const content = makeTextInputLabelPair(identifier, label_str, required);
    cell_label.appendChild(content.label);
    cell_input.appendChild(content.input);
}

/** creates the HTML for a Text Input Label Pair
 * 
 * DOES NOT insert html
 * @param {string} identifier - a unique identifer for the html
 * @param {string} label_str - text for the label
 * @returns {{input: HTMLInputElement, label: HTMLLabelElement}} an input label pair
 *      
 *      return.input - a text input html element
 *
 *      return.label - a label for the input element
 */
function makeTextInputLabelPair(identifier, label_str, required = false){
    const input = document.createElement('input');
    input.type = 'text';
    input.id = `input-text-${identifier}`;
    input.classList.add('text');
    input.required = required;
    input.addEventListener('input', () => {
        input.classList.remove('error');
    })

    const label = document.createElement('label');
    label.textContent = `${label_str}:`;
    label.htmlFor = input.id;

    return {input: input, label: label};
}

function getInputValue(id) {
    const element = document.getElementById(id);
    const value = element.value;
    if(element.required && !value){
        element.classList.add('error');
        throw new Error('required input not provided');
    }
    return value;
}

function make_numericInput_tableHtml(row, identifier, label_str, required = false, unit = null) { // done
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

    const content = makeNumericInputLabelPair(identifier, label_str, required, unit);
    cell_label.appendChild(content.label);
    cell_input.appendChild(content.input);
}
function makeNumericInputLabelPair(identifier, label_str, required = false, unit_str=null) {
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
    input.required = required;

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

function getNumericValue(id) {
    const element = document.getElementById(id);
    const value = element.value;
    if(isNaN(value)) {
        throw new Error('invalid input type');
    }
    if(element.required && !value){
        element.classList.add('error');
        throw new Error('required input not provided');
    }
    return value;
}

function make_dropdown_tableHtml(row, identifier, label_str, options, required = false){
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

    const content = makeDropdownLabelPair(identifier, label_str, options, required);
    cell_label.appendChild(content.label);
    cell_input.appendChild(content.input);
}
function makeDropdownLabelPair(identifier, label_str, options, required = false){ 
    // Helper function for make_dropdown_tableHtml
    // creates dropdown selector element with corresponing label
    // does not place these elements on the graph
    // INPUT:   identifier - string - unique identifier
    //          label_str - string - text for the label element
    //          options - list - the different options available for selection
    // RETURN:  tuple -  input/label pair
    const dropdown = document.createElement('select');
    dropdown.id = `input-dropdown-${identifier}`;
    dropdown.required = required;
    dropdown.addEventListener('change', () => {
        dropdown.classList.remove('error');
    })

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

/** creates the HTML for multiple radio inputs
 * 
 * DOES NOT insert html
 * @param {string} name - unique name that the radio inputs will share
 * @param {string[]} identifiers - unique identifiers for all the radios
 * @param {string[]} labels - labels for all the radios
 * @throws {Error} If identifiers and labels are a different length
 * @returns {{input: HTMLInputElement, label: HTMLLabelElement}[]} a list of radio input label pairs
 * 
 *      return[].input - a radio input html element
 *
 *      return[].label - a label for the input element
 */
function makeRadioInputLabelPairs(name, identifiers, labels, required = false){
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
        input.required = required;
        input.addEventListener('input', () => {
            removeRadioClass(name, 'error');
        })

        const label = document.createElement('label');
        label.textContent = labels[index];
        label.htmlFor = input.id;

        radios.push({input: input, label: label});
    })
    return radios;
}

/** gets the input of an specified radio input
 * @param {string} name - the name associated with the desired radio elements
 * @returns {string} - the value of the radio elements
 */
function getRadioInput(name){
    // gets value of selected radio input with matching name
    // INPUT:   name - string - unique name for the radio elements
    // RETURN:  string - value of selected radio element
    const radios = document.getElementsByName(name);
    let selectedValue = null;
    let required;
    for (const radio of radios) {
        if(radio.required){
            required = true;
        }
        if (radio.checked) {
            selectedValue = radio.value;
            break;
        }
    }

    if (required && !selectedValue){
        setRadioClass(name, 'error');
        throw new Error('required input not provided');
    }
    return selectedValue;
}

function setRadioClass(name, className){
    const radios = document.getElementsByName(name);
    radios.forEach(radio => {
        radio.parentElement.classList.add(className);
        radio.classList.add(className);
    })
}

function removeRadioClass(name, className){
    const radios = document.getElementsByName(name);
    radios.forEach(radio => {
        radio.parentElement.classList.add(className);
        radio.classList.remove(className);
    })
}

/** creates the HTML for a textarea
 * 
 * DOES NOT insert html
 * @param {string} identifier - a unique identifer for the html
 * @param {string} label_str - text for the label
 * @returns {{input: HTMLTextAreaElement, label: HTMLLabelElement}} an input label pair
 *      
 *      return.input - a textarea input html element
 *
 *      return.label - a label for the input element
 */
function makeTextareaInputLabelPair(identifier, label_str, required = false){
    const textarea = document.createElement('textarea');
    textarea.id = `input-textarea-${identifier}`;
    textarea.required = required;

    const label = document.createElement('label');
    label.textContent = label_str;
    label.htmlFor = textarea.id;

    return {input: textarea, label: label};
}

/** creates the HTML for a collapsible menu
 * 
 * DOES NOT insert html
 * @param {string} [id] - a unique identifier
 * @returns {object} the new collapsible object
 * @returns {HTMLDivElement} return.wrapper - wrapper containing the entire collapsible
 * @returns {HTMLDivElement} return.header - container that is visible when everything is collapsed - 
 * includes the button to open the collapsible
 * @returns {HTMLDivElement} return.content - container that is hidden by default
 */
function create_collapsible(id = null) {
    const collapsible = {};
    collapsible.wrapper = document.createElement('div');
    collapsible.wrapper.classList.add('collapsible-wrapper');
    if (id) {
        collapsible.wrapper.id = `collapsible-${id}`
    }

    const header = document.createElement('div');
    header.classList.add('collapsible-header');
    collapsible.wrapper.appendChild(header);

    collapsible.header = document.createElement('div');
    header.appendChild(collapsible.header);

    const btn_expand = document.createElement('button');
    btn_expand.classList.add('collapsible-expand');
    header.appendChild(btn_expand);

    btn_expand.addEventListener('click', function() {
        this.classList.toggle('collapsible-active');
        const content = this.parentElement.nextElementSibling;
        const header = this.parentElement;
        const ancestors = getAncestorsWithClass(this, 'collapsible-content');
        console.log(content.scrollHeight);
        if (content.style.maxHeight) {
            header.style.borderRadius = '10px';
            content.style.maxHeight = null;
            ancestors.forEach(ancestor => {
                ancestor.style.maxHeight = `${ancestor.scrollHeight - content.scrollHeight}px`;
            });
        } else {
            header.style.borderBottomRightRadius = '0';
            header.style.borderBottomLeftRadius = '0';
            content.style.maxHeight = content.scrollHeight + 'px';
            ancestors.forEach(ancestor => {
                ancestor.style.maxHeight = `${ancestor.scrollHeight + content.scrollHeight}px`;
            });
        }
    });

    collapsible.content = document.createElement('div');
    collapsible.content.classList.add('collapsible-content');
    collapsible.wrapper.appendChild(collapsible.content);

    return collapsible;
}