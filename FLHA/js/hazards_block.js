// I think it will be best to use collapsable menus
function hazards_html_OLD(){
    // modular package that generates html
    // gathers scope of work
    // utilizes helper functions in order to keep things tidy
    // INPUT:   none
    // RETURN:  none

    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper-hazards';
    if (!isMobileDevice()) {
        wrapper.classList.add('block-wrapper');
    }
    wrapper.classList.add('collapsible-root');
    document.body.appendChild(wrapper);

    const task = create_task_segment();
    wrapper.appendChild(task);

    const wrapper_buttons = document.createElement('div');
    wrapper_buttons.style.display = 'flex';
    if (isMobileDevice()) {
        wrapper_buttons.style.flexDirection = 'column';
    } else {
        wrapper_buttons.style.flexDirection = 'row';
    }
    wrapper.appendChild(wrapper_buttons);

    const btn_add = document.createElement('button');
    btn_add.classList.add('fill');
    btn_add.textContent = 'ADD TASK';
    wrapper_buttons.appendChild(btn_add);

    btn_add.addEventListener('click', function() {
        const task = create_task_segment();
        wrapper.insertBefore(task, this.parentElement);
    });

    const btn_remove = document.createElement('button');
    btn_remove.classList.add('fill');
    btn_remove.textContent = 'REMOVE TASK';
    wrapper_buttons.appendChild(btn_remove);

    btn_remove.addEventListener('click', function () {
        const tasks = document.getElementsByClassName('wrapper-task');
        if (tasks.length > 1) {
            tasks[tasks.length-1].remove();
        } else {
            console.log('Error: there must be at least one task');
        }
    });


    function create_task_segment() {
        const index = document.getElementsByClassName('wrapper-task').length;
        const id = `task${index}`;
        const collapsable = create_collapsible(id)
        collapsable.wrapper.classList.add('wrapper-task');

        const content = makeTextInputLabelPair(id, 'TASK');
        content.input.classList.add('task');
        content.input.style.marginLeft = '10px';

        collapsable.header.appendChild(content.label);
        collapsable.header.appendChild(content.input);
        
        if(isMobileDevice()) {
            collapsable.header.style.display = 'flex';
            collapsable.header.style.flexDirection = 'column';
        }

        collapsable.content.appendChild(create_hazard_segment(collapsable.wrapper, id));

        const wrapper_buttons = document.createElement('div');
        wrapper_buttons.style.display = 'flex';
        if (isMobileDevice()) {
            wrapper_buttons.style.flexDirection = 'column';
        } else {
            wrapper_buttons.style.flexDirection = 'row';
        }
        collapsable.content.appendChild(wrapper_buttons);

        const btn_add = document.createElement('button');
        btn_add.classList.add('fill');
        btn_add.textContent = 'ADD HAZARD';
        wrapper_buttons.appendChild(btn_add);

        btn_add.addEventListener('click', function () {
            const hazard = create_hazard_segment(collapsable.wrapper, id);
            collapsable.content.insertBefore(hazard, this.parentElement);
            const ancestors = getAncestorsWithClass(this, 'collapsible-content');
            const content = this.parentElement;
            ancestors.forEach(ancestor => {
                ancestor.style.maxHeight = `${ancestor.scrollHeight + content.scrollHeight}px`;
            })
        });

        const btn_remove = document.createElement('button');
        btn_remove.classList.add('fill');
        btn_remove.textContent = 'REMOVE HAZARD';
        wrapper_buttons.appendChild(btn_remove);

        btn_remove.addEventListener('click', function () {
            const hazards = this.parentElement.parentElement.getElementsByClassName('wrapper-hazard');
            if (hazards.length > 1) {
                hazards[hazards.length-1].remove()
            } else {
                console.log('Error: there must be at least one hazard');
            }
        });

        return collapsable.wrapper;
    }

    function create_hazard_segment(parent, parent_id) {
        const index = parent.getElementsByClassName('wrapper-hazard').length;
        const id = `${parent_id}-hazard${index}`
        const collapsable = create_collapsible(id);
        collapsable.wrapper.classList.add('wrapper-hazard');

        const content = makeTextInputLabelPair(id, 'HAZARD');
        content.input.classList.add('hazard');
        content.input.style.marginLeft = '10px';

        collapsable.header.appendChild(content.label);
        collapsable.header.appendChild(content.input);

        if(isMobileDevice()) {
            collapsable.header.style.display = 'flex';
            collapsable.header.style.flexDirection = 'column';
        }

        collapsable.content.appendChild(create_control_segment(collapsable.wrapper, id));

        const wrapper_buttons = document.createElement('div');
        wrapper_buttons.style.display = 'flex';
        if (isMobileDevice()) {
            wrapper_buttons.style.flexDirection = 'column';
        } else {
            wrapper_buttons.style.flexDirection = 'row';
        }
        collapsable.content.appendChild(wrapper_buttons);
        
        const btn_add = document.createElement('button');
        btn_add.classList.add('fill');
        btn_add.textContent = 'ADD CONTROL';
        wrapper_buttons.appendChild(btn_add);

        btn_add.addEventListener('click', function () {
            const control = create_control_segment(collapsable.wrapper, id);
            collapsable.content.insertBefore(control, this.parentElement);
            const ancestors = getAncestorsWithClass(this, 'collapsible-content');
            const content = this.parentElement.parentElement;
            content.style.maxHeight = content.scrollHeight + 'px';
            ancestors.forEach(ancestor => {
                ancestor.style.maxHeight = `${ancestor.scrollHeight + content.scrollHeight*2}px`;
            })
        });

        const btn_remove = document.createElement('button');
        btn_remove.classList.add('fill');
        btn_remove.textContent = 'REMOVE CONTROL';
        wrapper_buttons.appendChild(btn_remove);

        btn_remove.addEventListener('click', function () {
            const controls = this.parentElement.parentElement.getElementsByClassName('wrapper-control');
            if (controls.length > 1) {
                controls[controls.length-1].remove()
            } else {
                console.log('Error: there must be at least one control');
            }
        });

        return collapsable.wrapper;
    }

    function create_control_segment(parent, parent_id) {
        const index = parent.getElementsByClassName('wrapper-control').length;
        const id = `${parent_id}-control${index}`
        const wrapper = document.createElement('div');
        wrapper.classList.add('collapsible-leaf', 'wrapper-control')

        const content = makeTextInputLabelPair(id, 'CONTROL');
        content.input.classList.add('control');
        content.input.style.marginLeft = '10px';

        const data = document.createElement('div');
        wrapper.appendChild(data);
        data.appendChild(content.label);
        data.appendChild(content.input);

        if(isMobileDevice()) {
            data.style.display = 'flex';
            data.style.flexDirection = 'column';
        }

        return wrapper;
    }
    
}

function getPDF_hazards_OLD() {
    const tableBody = [];
    tableBody.push([
        {text: 'Tasks', style: 'tableHeader', alignment: 'center'},
        {text: 'Hazards', style: 'tableHeader', alignment: 'center'},
        {text: 'Controls', style: 'tableHeader', alignment: 'center'},
    ]);

    const task_wrappers = document.getElementsByClassName('wrapper-task');
    Array.from(task_wrappers).forEach(wrapper => {
        let row = []
        const blank = {text: '', border: [true, false, true, false]}
        const task = wrapper.getElementsByClassName('task')[0].value.trim();
        row.push({text: task, border: [true, true, true, false]});
        const hazard_wrappers = wrapper.getElementsByClassName('wrapper-hazard');
        Array.from(hazard_wrappers).forEach((wrapper, index) => {
            const hazard = wrapper.getElementsByClassName('hazard')[0].value.trim();
            data = {text: hazard, border: [false, true, true, false]}
            if (index === 0) {
                row.push(data);
            } else {
                row = [JSON.parse(JSON.stringify(blank)), data];
            }
            const control_wrappers = wrapper.getElementsByClassName('wrapper-control');
            Array.from(control_wrappers).forEach((wrapper, index) => {
                const control = wrapper.getElementsByClassName('control')[0].value.trim();
                data = {text: control, border: [true, true, true, true]}
                if (index === 0) {
                    row.push(data);
                    // row[1].border[1] = true;
                } else {
                    row = [JSON.parse(JSON.stringify(blank)), JSON.parse(JSON.stringify(blank)), data];
                }
                tableBody.push(row);
            }); // end of control loop
        }); // end of hazard loop
    }) // end of task loop
    tableBody[tableBody.length - 1][0].border[3] = true;
    tableBody[tableBody.length - 1][1].border[3] = true;
    return {
        table: {
            widths: '*',
            headerRows: 1,
            body: tableBody
        },
        layout: {
            defaultBorder: false
        }
    }
}


class Tasks_Input{
    static tasks = [];
    static instances = [];
    constructor(obj){
        this.obj = obj;
        Tasks_Input.tasks.push(this.obj);
        Tasks_Input.instances.push(this);
        this.hazards = [];
    }
    static removeLast(){
        return Tasks_Input.instances.pop();
    }
    static getInstances(){
        return Tasks_Input.instances;
    }
    addHazard(obj){
        const hazard = new Hazards_Input(obj);
        this.hazards.push(hazard);
        return hazard;
    }
    getHazards(){
        return this.hazards;
    }
    removeHazard(){
        return this.hazards.pop();
    }
    getValue(){
        return this.obj.getInputValue();
    }
}
class Hazards_Input{
    constructor(obj){
        this.obj = obj;
        this.controls = [];
    }
    addControl(obj){
        const control = new Controls_Input(obj);
        this.controls.push(control);
        return control;
    }
    getControls(){
        return this.controls;
    }
    removeControl(){
        return this.controls.pop();
    }
    getValue(){
        return this.obj.getInputValue();
    }
}
class Controls_Input{
    constructor(obj){
        this.obj = obj;
    }
    getValue(){
        return this.obj.getInputValue();
    }
}
function hazards_html(){
    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper-hazards';
    if (!isMobileDevice()) {
        wrapper.classList.add('block-wrapper');
    }
    wrapper.classList.add('collapsible-root');
    document.currentScript.parentElement.appendChild(wrapper);

    wrapper.appendChild(create_task_segment());

    const wrapper_buttons = document.createElement('div');
    wrapper_buttons.style.display = 'flex';
    if(isMobileDevice()){
        wrapper_buttons.style.flexDirection = 'column';
    } else {
        wrapper_buttons.style.flexDirection = 'row';
    }
    wrapper.appendChild(wrapper_buttons);

    const btn_add = document.createElement('button');
    btn_add.classList.add('fill');
    btn_add.textContent = 'ADD TASK';
    wrapper_buttons.appendChild(btn_add);

    btn_add.addEventListener('click', function() {
        const task = create_task_segment();
        wrapper.insertBefore(task, this.parentElement);
    });

    const btn_remove = document.createElement('button');
    btn_remove.classList.add('fill');
    btn_remove.textContent = 'REMOVE TASK';
    wrapper_buttons.appendChild(btn_remove);

    btn_remove.addEventListener('click', function() {
        const task_wrappers = document.getElementsByClassName('wrapper-task');
        if(task_wrappers.length > 1) {
            task_wrappers[task_wrappers.length-1].remove();
            Tasks_Input.removeLast()
        } else {
            console.log('Error: There must be at least one task')
        }
    });

    function create_task_segment() {
        const index = document.getElementsByClassName('wrapper-task').length;
        const id = `task${index}`;
        const collapsible = new Collapsible();
        collapsible.getHTML().classList.add('wrapper-task');

        let required = false;
        if (index === 0) {
            required = true;
        }
        const content = new TextInput(id, 'TASK', required);
        const task = new Tasks_Input(content)
        content.getInputHTML().style.marginLeft = '10px';

        collapsible.setHeader(content.getLabelHTML());
        collapsible.setHeader(content.getInputHTML());

        if(isMobileDevice()) {
            collapsible.getHeaderHTML().style.display = 'flex';
            collapsible.getHeaderHTML().style.flexDirection = 'column';
        }

        collapsible.setContent(create_hazard_segment(collapsible.getHTML(), id, task));

        const wrapper_buttons = document.createElement('div');
        wrapper_buttons.style.display = 'flex';
        if (isMobileDevice()) {
            wrapper_buttons.style.flexDirection = 'column';
        } else {
            wrapper_buttons.style.flexDirection = 'row';
        }
        collapsible.setContent(wrapper_buttons);

        const btn_add = document.createElement('button');
        btn_add.classList.add('fill');
        btn_add.textContent = 'ADD HAZARD';
        wrapper_buttons.appendChild(btn_add);

        btn_add.addEventListener('click', function() {
            collapsible.getContentHTML().insertBefore(create_hazard_segment(collapsible.getHTML(), id, task), this.parentElement);
            const ancestors = getAncestorsWithClass(this, 'collapsible-content');
            const content = this.parentElement;
            ancestors.forEach(ancestor => {
                ancestor.style.maxHeight = `${ancestor.scrollHeight + content.scrollHeight}px`;
            })
        })

        const btn_remove = document.createElement('button');
        btn_remove.classList.add('fill');
        btn_remove.textContent = 'REMOVE HAZARD';
        wrapper_buttons.appendChild(btn_remove);

        btn_remove.addEventListener('click', function() {
            const hazard_elements = this.parentElement.parentElement.getElementsByClassName('wrapper-hazard');
            if (hazard_elements.length > 1) {
                hazard_elements[hazard_elements.length-1].remove();
                task.removeHazard();
            } else {
                console.log('Error: there must be at least one hazard');
            }
        })

        return collapsible.getHTML();
    }

    function create_hazard_segment(parent_HTML, parent_id, task){
        const index = parent_HTML.getElementsByClassName('wrapper-hazard').length;
        const id = `${parent_id}-hazard${index}`;
        const collapsible = new Collapsible();
        collapsible.getHTML().classList.add('wrapper-hazard');

        const required = (function() {
            const parts = id.split('-');
            const task = parts[0].replace('task', '');
            const hazard = parts[1].replace('hazard', '');
            return task === '0' && hazard === '0';
        })();

        const content = new TextInput(id, 'HAZARD', required);
        const hazard = task.addHazard(content);
        content.getInputHTML().style.marginLeft = '10px';

        collapsible.setHeader(content.getLabelHTML());
        collapsible.setHeader(content.getInputHTML());

        if(isMobileDevice()){
            collapsible.getHeaderHTML().style.display = 'flex';
            collapsible.getHeaderHTML().style.flexDirection = 'column';
        }

        collapsible.setContent(create_control_segment(collapsible.getHTML(), id, hazard));

        const wrapper_buttons = document.createElement('div');
        wrapper_buttons.style.display = 'flex';
        if (isMobileDevice()) {
            wrapper_buttons.style.flexDirection = 'column';
        } else {
            wrapper_buttons.style.flexDirection = 'row';
        }
        collapsible.setContent(wrapper_buttons);

        const btn_add = document.createElement('button');
        btn_add.classList.add('fill');
        btn_add.textContent = 'ADD CONTROL';
        wrapper_buttons.appendChild(btn_add);

        btn_add.addEventListener('click', function() {
            const control = create_control_segment(collapsible.getHTML(), id, hazard);
            collapsible.getContentHTML().insertBefore(control, this.parentElement);
            const ancestors = getAncestorsWithClass(this, 'collapsible-content');
            const content = this.parentElement.parentElement;
            content.style.maxHeight = content.scrollHeight + 'px';
            ancestors.forEach(ancestor => {
                ancestor.style.maxHeight = `${ancestor.scrollHeight + content.scrollHeight*2}px`;
            })
        })

        const btn_remove = document.createElement('button');
        btn_remove.classList.add('fill');
        btn_remove.textContent = 'REMOVE CONTROL';
        wrapper_buttons.appendChild(btn_remove);

        btn_remove.addEventListener('click', function () {
            const controls = this.parentElement.parentElement.getElementsByClassName('wrapper-control');
            if (controls.length > 1) {
                controls[controls.length-1].remove();
                hazard.removeControl();
            } else {
                console.log('Error: there must be at least one control');
            }
        })

        return collapsible.getHTML();
    }

    function create_control_segment(parent_HTML, parent_id, hazard){
        const index = parent_HTML.getElementsByClassName('wrapper-control').length;
        const id = `${parent_id}-control${index}`;
        const wrapper = document.createElement('div');
        wrapper.classList.add('collapsible-leaf', 'wrapper-control');

        const required = (function() {
            const parts = id.split('-');
            const task = parts[0].replace('task', '');
            const hazard = parts[1].replace('hazard', '');
            const control = parts[2].replace('control', '');
            return task === '0' && hazard === '0' && control === '0';
        })();
        const content = new TextInput(id, 'CONTROL', required);
        hazard.addControl(content);
        content.getInputHTML().style.marginLeft = '10px';

        const data = document.createElement('div');
        wrapper.appendChild(data);
        data.appendChild(content.getLabelHTML());
        data.appendChild(content.getInputHTML());

        if(isMobileDevice()) {
            data.style.display = 'flex';
            data.style.flexDirection = 'column';
        }
        return wrapper;
    }
    
}

function getPDF_hazards(){
    const tableBody = [];
    tableBody.push([
        {text: 'Tasks', style: 'tableHeader', alignment: 'center'},
        {text: 'Hazards', style: 'tableHeader', alignment: 'center'},
        {text: 'Controls', style: 'tableHeader', alignment: 'center'},
    ]);

    // const task_wrappers = document.getElementsByClassName('wrapper-task');
    const tasks = Tasks_Input.getInstances()
    console.log(tasks);
    const blank = {text: '', border: [true, false, true, false]};
    let issue = false
    tasks.forEach(task => {
        let row = [];
        let text;
        try{
            text = task.getValue();
        } catch (e) {
            if (bypass) {
                text = 'test';
            } else {
                issue = true;
            }
        }
        row.push({text: text, border: [true, true, true, false]});
        const hazards = task.getHazards();
        console.log(hazards);
        hazards.forEach((hazard, index) => {
            let text;
            try{
                text = hazard.getValue();
            } catch (e) {
                if (bypass) {
                    text = 'test';
                } else {
                    issue = true;
                }
            }
            const data = {text: text, border: [false, true, true, false]};
            if (index === 0) {
                row.push(data);
            } else {
                row = [JSON.parse(JSON.stringify(blank)), data] 
                    // the stringify and parsing is to create a deep copy. 
                    // a linked copy will cause bugs
            }
            const controls = hazard.getControls();
            console.log(controls);
            controls.forEach((control, index) => {
                let text;
                try {
                    text = control.getValue();
                } catch(e) {
                    if (bypass) {
                        text = 'test';
                    } else {
                        issue = true;
                    }
                }
                const data = {text: text, border: [true, true, true, true]};
                if (index === 0){
                    row.push(data);
                } else {
                    row = [JSON.parse(JSON.stringify(blank)), JSON.parse(JSON.stringify(blank)), data];
                }
                tableBody.push(row);
            })
        })
    })
    console.log(tableBody);
    tableBody[tableBody.length - 1][0].border[3] = true;
    tableBody[tableBody.length - 1][1].border[3] = true;
    return {
        table: {
            widths: '*',
            headerRows: 1,
            body: tableBody
        },
        layout: {
            defaultBorder: false
        }
    }
}

hazards_html();