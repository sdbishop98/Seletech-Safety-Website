function scope_html_OLD(){
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

function getPDF_scope_OLD(){
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
        if(bypass){
            description = {
                text: [
                    {text: 'Work Description:\n', bold: true},
                    'test'
                ]
            }
        } else {
            issue = true;
        }
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
        if(bypass){
            permit = {
                table: {
                    body: [
                        ['Permit Required:', 'test']
                    ]
                }, 
                layout: 'noBorders'
            }
        } else {
            issue = true;
        }
    }
    let clearUnderstanding;
    try{
        clearUnderstanding = getRadioInput('clear-understanding');
    } catch (e) {
        if(bypass){
            clearUnderstanding = 'test';
        } else {
            issue = true;
        }
    }
    let review;
    try{
        review = getRadioInput('safety-review');
    } catch (e) {
        if(bypass){
            review = 'test';
        } else {
            issue = true;
        }
    }
    let tools;
    try{
        tools = getRadioInput('correct-tools');
    } catch (e) {
        if(bypass){
            tools = 'test';
        } else {
            issue = true;
        }
    }
    let highRisk;
    try{
        highRisk = getRadioInput('high-risk');
    } catch (e) {
        if(bypass){
            highRisk = 'test';
        } else {
            issue = true;
        }
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

    if(review === 'No'){
        const identifyMissing = document.getElementById('input-text-identify-missing').value.trim();
        const newItem = [
            {
                text:`Identify what was missing and review with all applicable workers: ${identifyMissing}`, 
                colSpan: 2, 
                margin: [20, 0, 0, 0]
            }, 
            {}
        ]
        taskReady.table.body.splice(2, 0, newItem);
    }
    if(highRisk === 'Yes'){
        const newItem = [
            {
                text: 'Ensure that these risks are specifically identified and discuss the plan before proceeding.',
                colSpan: 2,
                margin: [20, 0, 0, 0]
            },
            {}
        ]
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

class Scope_Input extends Input_Collection{
    constructor (obj) {
        super(obj)
    }
}
function scope_html(){
    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper-scopeOfWork';
    wrapper.classList.add('block-wrapper');
    document.currentScript.parentElement.appendChild(wrapper);

    // Work Description
    let table = document.createElement('table');
    wrapper.appendChild(table);

    let cols = 50;
    if(isMobileDevice()){
        cols = 23;
    }
    const workDescription = new TextAreaInput('workDescription', 4, cols, 'Work Description', true);
    new Scope_Input(workDescription);

    let row = table.insertRow();
    let cell = row.insertCell();
    cell.appendChild(workDescription.getLabelHTML());
    row = table.insertRow();
    cell = row.insertCell();
    cell.appendChild(workDescription.getInputHTML());
    cell.colSpan = 2;

    // Permit Required
    const permitRequired = new RadioInput(
        'permitRequired', 
        ['Yes', 'No'], 
        'Permit Required', 
        true
    );
    new Scope_Input(permitRequired);

    row = table.insertRow();
    cell = row.insertCell();
    cell.appendChild(permitRequired.getLabelHTML());
    cell.style.width = '150px';
    cell = row.insertCell();
    cell.appendChild(permitRequired.getInputHTML()[0]);
    cell.appendChild(permitRequired.getInputHTML()[1]);
    

    // TASK READINESS
    table = document.createElement('table');
    wrapper.appendChild(table);

    // Clear Understanding
    row = taskReady_row_html(
        'clearUnderstanding', 
        'Do you have a clear understanding of your scope of work for the day?'
    )
    table.appendChild(row);

    // Safety Review
    row = taskReady_row_html(
        'safetyReview', 
        'Have all workers reviewed any and all applicable safe work procedures and Safety Data Sheets (SDS) that apply to this work?'
    )
    table.appendChild(row);

    // Identify Missing
    const identifyMissing = new TextInput(
        'IdentifyMissing', 
        'Identify what was missing and review with all applicable workers:',
        true
    )
    new Scope_Input(identifyMissing);

    row = table.insertRow();
    row.hidden = true;
    row.id = 'row-identifyMissing';
    cell = row.insertCell();
    if(isMobileDevice()){
        cell.style.paddingLeft = '20px';
    } else {
        cell.style.paddingLeft = '50px';
    }
    cell.colSpan = 2;
    cell.appendChild(identifyMissing.getLabelHTML());
    cell.appendChild(identifyMissing.getInputHTML());

    // Correct Tools
    row = taskReady_row_html(
        'correctTools', 
        'Are the correct tools and equipment for the task available, in good condition, and ready to be used by a competent worker?'
    )
    table.appendChild(row);

    // High Risk
    row = taskReady_row_html(
        'highRisk', 
        'Is this a high-risk task, such as working at heights, working in a confined space, working alone, live electrical work, working near power lines, or working near energized equipment?'
    )
    table.appendChild(row);

    // Specify Risks
    row = table.insertRow();
    row.hidden = true;
    row.id = 'row-specifyRisks';
    cell = row.insertCell();
    if(isMobileDevice()){
        cell.style.paddingLeft = '20px';
    } else {
        cell.style.paddingLeft = '50px';
    }
    cell.colSpan = 2;
    cell.textContent = 'Ensure that these risks are specifically identified and discuss the plan before proceeding.'
    
    /** creates row for taskReady table
     * 
     * @param {string} name 
     * @param {string} label_str 
     * 
     * @returns {HTMLTableRowElement}
     */
    function taskReady_row_html(name, label_str) {
        let radio = new RadioInput(
            name, 
            ['Yes', 'No'],
            label_str,
            true
        )
        new Scope_Input(radio);

        let row = document.createElement('tr');
        row.classList.add('long-question');
        let cell = row.insertCell();
        cell.appendChild(radio.getLabelHTML());

        let tabSize = 25;
        if(isMobileDevice()){
            tabSize = 10
        }
        cell.style.paddingLeft = `${tabSize}px`

        cell = row.insertCell();
        if(isMobileDevice()){
            cell.style.width = '50px';
        } else {
            cell.style.width = '100px';
        }
        cell.appendChild(radio.getInputHTML()[0]);
        cell.appendChild(radio.getInputHTML()[1]);
        
        return row;
    }
}

function getPDF_scope(){
    const objects = Scope_Input.getObjects();
    let issue = false;
    let pdfContent = [];

    // Work Description
    let active = objects.shift();
    try {
        pdfContent.push({
            text: [
                {text: `${active.getLabelValue()}:\n`, bold: true},
                {text: `${active.getInputValue()}`}
            ]
        })
    } catch (e) {
        if (bypass) {
            pdfContent.push({
                text: [
                    {text: `${active.getLabelValue()}:\n`, bold: true},
                    {text: 'test'}
                ]
            })
        } else {
            issue = true;
        }
    }

    // Permit Required
    active = objects.shift();
    try {
        pdfContent.push({
            table: {
                body: [
                    {text: `${active.getLabelValue()}`},
                    {text: `${active.getInputValue()}`}
                ]
            },
            layout: 'noBorders'
        })
    } catch (e) {
        if(bypass){
            pdfContent.push({
                table: {
                    body: [
                        {text: `${active.getLabelValue()}`},
                        {text: `test`}
                    ]
                },
                layout: 'noBorders'
            })
        } else {
            issue = true;
        }
    }


    let taskReady = {
        table: {
            body: []
        },
        layout: 'noBorders'
    }
    while (objects.length >= 1){
        const active = objects.shift();
        try {
            const label = active.getLabelValue();
            const input = active.getInputValue();
            taskReady.table.body.push([label, input]);
            if (label === 'Have all workers reviewed any and all applicable safe work procedures and Safety Data Sheets (SDS) that apply to this work?') {
                if (input.toLowerCase() === 'no') {
                    const active = objects.shift();
                    try {
                        const label = active.getLabelValue();
                        const input = active.getInputValue();
                        taskReady.table.body.push (
                            [
                                {
                                    text: `${label} ${input}`,
                                    colSpan: 2,
                                    margin: [20, 0, 0, 0]
                                },
                                {}
                            ]
                        )
                    } catch (e) {
                        if(bypass) {
                            const label = active.getLabelValue();
                            const input = 'test';
                            taskReady.table.body.push(
                                [
                                    {
                                        text: `${label} ${input}`,
                                        colSpan: 2,
                                        margin: [20, 0, 0, 0]
                                    },
                                    {}
                                ]
                            )
                        } else {
                            issue = true;
                        }
                    }
                } else {
                    objects.shift();
                }
            }
            if (label === 'Is this a high-risk task, such as working at heights, working in a confined space, working alone, live electrical work, working near power lines, or working near energized equipment?') {
                if (input.toLowerCase() === 'yes') {
                    taskReady.table.body.push ([
                        {
                            text: 'Ensure that these risks are specifically identified and discuss the plan before proceeding.',
                            colSpan: 2,
                            margin: [20, 0, 0, 0]
                        },
                        {}
                    ])
                }
            }
        } catch (e) {
            if(bypass) {
                const label = active.getLabelValue();
                const input = 'test';
                taskReady.table.body.push([label, input]);
            } else {
                issue = true;
            }
        }
    }

    pdfContent.push(taskReady);


    if(issue && !bypass) {
        throw new Error('Missing Data');
    }

    return pdfContent;
}

function getJSON_scope(){
    const objects = Scope_Input.getObjects();
    let json = {};

    // console.log(objects);

    if (bypass) {
        json.workDescription = 'test';
        json.permitRequired = 'test';
        json.clearUnderstanding = 'test';
        json.safetyReview = 'test';
        json.identifyMissing = 'test';
        json.correctTools = 'test';
        json.highRisk = 'test';
    } else {
        json.workDescription = objects[0].getInputValue();
        json.permitRequired = objects[1].getInputValue();
        json.clearUnderstanding = objects[2].getInputValue();
        json.safetyReview = objects[3].getInputValue();
        json.identifyMissing = objects[4].getInputValue();
        json.correctTools = objects[5].getInputValue();
        json.highRisk = objects[6].getInputValue();
    }

    return json;
}

scope_html();

// if no, identify what was missing and review with all applicable workers
document.querySelectorAll('input[name="safetyReview"]').forEach((radio) => {
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
document.querySelectorAll('input[name="highRisk"]').forEach((radio) => {
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