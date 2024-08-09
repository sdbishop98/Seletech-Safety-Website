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
    make_textInput_tableHtml(row1, 'location', 'Location');
    // job number
    make_numericInput_tableHtml(row2, 'jobNumber', 'Job Number');
    // work affected by weather
    const cell_weatherAffected_question = row1.insertCell();
    cell_weatherAffected_question.rowSpan = 2;
    const cell_weatherAffected_yes = row1.insertCell();
    const cell_weatherAffected_no = row2.insertCell();
    // current weather
    const cell_currentWeather_label = row1.insertCell();
    const cell_currentWeather_input = row1.insertCell();
    // current temperature
    const cell_currentTemp_label = row2.insertCell();
    const cell_currentTemp_input = row2.insertCell();

    // CREATE TABLE CONTENT
    // date and time
    const dateTime = makeDateTimeHtml();
    cell_date_label.appendChild(dateTime.date.label);
    cell_date_input.appendChild(dateTime.date.input);
    cell_time_label.appendChild(dateTime.time.label);
    cell_time_input.appendChild(dateTime.time.input);
    // work affected by weather
    cell_weatherAffected_question.textContent = 'Is the work affected by the weather?';
    cell_weatherAffected_question.style.maxWidth = '100px';
    const weatherAffected_yesNo = ['Yes', 'No'];
    const weatherAffected = makeRaioInputLabelPairs('weather-affected', weatherAffected_yesNo, weatherAffected_yesNo);
    cell_weatherAffected_yes.appendChild(weatherAffected[0].input);
    cell_weatherAffected_yes.appendChild(weatherAffected[0].label);
    cell_weatherAffected_no.appendChild(weatherAffected[1].input);
    cell_weatherAffected_no.appendChild(weatherAffected[1].label);
    // weather conditions;



}

function make_textInput_tableHtml(row, identifier, label_str){ // done
    // Helper function
    // creates html table cell elements for a text input with corresponding label
    // INPUT:   row - tr element - row to place the cell in
    //          identifier - string - unique identifier
    //          label_str - string - text for the label element
    // RETURN:  none
    const cell_label = row.insertCell();
    const cell_input = row.insertCell();

    const content = makeTextInputLabelPair(identifier, label_str);
    cell_label.appendChild(content.label);
    cell_input.appendChild(content.input);

    function makeTextInputLabelPair(identifier, label_str){
        // Helper function for make_textInput_tableHtml
        // creates text input element with corresponing label
        // does not place these elements on the graph
        // INPUT:   identifier - string - unique identifier
        //          label_str - string - text for the label element
        // RETURN:  tuple - location input/label pair
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `input-text-${identifier}`;
        input.classList.add('text');
    
        const label = document.createElement('label');
        label.textContent = label_str;
        label.htmlFor = input.id;
    
        return {input: input, label: label};
    }
}

function make_numericInput_tableHtml(row, identifier, label_str, unit = null) { // done
    // Helper function
    // creates html table cell elements for a text input with corresponding label
    // INPUT:   row - tr element - row to place the cell in
    //          identifier - string - unique identifier
    //          label_str - string - text for the label element
    //          unit - string - optional, will place a unit at the end of the number input
    // RETURN:  none
    const cell_label = row.insertCell();
    const cell_input = row.insertCell();

    const content = makeNumericInputLabelPair(identifier, label_str, unit);
    cell_label.appendChild(content.label);
    cell_input.appendChild(content.input);

    function makeNumericInputLabelPair(identifier, label_str, unit_str=null) {
        // Helper function for make_numberInput_tableHtml
        // creates number input element with corresponing label
        // does not place these elements on the graph
        // INPUT:   identifier - string - unique identifier
        //          label_str - string - text for the label element
        //          unit - string - optional, will place a unit at the end of the number input
        // RETURN:  tuple - location input/label pair
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `input-number-${identifier}`;
        input.inputMode = 'numeric';
        input.pattern = '[0-9]*'
        input.classList.add('text', 'numeric');

        input.addEventListener('input', e => {
            if(isNaN(input.value)){
                input.classList.add('error');
            } else if (input.classList.contains('error')){
                input.classList.remove('error');
            }
        });

        const label = document.createElement('label');
        label.textContent = label_str;
        label.htmlFor = input.id;

        if(unit_str){
            const unit = document.createElement('label');
            unit.appendChild(input);
            const unit_text = document.createElement('span');
            unit_text.textContent = unit_str;
            return {input: unit, label: label};
        } 
        return {input: input, label: label}
    }
}

function validateNumericInputs() { // wip
    const inputs = document.querySelectorAll('input.numeric');
}


function makeRaioInputLabelPairs(name, identifiers, labels){
    // Helper function
    // creates radio input elements with corresponing label
    // all created elements will share the same name
    // does not place these elements on the graph
    // INPUT:   name - string - unique name for the radio elements
    //          identifiers - list - strings - unique identifiers
    //          labels - list - strings - text for the label element
    //      identifiers and labels must be the same length
    // RETURN:  list - tuples - location input/label pair
    //              will have the same length and order of identifiers
    if((typeof identifiers !== 'object') || (typeof identifiers !== typeof labels) || (identifiers.length !== labels.length)){
        throw new Error('invalid input');
    }
    let radios = []
    identifiers.forEach((identifier_str, index) => {
        const input = document.createElement('input');
        input.type = 'radio';
        input.id = `input-radio-${identifier_str}`;
        input.classList.add('radio');
        input.name = name;

        const label = document.createElement('label');
        label.textContent = labels[index];
        label.htmlFor = input.id;

        radios.push({input: input, label: label});
    })
    return radios;
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


basics_html();