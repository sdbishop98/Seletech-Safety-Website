let hazard_row_wrappers = [];

function hazards_block(){
    link_stylesheet('css/main.css');

    const wrapper = document.createElement('div');
    wrapper.classList.add('vertical-wrapper');
    document.body.appendChild(wrapper);

    wrapper.appendChild(create_hazards());
}

function create_hazards(){
    const wrapper = document.createElement('div');

    // create table
    const table = document.createElement('table');
    table.id = 'table-hazards';
    wrapper.appendChild(table);

    // create header + header_row
    const header = document.createElement('thead');
    const header_row = document.createElement('tr');
    header.appendChild(header_row);
    table.appendChild(header);

    // create headers 
    const headers = ['Tasks', 'Hazards', 'Controls'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        header_row.appendChild(th);
    });
    
    // create body
    const body = document.createElement('tbody');
    body.id = 'body-hazards';
    table.appendChild(body);

    // create_hazard_row(body);

    

    return wrapper;
}

function create_hazard_row(body=null){
    let index = 0;
    let bgClass = 'even';

    if(!body){
        body = document.getElementById('body-hazards');
        index = body.rows.length;
        if(index % 2 !== 0){
            bgClass = 'odd';
        }
    }
    // create the row element
    const row = body.insertRow();
    row.classList.add(bgClass);

    // create the task segment
    const cell_task = row.insertCell();
    cell_task.id = `td-task${index}-task`;
    const input_task = document.createElement('input');
    input_task.id = `input-task${index}`;
    input_task.type = 'text';
    cell_task.appendChild(input_task);

    // create the hazard segment
    const cell_hazard = row.insertCell();
    cell_hazard.id = `td-task${index}-hazard`;
    cell_hazard.classList.add('hazard-td');
    // create hazard list
    const ul_hazard = document.createElement('ul');
    ul_hazard.id = `ul-task${index}-hazards`;
    cell_hazard.appendChild(ul_hazard);
    // create hazard input
    const li_hazard = document.createElement('li');
    li_hazard.id = `li-task${index}-hazard0`;
    ul_hazard.appendChild(li_hazard);
    const input_hazard = document.createElement('input');
    input_hazard.type = 'text';
    input_hazard.id = `input-task${index}-hazard0`;
    li_hazard.appendChild(input_hazard);
    // create add hazard button
    const btn_add_hazard = document.createElement('button');
    btn_add_hazard.textContent = 'Add Hazard';
    btn_add_hazard.onclick = () => addHazard(ul_hazard);
    cell_hazard.appendChild(btn_add_hazard);

    // create the control segment
    const cell_control = row.insertCell();
    cell_control.id = `td-task${index}-control`;
    // create wrapper
    const wrapper_control = document.createElement('div');
    wrapper_control.id = `wrapper-task${index}-hazard0-controls`;
    cell_control.appendChild(wrapper_control);
    // create control list
    const ul_control = document.createElement('ul');
    ul_control.id = `ul-task${index}-hazard0-controls`;
    wrapper_control.appendChild(ul_control);
    // create control input
    const li_control = document.createElement('li');
    ul_control.appendChild(li_control);
    const input_control = document.createElement('input');
    input_control.type = 'text';
    input_control.id = `input-task${index}-hazard0-control0`;
    li_control.appendChild(input_control);
    // create add control button
    const btn_add_control = document.createElement('button');
    btn_add_control.textContent = 'Add Control';
    btn_add_control.onclick = () => addControl(ul_control);
    wrapper_control.appendChild(btn_add_control);

    createAddTaskButton(body);
    
}

function addHazard(ul_parent){
    const index = ul_parent.querySelectorAll('li').length;

    const li_hazard = document.createElement('li');
    li_hazard.id = `li${ul_parent.id.slice(2,-1)}${index}`;
    ul_parent.appendChild(li_hazard);
    const input_hazard = document.createElement('input');
    input_hazard.type = 'text';
    input_hazard.id = `input${ul_parent.id.slice(2,-1)}${index}`;
    li_hazard.appendChild(input_hazard);

    // create control segment
    // get cell
    const cell_control = document.getElementById(`td${ul_parent.id.slice(2,-7)}control`);
    // create wrapper
    const wrapper_control = document.createElement('div');
    wrapper_control.id = `wrapper${ul_parent.id.slice(2,-1)}${index}-controls`;
    cell_control.appendChild(wrapper_control);
    // create control list
    const ul_control = document.createElement('ul');
    ul_control.id = `${ul_parent.id.slice(0,-1)}${index}-controls`;
    wrapper_control.appendChild(ul_control);
    // create control input
    const li_control = document.createElement('li');
    ul_control.appendChild(li_control);
    const input_control = document.createElement('input');
    input_control.type = 'text';
    input_control.id = `${ul_parent.id.slice(0,-1)}${index}-control0`;
    li_control.appendChild(input_control);
    // create add control button
    const btn_add_control = document.createElement('button');
    btn_add_control.textContent = 'Add Control';
    btn_add_control.onclick = () => addControl(ul_control);
    wrapper_control.appendChild(btn_add_control);

    correctHazardSpacing();
}

function addControl(ul_parent){
    const index = ul_parent.querySelectorAll('li').length;
    // console.log(ul_parent.id);

    // desired id: input-task0-hazard0-control1

    const li_control = document.createElement('li');
    ul_parent.appendChild(li_control);
    const input_control = document.createElement('input');
    input_control.type = 'text';
    input_control.id = `input${ul_parent.id.slice(2,-1)}${index}`;
    li_control.appendChild(input_control);

    correctHazardSpacing();
}

function createAddTaskButton(body){
    // remove old button if it exists
    const old = document.getElementById('button-addTask')
    if(old){
        old.remove()
    }

    // create new button
    const btn_add_task = document.createElement('button');
    btn_add_task.textContent = 'Add Task';
    btn_add_task.id = 'button-addTask';
    btn_add_task.onclick = () => create_hazard_row();

    // place new button into html
    const rows = body.querySelectorAll('tr');
    const lastRow = rows[rows.length-1];
    lastRow.querySelector('td').appendChild(btn_add_task);
    correctTaskSpacing();
}

function correctTaskSpacing(){
    const taskRows = document.getElementById('table-hazards').querySelector('tbody').querySelectorAll('tr');
    const lastRow = taskRows[taskRows.length-1];

    const hazard_height = lastRow.querySelector('.hazard-td').querySelector('ul').getBoundingClientRect().height;
    const input_task = lastRow.querySelector('input'); // this will break if the order of inputs change
    const input_height = input_task.getBoundingClientRect().height;
    input_task.style.marginBottom = `${hazard_height-input_height}px`
}

function correctHazardSpacing(){
    const td_hazards = document.querySelectorAll('.hazard-td');
    td_hazards.forEach(td => {
        const li_hazards = td.querySelectorAll('li');
        li_hazards.forEach((li, i, self) => {
            const control_height = document.getElementById(`wrapper${li.id.slice(2)}-controls`).getBoundingClientRect().height;
            const input_height = li.querySelector('input').getBoundingClientRect().height;
            if(i === self.length-1){
                const button_height = document.getElementById(`wrapper${li.id.slice(2)}-controls`).querySelector('button').getBoundingClientRect().height;
                li.style.paddingBottom = `${control_height-input_height-button_height}px`;
            } else {
                li.style.paddingBottom = `${control_height-input_height}px`;
            }            
        });
    });
    correctTaskSpacing();
}

hazards_block();
create_hazard_row();

window.addEventListener('load', function() {
    correctHazardSpacing();
})