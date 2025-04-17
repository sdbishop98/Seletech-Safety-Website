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

class Modal {
    static instances = [];
    #wrapper;
    #buttons = [];
    #modal;

    /**
     * 
     * @param {string} [id = null] 
     * @param {HTMLElement} [content = null] 
     * @param {HTMLButtonElement[]} [extra_buttons = null] 
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
        wrapper_buttons.style.flexDirection = 'column';

        wrapper_buttons.appendChild(this.#buttons.close);
        if (extra_buttons) {
            extra_buttons.forEach(button => {
                button.classList.add('fill');
                wrapper_buttons.appendChild(button);
            })
        }
        m_content.appendChild(wrapper_buttons);

        Modal.instances.push(this);
    }

    // STATIC METHODS
    static getInstances() {
        return Modal.instances;
    }
    static removeLast(){
        Modal.instances.pop();
    }

    // CONSTRUCTOR HELPERS
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

    // BUTTON METHODS
    openClick() {
        this.#modal.style.display = 'block';
    }
    closeClick() {
        this.#modal.style.display = 'none';
    }

    // GETTERS
    getHTML() {
        return this.#wrapper;
    }
    getModal(){
        return this.#modal;
    }

    // SETTERS
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
}

class SignaturePad {
    static pads = [];
    #Module = window.SignaturePad;
    #canvas;
    #clear;
    #sp;
    #id;

    /**
     * @param {string} id unique identifier
     */
    constructor(id) {
        this.#id = id;

        this.#canvas = document.createElement('canvas');
        this.#canvas.id = `canvas-signature-${id}`;
        this.#canvas.classList.add('signaturePad');

        this.#sp = new this.#Module(this.#canvas);
        SignaturePad.pads[id] = this.#sp;

        this.#clear = document.createElement('button');
        this.#clear.textContent = "Clear";
        this.#clear.onclick = () => this.#sp.clear();

        // set width
        const min = 2;
        const max = 5;
        this.#sp.minWidth = min;
        this.#sp.maxWidth = max;
    }

    // STATIC METHODS
    static getPads() {
        return SignaturePad.pads;
    }

    // GETTERS
    getPad() {
        return this.#sp;
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

    // ADDITIONAL METHODS
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

class Modal_SignaturePad extends Modal {
    #sp;
    constructor(id = null, thumbnail_height = 50) {
        const sp = new SignaturePad(`canvas-signature-${id}`);
        super(`signature-${id}`, sp.getHTML(), [sp.getClearBtn()]);
        this.#sp = sp;
        this.thumbnail_height = thumbnail_height;
    }

    // BUTTON METHODS
    openClick(){
        super.openClick();
        this.#sp.resize();
    }
    closeClick(){
        super.closeClick();
        try {
            const img = this.#sp.getThumbnail(this.thumbnail_height, 'Sign Document');
            this.setOpenButtonText();
            this.addOpenButtonContent(img);
        } catch (error) {
            this.setOpenButtonText('Sign Document');
            console.log ('Failed ot update button prompt');
        }
    }

    // GETTERS
    getSignaturePad(){
        return this.#sp;
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