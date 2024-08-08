// location
// date and time
// job number 

function basics_block(){
    link_stylesheet('css/main.css');

    const wrapper = document.createElement('div');
    wrapper.classList.add('horizontal-wrapper');
    wrapper.id = 'wrapper-basicInfo';
    document.body.appendChild(wrapper);
    create_date(wrapper);
    create_location(wrapper);
    create_jobNum(wrapper);
}

function create_date(parent){
    const wrapper = create_inputWrapper(parent);

    const label = document.createElement('label');
    label.textContent = 'Date';
    wrapper.appendChild(label);
    
    const date = document.createElement('input');
    date.type = 'date';
    date.id = 'input-date'
    date.value = new Date().toISOString().split('T')[0];
    label.htmlFor = date.id;
    wrapper.appendChild(date);
}

function create_location(parent){
    const wrapper = create_inputWrapper(parent);

    const label = document.createElement('label');
    label.textContent = 'Location';
    wrapper.appendChild(label);

    const location = document.createElement('input');
    location.type = 'text';
    location.id = 'input-location';
    label.htmlFor = location.id;
    wrapper.appendChild(location);
}

function create_jobNum(parent){
    const wrapper = create_inputWrapper(parent);
    parent.appendChild(wrapper);

    const label = document.createElement('label');
    label.textContent = 'Job Number';
    wrapper.appendChild(label);

    const jobno = document.createElement('input');
    jobno.type = 'number';
    jobno.id = 'input-jobnumber';
    label.htmlFor = jobno.id;
    wrapper.appendChild(jobno);
}

function create_inputWrapper(parent = null){
    const wrapper = document.createElement('div');
    wrapper.classList.add('vertical-wrapper');
    if(parent){
        parent.appendChild(wrapper);
    }
    return wrapper;
}

basics_block()