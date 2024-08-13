function scope_html(){
    // modular package that generates html
    // gathers scope of work
    // utilizes helper functions in order to keep things tidy
    // INPUT:   none
    // RETURN:  none

    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper-scopeOfWork';
    document.body.appendChild(wrapper);

    const table = document.createElement('table');
    wrapper.appendChild(table);;

    if(isMobileDevice()){
        mobile();
    } else {
        desktop();
    }

    function desktop(){
        // CREATE ROWS
        const row_workDescription_label = table.insertRow();
        const row_workDescription_input = table.insertRow()

        // CREATE CELLS
        const workDescription = makeTextareaInputLabelPair('workDescription', 'Work Description');
        const cell_workDescription_label = row_workDescription_label.insertCell();
        cell_workDescription_label.colSpan = 2;
        cell_workDescription_label.appendChild(workDescription.label);
        const cell_workDescrption_input = row_workDescription_input.insertCell();
        cell_workDescrption_input.colSpan = 2;
        cell_workDescrption_input.appendChild(workDescription.input);

    }
}

scope_html();