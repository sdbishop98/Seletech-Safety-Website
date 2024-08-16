function ppe_html(){
    // modular package that generates html
    // gathers scope of work
    // utilizes helper functions in order to keep things tidy
    // INPUT:   none
    // RETURN:  none

    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper-ppe';
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
                return `${identifier}-${match[1]}`
            } else {
                return `${identifier}-${option.toLowerCase()}`;
            }
        })
        const inputLabels = makeRadioInputLabelPairs(
            name,
            identifiers,
            options
        )
        const cell_input = row.insertCell();
        inputLabels.forEach(item => {
            // const cell_input = row.insertCell();
            cell_input.appendChild(item.label);
            item.label.insertBefore(item.input, item.label.firstChild);
        })
        
        return row;
    }
}

ppe_html();