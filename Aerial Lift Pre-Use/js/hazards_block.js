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
    wrapper.classList.add('vertical-wrapper');

    // create row by row
    // starting with the headers
    
    // row 1
    const row_headers = document.createElement('div');
    row_headers.classList.add('horizontal-wrapper');
    wrapper.appendChild(row_headers);

    const label_tasks = document.createElement('label');
    label_tasks.textContent = 'Tasks';
    label_tasks.classList.add('hazards-input');
    row_headers.appendChild(label_tasks);

    const label_hazards = document.createElement('label');
    label_hazards.textContent = 'Hazards';
    label_hazards.classList.add('hazards-input');
    row_headers.appendChild(label_hazards);

    const label_controls = document.createElement('label');
    label_controls.textContent = 'Controls';
    label_controls.classList.add('hazards-input');
    row_headers.appendChild(label_controls);

    // row 2
    wrapper.appendChild(create_hazard_row());

    return wrapper;
}

function create_hazard_row(){
    const index = hazard_row_wrappers.length;
    const wrapper = document.createElement('div');
    wrapper.id = `wrapper-hazardRow${index}`;
    wrapper.classList.add('horizontal-wrapper');
    hazard_row_wrappers.push(wrapper);



    return wrapper;
}

hazards_block();