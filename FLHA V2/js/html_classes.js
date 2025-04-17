class Collapsible {
    #wrapper;
    #header;
    #header_con;
    #body;
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

        this.header_btns = document.createElement('div');
        this.#header.appendChild(this.header_btns);
        this.header_btns.style.display = 'flex';
        this.header_btns.style.flexDirection = 'column';

        // this._createButtons();

        this.#ancestors = [];
        this.getAncestors;
    }

    _expandAndCollapse(){
        this.btn_expand.classList.toggle('collapsible-active');
        if (this.#body.style.maxHeight) {
            this._collapse();
        } else {
            this._expand();
        }
    }

    _expand(){
        this.#header.style.borderBottomRightRadius = '0';
        this.#header.style.borderBottomLeftRadius = '0';
        this.#body.style.maxHeight = this.#body.scrollHeight + 'px';
        if(this.#ancestors.length >= 1) {
            this.#ancestors.forEach(ancestor => {
                ancestor.style.maxHeight = `${ancestor.scrollHeight + this.#body.scrollHeight}px`;
            });
        }
    }

    _collapse(){
        this.#header.style.borderRadius = '10px';
        this.#body.style.maxHeight = null;
        if(this.#ancestors.length >= 1) {
            this.#ancestors.forEach(ancestor => {
                ancestor.style.maxHeight = `${ancestor.scrollHeight - this.#body.scrollHeight}px`
            });
        }
    }

    // _createButtons(){
    //     this.btn_expand = document.createElement('button');
    //     this.btn_expand.classList.add('collapsible-expand');
    //     this.header_btns.appendChild(this.btn_expand);
    //     this.btn_expand.onclick = () => this._expandAndCollapse();
    // }

    getAncestors(){
        if (this.#ancestors.length < 1){
            let element = this.#wrapper.parentElement;
            while(element) {
                if (element.classList && element.classList.contains('collapsible-content')){
                    this.#ancestors.push(element);
                }
                element = element.parentElement;
            }
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

class AbstractInput {
    static instances = [];
    /** 
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

        AbstractInput.instances.push(this);
    }
    // CONSTRUCTOR HELPERS
    _createInput(identifier, required){
        this.input = this._elementType();
        this.input.id = identifier;
        this.input.required = required;
    }
    _editListener(){
        this.input.addEventListener('input', () => {
            this.input.classList.remove('error');
        })
    }
    _createLabel(label_str) {
        const label = document.createElement('label');
        label.textContent = label_str;
        label.htmlFor = this.input.id;
        return label;
    }
    _elementType(){
        return document.createElement('input');
    }

    // STATIC METHODS
    static getInstances() {
        const instances = AbstractInput.getSuperInstances();
        const filtered = instances.filter(instance => {
            return instance.constructor.name === this.name;
        })
        return filtered;
    }
    static getSuperInstances() {
        return AbstractInput.instances;
    }
    // GETTERS
    getLabelHTML(){
        return this.label;
    }
    getLabelValue(){
        return this.label.textContent;
    }
    getInputHTML(){
        return this.input;
    }
    getInputValue(){
        if(this.input.required && !this.input.value){
            this.input.classList.add('error');
            throw new Error('required input not provided');
        }
        return this.input.value;
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