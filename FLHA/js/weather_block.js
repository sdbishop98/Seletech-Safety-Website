function weather_html(){
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
    document.body.appendChild(wrapper);

    const table = document.createElement('table');
    wrapper.appendChild(table);;

    if(isMobileDevice()){
        mobile();
    } else {
        desktop();
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

        const weatherAffected = makeRaioInputLabelPairs('weather-affected', ['weatherAffected-yes', 'weatherAffected-no'], ['Yes', 'No']);
        
        const cell_weatherAffected_yes = row_weatherAffect_yes.insertCell();
        cell_weatherAffected_yes.classList.add('input');
        cell_weatherAffected_yes.appendChild(weatherAffected[0].input);
        cell_weatherAffected_yes.appendChild(weatherAffected[0].label);
        const cell_weatherAffected_no = row_weatherAffect_no.insertCell();
        cell_weatherAffected_no.classList.add('input');
        cell_weatherAffected_no.appendChild(weatherAffected[1].input);
        cell_weatherAffected_no.appendChild(weatherAffected[1].label);

        // make_dropdown_tableHtml(row_currentWeather, 'current-weather', 'Current weather conditions', weatherConditions);
        const currentWeather = makeDropdownLabelPair('currentWeather', 'Current weather conditions', weatherConditions);
        const cell_currentWeather_question = row_currentWeather_question.insertCell();
        cell_currentWeather_question.colSpan = 2;
        cell_currentWeather_question.appendChild(currentWeather.label);
        const cell_currentWeather_answer = row_currentWeather_answer.insertCell();
        cell_currentWeather_answer.colSpan = 2;
        cell_currentWeather_answer.appendChild(currentWeather.input);

        make_numericInput_tableHtml(row_temp, 'currentTemperature', 'Temperature', '&deg;C');
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

        const weatherAffected = makeRadioInputLabelPairs('weather-affected', ['weatherAffected-yes', 'weatherAffected-no'], ['Yes', 'No']);
        
        const cell_weatherAffected_yes = row1.insertCell();
        cell_weatherAffected_yes.classList.add('input');
        cell_weatherAffected_yes.appendChild(weatherAffected[0].input);
        cell_weatherAffected_yes.appendChild(weatherAffected[0].label);
        const cell_weatherAffected_no = row2.insertCell();
        cell_weatherAffected_no.classList.add('input');
        cell_weatherAffected_no.appendChild(weatherAffected[1].input);
        cell_weatherAffected_no.appendChild(weatherAffected[1].label);
        
        // current weather
        
        make_dropdown_tableHtml(row1, 'currentWeather', 'Current weather conditions', weatherConditions);
        
        make_numericInput_tableHtml(row2, 'currentTemperature', 'Temperature', '&deg;C');
    }
    
}

function getPDF_weather(){
    const workAffected = getRadioInput('weather-affected');
    const currentWeather = document.getElementById('input-dropdown-currentWeather').value;
    const temperature = `${document.getElementById('input-number-currentTemperature').value}\u00B0C`;
    
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
            {text: 'isn\'t ', bold: true},
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



weather_html();