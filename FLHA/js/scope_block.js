function scope_html(){
    // modular package that generates html
    // gathers scope of work
    // utilizes helper functions in order to keep things tidy
    // INPUT:   none
    // RETURN:  none

    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper-scopeOfWork';
    document.body.appendChild(wrapper);

    

    if(isMobileDevice()){
        // mobile();
        desktop();
    } else {
        desktop();
    }

    function desktop(){
        const table = document.createElement('table');
        wrapper.appendChild(table);

        // CREATE ROWS
        const row_workDescription_label = table.insertRow();
        const row_workDescription_input = table.insertRow();
        const row_permitRequired = table.insertRow();
        
        
        // CREATE CELLS
        // work description
        const workDescription = makeTextareaInputLabelPair('workDescription', 'Work Description');
        row_workDescription_label.appendChild(workDescription.label);
        row_workDescription_input.appendChild(workDescription.input);
        //permit required
        const permitRequired = makeRadioInputLabelPairs(
            'permit-required', 
            ['permitRequired-yes', 'permitRequired-no'],
            ['Yes', 'No']
        )
        const cell_permitRequired_label = row_permitRequired.insertCell();
        cell_permitRequired_label.textContent = 'Permit Required:';
        const cell_permitRequired_input = row_permitRequired.insertCell();
        cell_permitRequired_input.appendChild(permitRequired[0].input);
        cell_permitRequired_input.appendChild(permitRequired[0].label);
        cell_permitRequired_input.appendChild(permitRequired[1].input);
        cell_permitRequired_input.appendChild(permitRequired[1].label);


        const table_taskReady = document.createElement('table');
        wrapper.appendChild(table_taskReady);

        const row_taskReady_label = table_taskReady.insertRow();
        const row_clearUnderstanding = table_taskReady.insertRow();



        
        // row_taskReady_label.textContent = 'TASK READY';
        const cell_taskReady_label = row_taskReady_label.insertCell();
        cell_taskReady_label.colSpan = 2;
        cell_taskReady_label.textContent = 'TASK READY';

        // clear understanding
        radio_input_html(
            'Do you have a clear understanding of your scope of work for the day?',
            'clear-understanding',
            'clearUnderstanding'
        );
        radio_input_html(
            'Have all workers reviewed any applicable safe work procedures and Safety Data Sheets that apply to this work?',
            'safety-review',
            'safetyReview'
        );
        radio_input_html(
            'Are the correct tools and equipment for the task available, in good condition, and ready to be used by a competent worker?',
            'correct-tools',
            'correctTools'
        );
        radio_input_html(
            'Is this a high-risk task, such as working at heights, working in a confined space, working alone, live electrical work, working near power lines, or working near energized equipment?',
            'high-risk',
            'highRisk'
        );

        function radio_input_html(question, name, identifier){
            const row = table_taskReady.insertRow();

            const blank = row.insertCell();
            blank.style.width = '25px';

            const cell_label = row.insertCell();
            cell_label.textContent = question;

            const inputLabel = makeRadioInputLabelPairs(
                name,
                [`${identifier}-yes`, `${identifier}-no`],
                ['Yes', 'No']
            )
            const cell_input = row.insertCell();
            cell_input.appendChild(inputLabel[0].input);
            cell_input.appendChild(inputLabel[0].label);
            cell_input.appendChild(inputLabel[1].input);
            cell_input.appendChild(inputLabel[1].label);
        }
    }
}

scope_html();