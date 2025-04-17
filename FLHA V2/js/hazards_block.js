class Abstract_HazSeg_Collapsible extends Collapsible{
    constructor(parent = null, ID_str = null, child_str){
        super();
        this._setFamily(parent);
        this._setIndex();
        this._setID(ID_str);

        this._initTree();

        this._setRequired();

        this._setContent(`${ID_str.toUpperCase()} ${this.index}`);

        this._createButtons(child_str)
        
    }
    // CONSTRUCTOR HELPERS
    _setFamily(parent){
        this.parent = parent;
        this.children = [];
    }
    _setIndex(){
        if(this.parent && this.parent.tree){
            this.index = this.parent.tree.getBranches().length;
        } else {
            this.index = Tree.getRoots().length;
        }
    }
    _setID(ID_str){
        this.id = `${ID_str}${this.index}`;
    }
    _initTree(){
        if(this.parent && this.parent.tree){
            this.tree = this.parent.tree.addBranch();
        } else {
            this.tree = new Tree();
        }
    }
    _setRequired(){
        this.required = false;
        if (this.index == 0){
            if (this.parent) {
                this.required = this.parent.required;
            } else {
                this.required = true;
            }
        }
    }
    _setContent(lbl_str){
        this.content = new TextInput(this.id, lbl_str, this.required);
        this.tree.setContent(this.content);
        this.content.getInputHTML().style.marginLeft = '10px';

        this.setHeader(this.content.getLabelHTML());
        this.setHeader(this.content.getInputHTML());

        this.getHeaderHTML().style.display = 'flex';
        this.getHeaderHTML().style.flexDirection = 'row';
    }
    _createButtons(child_str){
        this.header_btns.style.flexDirection = 'row'

        this.btn_add = document.createElement('button');
        this.header_btns.appendChild(this.btn_add);
        this.btn_add.onclick = () => this._expand();
        this.btn_add.textContent = `ADD ${child_str.toUpperCase()}`;
        this.btn_add.style.width = '100%';

        this.btn_remove = document.createElement('button');
        this.header_btns.appendChild(this.btn_remove);
        this.btn_remove.onclick = () => this._remove();
        this.btn_remove.textContent = `REMOVE ${child_str.toUpperCase()}`;
        this.btn_remove.hidden = true;
    }

    // BUTTON METHODS
    _expand(){
        super._expand();
        this._switchExpand();
    }
    _switchExpand(){
        this.btn_add.onclick = () => this._add();
        this.btn_add.style.width = '50%';
        this.btn_remove.hidden = false;
        this.btn_remove.style.width = '50%';
    }
    _add(){
        this.add();
    }
    _remove(){
        if (this.children.length > 1) {
            const target = this.children.pop();
            target.getHTML().remove();
            this.tree.removeLast();
        }
    }

    // GETTERS AND SETTERS
    getTree(){
        return this.tree;
    }
    // this one needs to be changed for all 
    add(){
        const collapsible = new Abstract_HazSeg_Collapsible(this, null, null);
        this.children.push(collapsible);
        this.setContent(collapsible.getHTML());

        super._expand();
    }

    // ADDITIONAL METHODS
    expand(){
        super._expand();
    }
}

class Task_Collapsible extends Abstract_HazSeg_Collapsible {
    static instances = [];
    constructor(){
        super(null, 'task', 'hazard');
        Task_Collapsible.instances.push(this);
    }
    // STATIC METHODS
    static getInstances() {
        return Task_Collapsible.instances;
    }
    static removeLast(){
        Tree.removeLast();
        const last = Task_Collapsible.instances.pop();
        last.getHTML().remove();
    }

    // GETTERS AND SETTERS
    add(){
        const collabsible = new Hazard_Collapsible(this);
        this.children.push(collabsible);
        this.setContent(collabsible.getHTML());

        super.expand();
    }
}

class Hazard_Collapsible extends Abstract_HazSeg_Collapsible {
    constructor(parent) {
        super(parent, 'hazard', 'control');
    }
    // BUTTON METHODS
    _switchExpand(){
        super._switchExpand();
        if(this.children.length < 1){
            this.add();
        }
    }
    _remove(){
        if (this.children.length > 1) {
            const target = this.children.pop();
            target.getHeaderHTML().remove();
            this.tree.removeLast();
        }
    }

    // GETTERS AND SETTERS
    add(){
        const content = new Control_Collapsible(this);
        this.children.push(content);
        this.setContent(content.getHeaderHTML());
        // console.log(this.getAncestors());
        this.getAncestors();
        super.expand();
    }
}

class Control_Collapsible extends Abstract_HazSeg_Collapsible {
    constructor(parent){
        super(parent, 'control', null);
    }
    _createButtons(){
        return;
    }
    _setContent(lbl_str){
        this.tree.setContent(
            {
                control: new TextInput(this.id, lbl_str, this.required),
                responsible: new TextInput(this.id, 'Person Responsible For Control', this.required)
            }
        )

        this.content = document.createElement('table');
        const body = document.createElement('tbody');
        this.content.appendChild(body);

        let row = body.insertRow();
        let cell = row.insertCell();
        cell.appendChild(this.tree.getContent().control.getLabelHTML());
        cell = row.insertCell();
        cell.appendChild(this.tree.getContent().control.getInputHTML());

        row = body.insertRow();
        cell = row.insertCell();
        cell.appendChild(this.tree.getContent().responsible.getLabelHTML());
        cell.style.paddingLeft = '30px';
        cell = row.insertCell();
        cell.appendChild(this.tree.getContent().responsible.getInputHTML());

        this.setHeader(this.content);
    }
}

function hazards_HTML(){
    const wrapper = document.createElement('div');
    

    

    const wrapper_buttons = document.createElement('div');
    wrapper_buttons.style.display = 'flex';
    wrapper_buttons.style.flexDirection = 'row';
    wrapper.appendChild(wrapper_buttons);

    wrapper.appendChild(create_task_HTML());

    const btn_add = document.createElement('button');
    btn_add.classList.add('fill');
    btn_add.textContent = 'ADD TASK';
    btn_add.style.width = '50%';
    wrapper_buttons.appendChild(btn_add);

    btn_add.addEventListener('click', function() {
        const task = create_task_HTML();
        // wrapper.insertBefore(task, this.parentElement);
        wrapper.appendChild(task);
    })

    const btn_remove = document.createElement('button');
    btn_remove.classList.add('fill');
    btn_remove.textContent = 'REMOVE TASK';
    btn_remove.style.width = '50%';
    wrapper_buttons.appendChild(btn_remove);

    btn_remove.addEventListener('click', function() {
        // const task_wrappers = document.getElementsByClassName('wrapper-task');
        const tasks = Task_Collapsible.getInstances();
        if(tasks.length > 1) {
            // task_wrappers[task_wrappers.length-1].remove();
            // Tree.removeLast();
            Task_Collapsible.removeLast();
        } else {
            console.log('Error: Attempting to remove the last task')
        }
    });

    return wrapper;
}

function create_task_HTML() {
    const collapsible = new Task_Collapsible();
    collapsible.add();

    return collapsible.getHTML();
}


document.currentScript.parentElement.appendChild(hazards_HTML());