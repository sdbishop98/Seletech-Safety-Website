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

function getPDF_hazards() {
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

function hazards_html(){
    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper-hazards';
    if (!isMobileDevice()) {
        wrapper.classList.add('block-wrapper');
    }
    wrapper.classList.add('collapsible-root');
    document.currentScript.parentElement.appendChild(wrapper);

    const collapsible = new Collapsible();
    wrapper.appendChild(collapsible.getHTML());

    const task = new TextInput('test', 'TEST', false);
    collapsible.setHeader(task.getLabelHTML());
}

hazards_html_OLD();
hazards_html();