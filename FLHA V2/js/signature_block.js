class Signature_Block{
    static instances = [];
    constructor(id, required = false){
        this.id = `signBlock-${id}`;
        this.required = required;
        this.segments = [];

        this.wrapper = document.createElement('div');
        this.wrapper.id = `wrapper-${this.id}`;

        this.table = document.createElement('table');
        this.wrapper.appendChild(this.table);
        this.table.classList.add('signature');
        this.head = document.createElement('thead');
        this.body = document.createElement('tbody');
        this.table.appendChild(this.head);
        this.table.appendChild(this.body);

        Signature_Block.instances.push(this);
    }

    // STATIC METHODS
    static getInstances() {
        return this.instances;
    }

    // GETTERS
    getHTML(){
        return this.wrapper;
    }
    getSegments() {
        return this.segments;
    }
    getJSON_segments(){ // TODO

    }

    // SETTERS
    setTitle(title){
        const cell = this.head.insertRow().insertCell();
        cell.textContent = title;
    }
    addSegment(){
        const id = `${this.id}-${this.segments.length}`;
        const name = new TextInput(id, 'Name:', this.required);

        let tbody = document.createElement('tbody');
        
        let row = tbody.insertRow();
        let cell = row.insertCell();

        cell.appendChild(name.getLabelHTML());
        cell.classList.add('accent');
        cell.style.borderTopLeftRadius = '10px'
        cell.style.padding = '0.1rem';

        // get the height
        document.body.appendChild(tbody);
        const height = cell.offsetHeight * 2;
        document.body.removeChild(tbody);

        const modal = new Modal_SignaturePad(id, height);

        cell = row.insertCell();
        modal.getHTML().style.height = height + 'px';
        cell.appendChild(modal.getHTML());
        cell.classList.add('secondary');
        cell.style.borderRadius = '0 10px 10px 0';
        cell.rowSpan = 2;

        row = tbody.insertRow();
        cell = row.insertCell();
        cell.appendChild(name.getInputHTML());
        cell.classList.add('accent');
        cell.style.borderBottomLeftRadius = '10px';
        name.getInputHTML().style.borderRadius = '0 0 0 5px';

        this.body.appendChild(tbody);
        this.segments.push({signature: modal.getSignaturePad(), name: name});
    }
    removeSegment(){
        if(this.segments.length <= 1) {
            console.log('Error: Must have at least one reviewer');
            return;
        }
        
        const row = this.body.lastElementChild;
        row.remove();
        this.segments.pop();
    }
    addButtons(text = null){
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        this.table.appendChild(wrapper);

        if(text){
            text = ` ${text}`;
        } else {
            text = '';
        }

        const btn_add = document.createElement('button');
        btn_add.classList.add('fill');
        btn_add.textContent = `ADD${text}`;
        btn_add.onclick = () => this.addSegment();
        wrapper.appendChild(btn_add);

        const btn_remove = document.createElement('button');
        btn_remove.classList.add('fill');
        btn_remove.classList.add('fill');
        btn_remove.textContent = `REMOVE${text}`;
        btn_remove.onclick = () => this.removeSegment();
        wrapper.appendChild(btn_remove);
    }
}

function signatures_HTML() {
    const wrapper = document.createElement('div');

    const assessor = new Signature_Block('assessor', true);
    assessor.setTitle('Assessed By:');
    assessor.addSegment();
    wrapper.appendChild(assessor.getHTML());

    const reviewer = new Signature_Block('reviewer');
    reviewer.setTitle('Supervisor / Lead Tech:');
    reviewer.addSegment();
    wrapper.appendChild(reviewer.getHTML());

    const crew = new Signature_Block('crew');
    crew.setTitle('Crew Sign-On');
    crew.addSegment();
    crew.addButtons('CREW');
    wrapper.appendChild(crew.getHTML());

    return wrapper
}

document.currentScript.parentElement.appendChild(signatures_HTML());