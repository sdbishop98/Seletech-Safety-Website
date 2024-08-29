function scope_html(){
    // modular package that generates html
    // gathers scope of work
    // utilizes helper functions in order to keep things tidy
    // INPUT:   none
    // RETURN:  none

    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper-scopeOfWork';
    wrapper.classList.add('block-wrapper');
    document.currentScript.parentElement.appendChild(wrapper);

    const table = document.createElement('table');
    wrapper.appendChild(table);

    // CREATE ROWS
    const row_workDescription_label = table.insertRow();
    const row_workDescription_input = table.insertRow();
    
    
    // CREATE CELLS
    // work description
    const workDescription = makeTextareaInputLabelPair('workDescription', 'Work Description', true);
    workDescription.input.rows = 4;
    if(isMobileDevice()){
        workDescription.input.cols = 23;
    } else {
        workDescription.input.cols = 50;
    }
    const cell_workDescription_label = row_workDescription_label.insertCell();
    cell_workDescription_label.style.width = '125px';
    cell_workDescription_label.appendChild(workDescription.label);
    const cell_workDescription_input = row_workDescription_input.insertCell();
    cell_workDescription_input.colSpan = 2;
    cell_workDescription_input.appendChild(workDescription.input);

    const row_permitRequired = radio_input_html(
        table,
        'Permit Required:',
        'permit-required',
        'permitRequired'
    )
    if(!isMobileDevice()){
        const cells_permitRequired_label = row_permitRequired.querySelectorAll('td');
        cells_permitRequired_label[0].style.width = '10rem';
        cells_permitRequired_label[1].style.width = '';
    }
    
    const table_taskReady = document.createElement('table');
    // table_taskReady.classList.add('long-question');
    wrapper.appendChild(table_taskReady);

    const row_taskReady_label = table_taskReady.insertRow();

    // row_taskReady_label.textContent = 'TASK READY';
    const cell_taskReady_label = row_taskReady_label.insertCell();
    cell_taskReady_label.colSpan = 2;
    cell_taskReady_label.textContent = 'TASK READY';

    let tabSize = 25;
    if(isMobileDevice()){
        tabSize = 10
    }
    radio_input_html(
        table_taskReady,
        'Do you have a clear understanding of your scope of work for the day?',
        'clear-understanding',
        'clearUnderstanding',
        tabSize,
        'long-question'
    );
    radio_input_html(
        table_taskReady,
        'Have all workers reviewed any applicable safe work procedures and Safety Data Sheets that apply to this work?',
        'safety-review',
        'safetyReview',
        tabSize,
        'long-question'
    );

    const identifyMissing = makeTextInputLabelPair('identify-missing','Identify what was missing and review with all applicable workers');
    const row_identifyMissing = table_taskReady.insertRow();
    row_identifyMissing.hidden = true;
    row_identifyMissing.id = 'row-identifyMissing';
    const cell_identifyMissing = row_identifyMissing.insertCell();
    cell_identifyMissing.style.paddingLeft = `${tabSize*2}px`;
    cell_identifyMissing.colSpan = 2;
    cell_identifyMissing.appendChild(identifyMissing.label);
    identifyMissing.label.appendChild(identifyMissing.input);


    radio_input_html(
        table_taskReady,
        'Are the correct tools and equipment for the task available, in good condition, and ready to be used by a competent worker?',
        'correct-tools',
        'correctTools',
        tabSize,
        'long-question'
    );

    radio_input_html(
        table_taskReady,
        'Is this a high-risk task, such as working at heights, working in a confined space, working alone, live electrical work, working near power lines, or working near energized equipment?',
        'high-risk',
        'highRisk',
        tabSize,
        'long-question'
    );

    const row_specifyRisks = table_taskReady.insertRow();
    row_specifyRisks.hidden = true;
    row_specifyRisks.id = 'row-specifyRisks';
    const cell_specifyRisks = row_specifyRisks.insertCell();
    cell_specifyRisks.style.paddingLeft = `${tabSize*2}px`;
    cell_specifyRisks.colSpan = 2;
    cell_specifyRisks.textContent = 'Ensure that these risks are specifically identified and discuss the plan before proceeding.';

    function radio_input_html(table, question, name, identifier, tab = 0, classList = null){
        // helper function for scope_html
        // creates row formatted as a yes/no radio input.
        // INPUT    table       a table element that the row will be placed in
        //          question    the question associated with the radio input
        //          name        the name of the radio inputs
        //          identifier  used to create the id for the radio inputs
        //          tab         optional, units: px - adds an indent to the question 
        //          classList   a string or list that will add classes to the row
        // RETURN   row         the created row element with all of its contents - will allow for further customization
        const row = table.insertRow();
        if(classList){
            if (typeof classList === 'object'){
                classList.forEach(item => {
                    row.classList.add(item);
                })
            } else {
                row.classList.add(classList);
            }
        }
        const cell_label = row.insertCell();
        cell_label.textContent = question;
        if(tab && typeof tab === 'number'){
            cell_label.style.paddingLeft = `${tab}px`;
        }

        const inputLabel = makeRadioInputLabelPairs(
            name,
            [`${identifier}-yes`, `${identifier}-no`],
            ['Yes', 'No'],
            true
        )
        const cell_input = row.insertCell();
        if(isMobileDevice()){
            cell_input.style.width = '50px';
        } else {
            cell_input.style.width = '100px';
        }
        cell_input.classList.add('td-radio');
        cell_input.appendChild(inputLabel[0].label);
        inputLabel[0].label.insertBefore(inputLabel[0].input, inputLabel[0].label.firstChild);
        inputLabel[0].label.classList.add('label-w-radio');
        cell_input.appendChild(inputLabel[1].label);
        inputLabel[1].label.insertBefore(inputLabel[1].input, inputLabel[1].label.firstChild);
        inputLabel[1].label.classList.add('label-w-radio');

        return row;
    }
}

function getPDF_scope(){
    let issue = false;

    let description;
    try {
        description = {
            text: [
                {text: 'Work Description:\n', bold: true},
                getInputValue('input-textarea-workDescription')
            ]
        }
    } catch (e) {
        issue = true
    }

    let permit;
    try {
        permit = {
            table: {
                body: [
                    ['Permit Required:', getRadioInput('permit-required')]
                ]
            }, 
            layout: 'noBorders'
        }
    } catch (e) {
        issue = true;
    }
    let clearUnderstanding;
    try{
        clearUnderstanding = getRadioInput('clear-understanding');
    } catch (e) {
        issue = true;
    }
    let review;
    try{
        review = getRadioInput('safety-review');
    } catch (e) {
        issue = true;
    }
    let tools;
    try{
        tools = getRadioInput('correct-tools');
    } catch (e) {
        issue = true;
    }
    let highRisk;
    try{
        highRisk = getRadioInput('high-risk');
    } catch (e) {
        issue = true;
    }
    let taskReady = {
        table: {
            body: [
                ['Do you have a clear understanding of your scope of work for the day?', clearUnderstanding],
                ['Have all workers reviewed any applicable safe work procedures and Safety Data Sheets that apply to this work?', review],
                ['Are the correct tools and equipment for the task available, in good condition, and ready to be used by a competent worker?', tools],
                ['Is this a high-risk task, such as working at heights, working in a confined space, working alone, live electrical work, working near power lines, or working near energized equipment', highRisk]
            ]
        },
        layout: 'noBorders'
    }
    
    if(issue) {
        throw new Error('Missing Data - scope');
    }
    
    return [
        {text: ' '},
        description,
        permit,
        '\nTASK READY:',
        taskReady
    ]
}

scope_html();

// if no, identify what was missing and review with all applicable workers
document.querySelectorAll('input[name="safety-review"]').forEach((radio) => {
    radio.addEventListener('change', (event) => {
        if (event.target.value === 'No') {
            const row = document.getElementById('row-identifyMissing');
            row.hidden = false;
        } else {
            const row = document.getElementById('row-identifyMissing');
            row.hidden = true;
        }
    })
})
document.querySelectorAll('input[name="high-risk"]').forEach((radio) => {
    radio.addEventListener('change', (event) => {
        if (event.target.value === 'Yes') {
            const row = document.getElementById('row-specifyRisks');
            row.hidden = false;
        } else {
            const row = document.getElementById('row-specifyRisks');
            row.hidden = true;
        }
    })
})