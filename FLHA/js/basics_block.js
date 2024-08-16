function basics_html(){
    // modular package that generates html
    // gathers basic information
    // utilizes helper functions in order to keep things tidy
    // INPUT:   none
    // RETURN:  none

    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper-basicInfo';
    wrapper.classList.add('table-wrapper');
    document.body.appendChild(wrapper);

    const table = document.createElement('table');
    wrapper.appendChild(table);
    
    if(isMobileDevice()){
        mobile();
    } else {
        desktop();
        // mobile();
    }

    function mobile(){
        // CREATE ROWS
        const row_date = table.insertRow();
        const row_time = table.insertRow();
        const row_location = table.insertRow();
        const row_jobNum = table.insertRow();

        // CREATE CELLS
        // date
        const dateTime = makeDateTimeHtml();
        const cell_date_label = row_date.insertCell();
        const cell_date_input = row_date.insertCell();
        cell_date_input.classList.add('input');
        cell_date_label.appendChild(dateTime.date.label);
        cell_date_input.appendChild(dateTime.date.input);
        // time
        const cell_time_label = row_time.insertCell();
        const cell_time_input = row_time.insertCell();
        cell_time_input.classList.add('input');
        cell_time_label.appendChild(dateTime.time.label);
        cell_time_input.appendChild(dateTime.time.input);

        // location
        make_textInput_tableHtml(row_location, 'location', 'Location');
        // job number
        make_numericInput_tableHtml(row_jobNum, 'jobNumber', 'Job Number');

    }

    function desktop(){
        // CREATE ROWS
        const row1 = table.insertRow();
        const row2 = table.insertRow();

        // CREATE CELLS
        // date and time
        const cell_date_label = row1.insertCell();
        const cell_date_input = row1.insertCell();
        cell_date_input.classList.add('input');
        const cell_time_label = row2.insertCell();
        const cell_time_input = row2.insertCell();
        cell_time_input.classList.add('input');
        const dateTime = makeDateTimeHtml();
        cell_date_label.appendChild(dateTime.date.label);
        cell_date_input.appendChild(dateTime.date.input);
        cell_time_label.appendChild(dateTime.time.label);
        cell_time_input.appendChild(dateTime.time.input);
        // location
        make_textInput_tableHtml(row1, 'location', 'Location');
        // job number
        make_numericInput_tableHtml(row2, 'jobNumber', 'Job Number');
    }
    
}

function makeDateTimeHtml(){
    // Helper function for basics_html
    // creates date and time input elements with corresponding labels
    // does not place these elements on the graph
    // INPUT:   none
    // RETURN:  tuple - contains date and time input/label pairs
    const now = new Date();

    date = makeDateHtml(now);
    time = makeTimeHtml(now);

    return{date: date, time: time};
}

function makeDateHtml(now){
    // Helper function for getDateTimeHtml
    // creates date input element with corresponing label
    // does not place these elements on the graph
    // INPUT:   now - the current Date()
    // RETURN:  tuple - date input/label pair
    const input = document.createElement('input');
    input.type = 'date';
    input.id = 'input-date';
    input.value = now.toISOString().split('T')[0];
    input.classList.add('date', 'dateTime');

    const label = document.createElement('label');
    label.textContent = 'Date:';
    label.htmlFor = input.id;

    return {input: input, label: label};
}

function makeTimeHtml(now){
    // Helper function for getDateTimeHtml
    // creates time input element with corresponing label
    // does not place these elements on the graph
    // INPUT:   now - the current Date()
    // RETURN:  tuple - time input/label pair
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const input = document.createElement('input');
    input.type = 'time';
    input.id = 'input-time';
    input.value = `${hours}:${minutes}`;
    input.classList.add('time', 'dateTime');

    const label = document.createElement('label');
    label.textContent = 'Time:';
    label.htmlFor = input.id;

    return {input: input, label: label};
}

function getPDF_basics(){
    const date = document.getElementById('input-date').value;
    let time = document.getElementById('input-time').value;
    const location = document.getElementById('input-text-location').value;
    const jobNumber = document.getElementById('input-number-jobNumber').value;
    
    // adjust time
    let [hours, minutes] = time.split(':');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; 
    time = `${hours}:${minutes} ${ampm}`;

    let tableBody = [
        ['Date:', date, 'Location:', location],
        ['Time:', time, 'Job Number:', jobNumber]
    ]
    tableBody = tableBody.map((row) => {
        return row.map(cell => ({
            text: cell
        }));
    });

    const table = {
        table: {
            widths: '*',
            body: tableBody
        }
    }

    return table;
}
basics_html();