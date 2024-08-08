function createPDF(){
    const colours = {
        primary: '#f5f5f5',
        secondary: '#a8a8a8',
        accent: '#d32f2f',
        background: '#e8e8e8',
        textColor: '#333333'
    }

    pdfMake.fonts = {
        timesNewRoman: {
            normal: "times.ttf",
            bold: "timesbd.ttf",
            italics: "timesi.ttf",
            bolditalics: "timesbi.ttf"
        }
    }

    const basics = getBasicInfo();
    const ppe = getPPE();
    const hazards = getHazards()
    const signatures = getSignatures();

    const doc = {
        pageSize: 'A4',
        pageMargins: [30, 30, 30, 30],
        content: [
            basics,
            ppe,
            hazards,
            signatures
        ],
        defaultStyle: {
            font: 'timesNewRoman'
        },
        styles: {
            tableHeader: {
                fillColor: colours.textColor,
                color: colours.primary
            }
        }
    };

    pdfMake.createPdf(doc).download('DEMO.pdf');
}

function getBasicInfo(){ // done
    const date = document.getElementById('input-date').value;
    const location = document.getElementById('input-location').value;
    const jobNo = document.getElementById('input-jobnumber').value;
    let tableBody = [
        ['Date', 'Location', 'Job Number'],
        [date, location, jobNo]
    ]
    tableBody = tableBody.map((row, index) => {
        if(index===0){
            return row.map(cell => ({
                text: cell, alignment: 'center', style: 'tableHeader'
            }));
        } else {
            return row.map(cell => ({
                text: cell, alignment: 'center'
            }))
        }
    });

    const table = {
        table: {
            widths: '*',
            headerRows: 1,
            body: tableBody
        }
    }

    return table;
}

function getPPE(){ // done
    const data = document.getElementById('wrapper-PPErequired').querySelectorAll('input');
    let ppe = []
    data.forEach(item => {
        if(item.checked){
            const itemName = item.parentElement.querySelector('label').textContent;
            ppe.push({text: itemName, alignment: 'center'});
        }
    });
    let tableBody = []
    if (ppe.length === 0){
        return null;
    } else if (ppe.length > 5){
        let ppe2 = ppe.slice(5);
        let additionalElements = new Array(5-ppe2.length).fill({text: ''/* , border: [false, false, false, false] */});
        ppe2 = ppe2.concat(additionalElements);
        ppe = ppe.slice(0,5);
        let tableHeaders = Array.from({length: ppe.length}, () => {});
        tableHeaders[0]  = {text: 'PPE Required', style: 'tableHeader', colSpan: ppe.length, alignment: 'center'};
        tableBody = [
            tableHeaders,
            ppe,
            ppe2,
        ]
    } else {
        let tableHeaders = Array.from({length: ppe.length}, () => {});
        tableHeaders[0] = {text: 'PPE Required', style: 'tableHeader', colSpan: ppe.length, alignment: 'center'};
        tableBody = [
            tableHeaders,
            ppe
        ]
    }
    const tableWidths = Array.from({length: tableBody[0].length }, () => '*');
    const table = {
        table: {
            widths: tableWidths,
            headerRows: 1,
            body: tableBody
        },
        layout: {
            hLineWidth: function (i, node) {
                return (i === 0 || i === node.table.body.length) ? 1:0;
            },
            vLineWidth: function (i, node) {
                return (i === 0 || i === node.table.widths.length) ? 1:0;
            }
        }
    }

    return table;
}

function getHazards(){ // done
    const body = document.getElementById('table-hazards').querySelector('tbody');
    const rows = body.querySelectorAll('tr');

    let tasks = [];
    rows.forEach(row => {
        let packet = {};

        // get tasks
        const task_data = row.querySelector('input');
        packet.data = {value: task_data.value, id: task_data.id}

        // get hazards
        let hazards = []
        let totalsize = 0
        const hazard_nodeList = row.querySelector('ul').querySelectorAll('input');
        hazard_nodeList.forEach(hazard => {
            let packet = {};
            packet.data = {value: hazard.value, id: hazard.id};

            // get controls
            let controls = [];
            let total_controls = 0
            const control_nodeList = document.getElementById(`wrapper${packet.data.id.slice(5)}-controls`).querySelectorAll('input');
            control_nodeList.forEach(control => {
                let packet = {};
                packet.data = {value: control.value, id: control.id};
                controls.push(packet);
                total_controls++;
            });
            packet.controls = controls;
            packet.totalsize = total_controls;
            totalsize += total_controls;

            hazards.push(packet);
        });
        packet.hazards = hazards;
        packet.totalsize = totalsize;

        tasks.push(packet);
    })

    let tableBody = [];
    tableBody.push([
        {text: 'Tasks', style: 'tableHeader', alignment: 'center'},
        {text: 'Hazards', style: 'tableHeader', alignment: 'center'},
        {text: 'Controls', style: 'tableHeader', alignment: 'center'},
    ]);
    tasks.forEach((task, i) => {
        task.hazards.forEach((hazard, j) => {
            const hazard_rowSpawn = hazard.totalsize;
            hazard.controls.forEach((control, k) => {
                if (k===0) {
                    if (j===0) {
                        tableBody.push([
                            {text: task.data.value, rowSpan: task.totalsize},
                            {text: hazard.data.value, rowSpan: hazard.totalsize},
                            {text: control.data.value}
                        ]);
                    } else {
                        tableBody.push([
                            {},
                            {text: hazard.data.value, rowSpan: hazard.totalsize},
                            {text: control.data.value}
                        ]);
                    }
                } else {
                    tableBody.push([
                        {},
                        {},
                        {text: control.data.value}
                    ]);
                }
            });
        });
    });

    const tableWidths = Array.from({length: tableBody[0].length }, () => '*');
    const table = {
        table: {
            widths: tableWidths,
            headerRows: 1,
            body: tableBody
        }
    }

    return table;
}

function getSignatures(){
    let tableBody = [];

    const signature_width = (595.35 - (60 + 20))/2; // (page_width - (page_margins + other_margins))/num_columns;
    // start with assessor
    // assessor header
    tableBody.push(
        [
            {text: 'Assessed by:', style: 'tableHeader', colSpan: 2, alignment: 'center'},
            {}
        ],
        [
            {text: 'Name', style: 'tableHeader', alignment: 'center'},
            {text: 'Signature', style: 'tableHeader', alignment: 'center'},
        ]
    )
    // get assessor
    // wrapper-assessor will contain two .horizontal-wrappers, the first is the header
    const assessor_wrapper = document.getElementById('wrapper-assessor-body').querySelectorAll('.horizontal-wrapper')[1];
    const assessor_input = assessor_wrapper.querySelector('input').value;
    const assessor_signature = signature_pads.assessor1.toDataURL('image/png');
    
    tableBody.push(
        [
            {text: assessor_input, alignment: 'center'},
            {image: assessor_signature, width: signature_width}
        ]
    );

    tableBody.push(
        [
            {text: 'Reviewed by:', style: 'tableHeader', colSpan: 2, alignment: 'center'},
            {}
        ],
        [
            {text: 'Name', style: 'tableHeader', alignment: 'center'},
            {text: 'Signature', style: 'tableHeader', alignment: 'center'},
        ]
    )

    // get reviewers
    const reviewer_wrappers = Array.from(document.getElementById('wrapper-reviewer-body').querySelectorAll('.horizontal-wrapper'));
    reviewer_wrappers.shift();
    const signature_keys = Object.keys(signature_pads);
    signature_keys.shift();
    const reviewer_inputs = reviewer_wrappers.map(wrapper => {
        return wrapper.querySelector('input').value;
    })
    signature_keys.forEach((key, index) => {
        const signature = signature_pads[key].toDataURL('image/png');
        tableBody.push(
            [
                {text: reviewer_inputs[index], alignment: 'center'},
                {image: signature, width: signature_width}
            ]
        );
    });



    const tableWidths = Array.from({length: tableBody[0].length }, () => '*');
    const table = {
        table: {
            widths: tableWidths,
            headerRows: 1,
            body: tableBody
        }
    }

    return table;
}

function addSubmitButton(){ // done
    const btn_submit = document.createElement('button');
    btn_submit.textContent = 'Submit as PDF';
    btn_submit.onclick = () => createPDF();
    document.body.appendChild(btn_submit);
}


addSubmitButton();