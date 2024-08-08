function ppe_block(){
    const ppe = [
        ['Hearing protection', 'hearingProtection'], 
        ['Cut-resistant gloves', 'cutResitantGloves'], 
        ['Hard Hat', 'hardHat'],
        ['Wet-condition clothes/footwear', 'wetConditionCloths'],
        ['Respiratory protection', 'respiratoryProctection'],
        ['Safety-toed footwear', 'steelToes'],
        ['Face Shield', 'faceShield'],
        ['Fall Protection', 'fallProtection'],
        ['Safety Glasses', 'safetyGlasses']
    ]

    link_stylesheet('css/main.css');

    const wrapper = document.createElement('div');
    wrapper.classList.add('vertical-wrapper');
    wrapper.id = 'wrapper-PPErequired';
    document.body.appendChild(wrapper);

    const header = document.createElement('h2');
    header.textContent = 'PPE Required';
    wrapper.appendChild(header);

    create_checkboxes(wrapper, ppe);
}

function create_checkboxes(parent, items){
    const wrapper = document.createElement('div');
    wrapper.classList.add('grid-wrapper');
    parent.appendChild(wrapper);
    let largest = 0;
    for(let i=0; i<items.length; i++){
        const sub_wrapper = document.createElement('div');
        wrapper.appendChild(sub_wrapper);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `input-${items[i][1]}`;
        sub_wrapper.appendChild(checkbox);

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = items[i][0];
        sub_wrapper.appendChild(label);

        sub_wrapper.onclick = function(event) {
            if (event.target !== checkbox && event.target !== label){
                checkbox.checked = !checkbox.checked;
                event.stopPropagation();
            }
        };

        largest = Math.max(largest, label.offsetWidth);
    }
    wrapper.style.gridTemplateColumns = `repeat(auto-fit, minmax(${largest + 20}px, 1fr))`;
}

ppe_block();