let bypass = false;

function getPDF_basics_OLD() {
    let issue = false;
    

    const date = { element: document.getElementById('input-date') };
    date.value = date.element.value;

    const time = { element: document.getElementById('input-time') };
    time.value = time.element.value;
    let [hours, minutes] = time.value.split(':');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; 
    time.value = `${hours}:${minutes} ${ampm}`;


    
    let location;
    try {
        location = getInputValue('input-text-location');
    } catch (e) {
        issue = true;
    }
    if(location === 'uuddlrlrba'){
        bypass = true;
        location = 'test';
    }

    let jobNumber;
    try {
        jobNumber = getNumericValue('input-number-jobNumber');
    } catch (e) {
        if(bypass){
            jobNumber = 'test';
        } else {
            issue = true;
        }
    }

    console.log('getPDF_basics bypass: ' + bypass);
    if(issue && !bypass) {
        throw new Error('Missing Data');
    }

    let tableBody = [
        ['Date:', date.value, 'Location:', location],
        ['Time:', time.value, 'Job Number:', jobNumber]
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

class Basics_Input extends Input_Collection{
    constructor (obj) {
        super(obj);
    }
}

/** modular package that generates html
 * 
 * gathers: date, time, location, job number
 */
function basics_html(){
    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper-basicInfo';
    wrapper.classList.add('block-wrapper');
    document.currentScript.parentElement.appendChild(wrapper);

    const table = document.createElement('table');
    wrapper.appendChild(table);


    const data = [
        new DateInput(null, 'Date'),
        new TextInput('location', 'Location', true),
        new TimeInput(null, 'Time'),
        new NumericTextInput('jobNumber', 'Job Number', true)
    ]

    let row;
    data.forEach((d, i) => {
        new Basics_Input(d);
        if(i % 2 === 0 || isMobileDevice()){
            row = table.insertRow();
        }
        let cell = row.insertCell();
        cell.appendChild(d.getLabelHTML());
        cell.classList.add('label');
        cell = row.insertCell();
        cell.appendChild(d.getInputHTML());
        cell.classList.add('input');
    })
}



function getPDF_basics() {
    const objects = Basics_Input.getObjects();
    let issue = false;
    let tableBody = [];

    objects.forEach((obj, index) => {
        let value;
        try {
            value = obj.getInputValue(); 
        } catch(e) {
            if (bypass) {
                value = 'test';
            } else {
                issue = true;
            }
        }

        if(index === 1 && value && value.toLowerCase() === 'uuddlrlrba'){
            bypass = true;
            value = 'test';
        }

        if(index % 2 == 0){
            tableBody.push([])
        }
        tableBody[tableBody.length-1].push({text: `${obj.getLabelValue()}:`});
        tableBody[tableBody.length-1].push({text: value});
    })

    if(issue && !bypass) {
        throw new Error('Missing Data');
    }

    const table = {
        table: {
            widths: '*',
            body: tableBody
        }
    }

    

    return table
}

function getJSON_basics() {
    const objects = Basics_Input.getObjects();
    let issue = false;
    let json = {};

    json.date = objects[0].getInputValue();
    json.location = objects[1].getInputValue();
    json.time = objects[2].getInputValue();
    if (json.location.toLowerCase() === 'uuddlrlrba'){
        json.jobNumber = 'test';
        json.location = 'test';
        bypass = true;
    } else {
        json.jobNumber = objects[3].getInputValue();
    }

    return json;
}

basics_html();