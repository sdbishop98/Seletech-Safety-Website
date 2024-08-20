// I think it will be best to use collapsable menus
function hazards_html(){
    // modular package that generates html
    // gathers scope of work
    // utilizes helper functions in order to keep things tidy
    // INPUT:   none
    // RETURN:  none

    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper-hazards';
    wrapper.classList.add('block-wrapper');
    document.body.appendChild(wrapper);

    const task = create_task_segment();
    wrapper.appendChild(task);

    const btn_add_task = document.createElement('button');
    btn_add_task.classList.add('banner', 'add');
    btn_add_task.textContent = 'Add Task';
    task.appendChild(btn_add_task);


    function create_task_segment() {
        const index = document.getElementsByClassName('wrapper-task').length;
        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper-task');
        wrapper.id = `wrapper-task${index}`;

        const header = document.createElement('div');
        header.classList.add('collapsible-header');
        wrapper.appendChild(header);

        const task = makeTextInputLabelPair(`task${index}`, 'TASK');
        task.input.classList.add('task');
        task.input.style.marginLeft = '10px';
        const data_wrapper = document.createElement('div');
        data_wrapper.appendChild(task.label);
        data_wrapper.appendChild(task.input);
        header.appendChild(data_wrapper);

        const btn_expand = document.createElement('button');
        btn_expand.classList.add('collapsible-expand');
        header.appendChild(btn_expand);

        btn_expand.addEventListener('click', function() {
            this.classList.toggle('collapsible-active');
            // console.log('expand tasks');
            // console.log(this.parentElement.nextElementSibling);
            const content = this.parentElement.nextElementSibling;
            if(content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });

        const content = create_hazard_segment(wrapper, `task${index}`);
        content.classList.add('collapsible-content');
        wrapper.appendChild(content);

        return wrapper;
    }

    function create_hazard_segment(parent, parent_id) {
        const index = parent.getElementsByClassName('wrapper-hazard').length;
        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper-hazard');
        wrapper.id = `wrapper-${parent_id}-hazard${index}`;

        const header = document.createElement('div');
        header.classList.add('collapsible-header');
        wrapper.appendChild(header);

        const hazard = makeTextInputLabelPair(`${parent_id}-hazard${index}`, 'HAZARD');
        hazard.input.classList.add('hazard');
        hazard.input.style.marginLeft = '10px';
        const data_wrapper = document.createElement('div');
        data_wrapper.appendChild(hazard.label);
        data_wrapper.appendChild(hazard.input);
        header.appendChild(data_wrapper);

        const btn_expand = document.createElement('button');
        btn_expand.classList.add('collapsible-expand');
        header.appendChild(btn_expand);

        btn_expand.addEventListener('click', function() {
            this.classList.toggle('collapsible-active');
            const grandparent = this.parentElement.parentElement;
            const content = this.parentElement.nextElementSibling;
            if(content.style.maxHeight) {
                content.style.maxHeight = null;
                grandparent.style.maxHeight = `${grandparent.scrollHeight - content.scrollHeight}px`
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                grandparent.style.maxHeight = `${grandparent.scrollHeight + content.scrollHeight}px`
            }
        });

        const content = create_control_segment(wrapper, `${parent_id}-hazard${index}`);
        content.classList.add('collapsible-content');
        wrapper.appendChild(content);

        return wrapper;
    }

    function create_control_segment(parent, parent_id) {
        const index = parent.getElementsByClassName('wrapper-control').length;
        const wrapper = document.createElement('div');
        wrapper.classList.add('wrapper-control');
        wrapper.id = `wrapper-${parent_id}-control${index}`;

        const header = document.createElement('div');
        header.classList.add('collapsible-header');
        wrapper.appendChild(header);

        const control = makeTextInputLabelPair(`${parent_id}-control${index}`, 'CONTROL');
        control.input.classList.add('control');
        control.input.style.marginLeft = '10px';
        const data_wrapper = document.createElement('div');
        data_wrapper.appendChild(control.label);
        data_wrapper.appendChild(control.input);
        header.appendChild(data_wrapper);

        return wrapper;

    }
}


hazards_html();