function ppe_html(){
    // modular package that generates html
    // gathers scope of work
    // utilizes helper functions in order to keep things tidy
    // INPUT:   none
    // RETURN:  none

    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper-ppe';
    wrapper.classList.add('block-wrapper');
    document.body.appendChild(wrapper);

    const table = document.createElement('table');
    wrapper.appendChild(table);

    // TITLE - ppe required
    const row_title = table.insertRow();
    const cell_title = row_title.insertCell();
    cell_title.textContent = 'PPE REQUIRED';
    cell_title.colSpan = 2;


    const options = [
        ['Yes (at all times)', 'Yes (as needed)', 'No'],
        ['Yes', 'No'],
        ['Yes (always required)']
    ];
    // ppe items
    create_row_radioInput_html(
        table, 
        'Hard Hat', 
        options[0],
        'ppe-hardHat',
        'ppeHardHat'
    );
    create_row_radioInput_html(
        table,
        'Hard Hat Tether',
        options[1],
        'ppe-hardHatTether',
        'ppeHardHatTether'
    );
    create_row_radioInput_html(
        table,
        'CSA Safety Glasses',
        options[0],
        'ppe-safetyGlasses',
        'ppeSafetyGlasses'
    );
    create_row_radioInput_html(
        table,
        'Face Shield',
        options[1],
        'ppe-faceShield',
        'ppeFaceShield'
    );
    create_row_radioInput_html(
        table,
        'Respiratory Protection / Mask',
        options[0],
        'ppe-respirator',
        'ppeRespirator'
    );
    create_row_radioInput_html(
        table,
        'Hearing Protection',
        options[0],
        'ppe-hearingProtection',
        'ppeHearingProtection'
    );
    create_row_radioInput_html(
        table,
        'High Visibility Clothing',
        options[0],
        'ppe-hiVis',
        'ppeHiVis'
    );
    create_row_radioInput_html(
        table,
        'Long Pants',
        options[2],
        'ppe-longPants',
        'ppeLongPants'
    );
    create_row_radioInput_html(
        table,
        'FR Clothing',
        options[1],
        'ppe-FR',
        'ppeFR'
    );
    create_row_radioInput_html(
        table,
        'Arc Flash Suit',
        options[1],
        'ppe-arc',
        'ppeArc'
    );
    create_row_radioInput_html(
        table,
        'Insulated Gloves',
        options[1],
        'ppe-insulatedGloves',
        'ppeInsulatedGloves'
    );
    create_row_radioInput_html(
        table,
        'Insulated Tools',
        options[1],
        'ppe-insulatedTools',
        'ppeInsulatedTools'
    );
    create_row_radioInput_html(
        table,
        'Work Gloves',
        options[0],
        'ppe-workGloves',
        'ppeWorkGloves'
    );
    create_row_radioInput_html(
        table,
        'CSA footwear (steel toes)',
        options[2],
        'ppe-footwear',
        'ppeFootwear'
    );



    function create_row_radioInput_html(table, question, options, name, identifier){
        const row = table.insertRow();

        const cell_label = row.insertCell();
        cell_label.textContent = question;


        const identifiers = options.map(option => {
            const match = option.match(/\((.*?)\)/);
            if(match){
                return `${identifier}-${toCamelCase(match[1])}`;
            } else {
                return `${identifier}-${option.toLowerCase()}`;
            }
        });
        
        const inputLabels = makeRadioInputLabelPairs(
            name,
            identifiers,
            options,
            true
        )
        const cell_input = row.insertCell();

        if(isMobileDevice()) {
            const wrapper_input = document.createElement('div');
            cell_input.appendChild(wrapper_input);
            inputLabels.forEach(item => {
                wrapper_input.appendChild(item.label);
                item.label.insertBefore(item.input, item.label.firstChild);
            });
            wrapper_input.style.display = 'flex';
            wrapper_input.style.flexDirection = 'column';
        } else {
            inputLabels.forEach(item => {
                cell_input.appendChild(item.label);
                item.label.insertBefore(item.input, item.label.firstChild);
            })
        }
        
        return row;
    }
}

function getPDF_ppe() {
    let issue = false;

    let hardHat;
    try {
        hardHat = getRadioInput('ppe-hardHat');
    } catch (e) {
        issue = true;
    }
    let hardHatTether;
    try {
        hardHatTether = getRadioInput('ppe-hardHatTether');
    } catch (e) {
        issue = true;
    }
    let safetyGlasses;
    try {
        safetyGlasses = getRadioInput('ppe-safetyGlasses');
    } catch (e) {
        issue = true;
    }
    let faceShield;
    try {
        faceShield = getRadioInput('ppe-faceShield');
    } catch (e) {
        issue = true;
    }
    let respirator;
    try {
        respirator = getRadioInput('ppe-respirator');
    } catch (e) {
        issue = true;
    }
    let hearingProtection;
    try {
        hearingProtection = getRadioInput('ppe-hearingProtection');
    } catch (e) {
        issue = true;
    }
    let hiVis;
    try {
        hiVis = getRadioInput('ppe-hiVis');
    } catch (e) {
        issue = true;
    }
    let longPants;
    try {
        longPants = getRadioInput('ppe-longPants');
    } catch (e) {
        issue = true;
    }
    let fr;
    try {
        fr = getRadioInput('ppe-FR');
    } catch (e) {
        issue = true;
    }
    let arc;
    try {
        arc = getRadioInput('ppe-arc');
    } catch (e) {
        issue = true;
    }
    let insulatedGloves;
    try {
        insulatedGloves = getRadioInput('ppe-insulatedGloves');
    } catch (e) {
        issue = true;
    }
    let insulatedTools;
    try {
        insulatedTools = getRadioInput('ppe-insulatedTools');
    } catch (e) {
        issue = true;
    }
    let workGloves;
    try {
        workGloves = getRadioInput('ppe-workGloves');
    } catch (e) {
        issue = true;
    }
    let footwear;
    try {
        footwear = getRadioInput('ppe-footwear');
    } catch (e) {
        issue = true;
    }

    if(issue) {
        throw new Error('Missing Data - PPE');;
    }

    return [
        {text: ' '},
        'PPE REQUIRED',
        {
            table: {
                widths: '*',
                body: [
                    ['Hard Hat', hardHat],
                    ['Hard Hat Tether', hardHatTether],
                    ['CSA Safety Glasses', safetyGlasses],
                    ['Face Shield', faceShield],
                    ['Respiratory Protection / Mask', respirator],
                    ['Hearing protection', hearingProtection],
                    ['High Visibility Clothing', hiVis],
                    ['Long Pants', longPants],
                    ['FR Clothing', fr],
                    ['Arc Flash Suit', arc],
                    ['Insulated Gloves', insulatedGloves],
                    ['Insulated Tools', insulatedTools],
                    ['Work Gloves', workGloves],
                    ['CSA footwear (steel toes)', footwear]
                ]
            },
            layout: 'noBorders'
        }
    ]   
}

ppe_html();