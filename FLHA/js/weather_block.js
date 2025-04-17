function weather_html_old(){
    // modular package that generates html
    // gathers weather information
    // utilizes helper functions in order to keep things tidy
    // INPUT:   none
    // RETURN:  none

    const weatherConditions = [
        'Clear', 'Partly Cloudy', 'Overcast', 'Windy', 'Rain', 
        'Lightning / Thunderstorm', 'Freezing Rain', 'Snow', 'Fog', 'Smoke / Haze'
    ];

    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper-weather';
    wrapper.classList.add('block-wrapper');
    document.currentScript.parentElement.appendChild(wrapper);

    const table = document.createElement('table');
    wrapper.appendChild(table);;

    if(isMobileDevice()){
        mobile();
    } else {
        desktop();
        // mobile();
    }

    function mobile(){
        // CREATE ROWS
        const row_weatherAffect_yes = table.insertRow();
        const row_weatherAffect_no = table.insertRow();
        const row_currentWeather_question = table.insertRow();
        const row_currentWeather_answer = table.insertRow();
        const row_temp = table.insertRow();

        // CREATE CELLS
        // work affected by weather
        const cell_weatherAffected_question = row_weatherAffect_yes.insertCell();
        cell_weatherAffected_question.rowSpan = 2;
        cell_weatherAffected_question.textContent = 'Is the work affected by the weather?';
        cell_weatherAffected_question.style.maxWidth = '10rem'; 

        const weatherAffected = makeRadioInputLabelPairs('weather-affected', ['weatherAffected-yes', 'weatherAffected-no'], ['Yes', 'No'], true);
        
        const cell_weatherAffected_yes = row_weatherAffect_yes.insertCell();
        cell_weatherAffected_yes.classList.add('input');
        cell_weatherAffected_yes.appendChild(weatherAffected[0].input);
        cell_weatherAffected_yes.appendChild(weatherAffected[0].label);
        const cell_weatherAffected_no = row_weatherAffect_no.insertCell();
        cell_weatherAffected_no.classList.add('input');
        cell_weatherAffected_no.appendChild(weatherAffected[1].input);
        cell_weatherAffected_no.appendChild(weatherAffected[1].label);

        // make_dropdown_tableHtml(row_currentWeather, 'current-weather', 'Current weather conditions', weatherConditions);
        const currentWeather = makeDropdownLabelPair('currentWeather', 'Current weather conditions', weatherConditions, true);
        const cell_currentWeather_question = row_currentWeather_question.insertCell();
        cell_currentWeather_question.colSpan = 2;
        cell_currentWeather_question.appendChild(currentWeather.label);
        const cell_currentWeather_answer = row_currentWeather_answer.insertCell();
        cell_currentWeather_answer.colSpan = 2;
        cell_currentWeather_answer.appendChild(currentWeather.input);

        make_numericInput_tableHtml(row_temp, 'currentTemperature', 'Temperature', true, '&deg;C');
    }

    function desktop(){
        // CREATE TABLE ROWS
        const row1 = table.insertRow();
        const row2 = table.insertRow();

        // CREATE CELLS
        // work affected by weather
        const cell_weatherAffected_question = row1.insertCell();
        cell_weatherAffected_question.rowSpan = 2;
        cell_weatherAffected_question.textContent = 'Is the work affected by the weather?';
        cell_weatherAffected_question.style.maxWidth = '9rem';

        const weatherAffected = makeRadioInputLabelPairs('weather-affected', ['weatherAffected-yes', 'weatherAffected-no'], ['Yes', 'No'], true);
        
        const cell_weatherAffected_yes = row1.insertCell();
        cell_weatherAffected_yes.classList.add('input');
        cell_weatherAffected_yes.appendChild(weatherAffected[0].input);
        cell_weatherAffected_yes.appendChild(weatherAffected[0].label);
        const cell_weatherAffected_no = row2.insertCell();
        cell_weatherAffected_no.classList.add('input');
        cell_weatherAffected_no.appendChild(weatherAffected[1].input);
        cell_weatherAffected_no.appendChild(weatherAffected[1].label);
        
        // current weather
        
        make_dropdown_tableHtml(row1, 'currentWeather', 'Current weather conditions', weatherConditions, true);
        
        make_numericInput_tableHtml(row2, 'currentTemperature', 'Temperature', true, '&deg;C');
    }
}

function getPDF_weather_old(){
    let issue = false;

    let workAffected;
    try {
        workAffected = getRadioInput('weather-affected');
    } catch (e) {
        if(bypass){
            workAffected = 'test';
        } else {
            issue = true;
        }
    }

    let currentWeather;
    try {
        currentWeather = getInputValue('input-dropdown-currentWeather');
    } catch (e) {
        if(bypass){
            currentWeather = 'test';
        } else {
            issue = true;
        }
    }

    let temperature;
    try {
        temperature = getNumericValue('input-number-currentTemperature');
    } catch (e) {
        if(bypass){
            temperature = 'test';
        } else {
            issue = true;
        }
    }

    if(issue) {
        throw new Error('Missing Data');
    }
    
    let workAffected_statement
    if(workAffected === 'Yes'){
        workAffected_statement = [
            'The work ',
            {text: 'is ', bold: true},
            'affected by the weather'
        ]
    } else {
        workAffected_statement = [
            'The work ',
            {text: 'is not ', bold: true},
            'affected by the weather'
        ]
    }

    let tableBody = [
        [
            {text: workAffected_statement, rowSpan: 2},
            'Current weather condition:',
            currentWeather
        ],
        ['', 'Temperature', temperature]
    ]

    return {
        table: {
            widths: '*',
            body: tableBody
        }
    }
}

class Weather_Input extends Input_Collection{
    constructor (obj) {
        super(obj);
    }

}
/** modular package that generates html
 * 
 * gathers: current weather and temperature
 * 
 * checks: if work is affected by the weather
 */
function weather_html(){
    const weatherConditions = [
        'Clear', 'Partly Cloudy', 'Overcast', 'Windy', 'Rain', 
        'Lightning / Thunderstorm', 'Freezing Rain', 'Snow', 'Fog', 'Smoke / Haze'
    ];

    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper-weather';
    wrapper.classList.add('block-wrapper');
    document.currentScript.parentElement.appendChild(wrapper);

    const table = document.createElement('table');
    wrapper.appendChild(table);

    const weatherAffected = new RadioInput(
        'weatherAffected',
        ['Yes', 'No'],
        'Is the work affected by the weather?',
        true
    )
    new Weather_Input(weatherAffected);

    let row = table.insertRow();
    let cell = row.insertCell();
    cell.appendChild(weatherAffected.getLabelHTML());
    cell = row.insertCell();
    cell.classList.add('td-radio');
    cell.appendChild(weatherAffected.getInputHTML()[0]);
    cell.appendChild(weatherAffected.getInputHTML()[1]);

    const currentWeather = new SelectInput(
        'currentWeather',
        weatherConditions,
        true, 
        'Current weather conditions',
        true
    )
    new Weather_Input(currentWeather);

    row = table.insertRow();
    cell = row.insertCell();
    cell.appendChild(currentWeather.getLabelHTML());
    cell = row.insertCell();
    cell.appendChild(currentWeather.getInputHTML());

    const temperature = new NumericTextInput('temperature', 'Temperature', true);
    new Weather_Input(temperature);

    row = table.insertRow();
    cell = row.insertCell();
    cell.appendChild(temperature.getLabelHTML());
    cell = row.insertCell();
    cell.appendChild(temperature.getInputHTML('&deg;C'));

}

function getPDF_weather(){
    const objects = Weather_Input.getObjects();
    let issue = false;
    let tableBody = [];

    objects.forEach((obj, index) => {
        let value
        try {
            value = obj.getInputValue(); 
        } catch(e) {
            if (bypass) {
                value = 'test';
            } else {
                issue = true;
            }
        }

        tableBody.push([
            {text: `${obj.getLabelValue()}:`},
            {text: value}
        ])
    })

    if(issue && !bypass) {
        throw new Error('Missing Data');
    }

    return {
        table: {
            widths: '*',
            body: tableBody
        }
    }
}

function getJSON_weather(){
    const objects = Weather_Input.getObjects();
    let json = {};
    
    if (bypass){
        json.weatherAffected = 'test';
        json.currentWeather = 'test';
        json.temperature = 'test';
    } else {
        json.weatherAffected = objects[0].getInputValue();
        json.currentWeather = objects[1].getInputValue();
        json.temperature = objects[2].getInputValue();
    }
    

    return json;
}

weather_html();