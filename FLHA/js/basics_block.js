function basics_html(){
    // modular package that generates html
    // gathers basic information
    // utilizes helper functions in order to keep things tidy
    // INPUT:   none
    // RETURN:  none

    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper-basicInfo';
    document.body.appendChild(wrapper);

    const table = document.createElement('table');
    wrapper.appendChild(table);
    const body = document.createElement('tbody');
    table.appendChild(body);

    // create table rows
    const row1 = body.insertRow();
    const row2 = body.insertRow();

    // CREATE CELLS
    // date and time
    const cell_date_label = row1.insertCell();
    const cell_date_input = row1.insertCell();
    const cell_time_label = row2.insertCell();
    const cell_time_input = row2.insertCell();
    // location
    const cell_location_label = row1.insertCell();
    const cell_location_input = row1.insertCell();
    // job number
    const cell_jobNum_label = row2.insertCell();
    const cell_jobNum_input = row2.insertCell();

    // CREATE TABLE CONTENT
    // date and time
    const dateTime = makeDateTimeHtml();
    cell_date_label.appendChild(dateTime.date.label);
    cell_date_input.appendChild(dateTime.date.input);
    cell_time_label.appendChild(dateTime.time.label);
    cell_time_input.appendChild(dateTime.time.input);
    // location
    const location = makeLocationHtml();
    cell_location_label.appendChild(location.label);
    cell_location_input.appendChild(location.input);
    // job number
    const jobNum = makeJobNumberHtml();
    cell_jobNum_label.appendChild(jobNum.label);
    cell_jobNum_input.appendChild(jobNum.input);

}

function makeLocationHtml(){
    // Helper function for basics_html
    // creates job location input element with corresponing label
    // does not place these elements on the graph
    // INPUT:   none
    // RETURN:  tuple - location input/label pair
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-location';

    const label = document.createElement('label');
    label.textContent = 'Location:';
    label.htmlFor = input.id;

    return {input: input, label: label};
}

function makeJobNumberHtml(){
    // Helper function for basics_html
    // creates job number input element with corresponing label
    // does not place these elements on the graph
    // INPUT:   none
    // RETURN:  tuple - job number input/label pair
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'input-jobNumber';

    const label = document.createElement('label');
    label.textContent = 'Job Number:';
    label.htmlFor = input.id;

    return {input: input, label: label};
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

    const label = document.createElement('label');
    label.textContent = 'Time:';
    label.htmlFor = input.id;

    return {input: input, label: label};
}


basics_html();