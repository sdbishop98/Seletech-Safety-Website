function createPDF(){

    // const pdfMake = require('pdfmake/build/pdfmake.js');
    // require('pdfmake/build/vfs_fonts.js');
    
    const btn = document.getElementById('button-submit');
    btn.style.backgroundColor = 'darkkhaki';
    btn.textContent = 'Working... please wait';
    
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
    
    let data;
    try {
        data = getData()
        btn.style.backgroundColor = 'seagreen';
        btn.textContent = 'Data revieved - creating PDF... please wait'
    } catch (e) {
        console.log(e);
        btn.style.backgroundColor = 'darkred';
        btn.textContent = 'ERROR - required fields missing';
        return
    }
    
    const doc = {
        pageSize: 'A4',
        pageMargins: [30, 30, 30, 30],
        content: [
            data.basics,
            data.weather,
            data.scope,
            data.ppe,
            data.hazards,
            data.signatures
        ],
        defaultStyle: {
            font: 'timesNewRoman'
        },
        styles: {
            tableHeader: {
                fillColor: colours.textColor,
                color: colours.primary
            },
            header: {
                fillColor: colours.textColor,
                color: colours.primary
            },
            body: {
                colours: colours.textColor
            }
        }
    };

    const pdf = pdfMake.createPdf(doc)

    upload_PDF(pdf, make_fileName());
    

    btn.style.backgroundColor = 'mediumpurple';
    btn.textContent = 'The PDF has been created. You may safely close the window.'

    function getData(){
        const data = {}
        let issue = false;
        let testIssue = false;

        try {
            data.basics = getPDF_basics();
        } catch (e) {
            issue = true;
            console.log('MISSING - basics')
        }
        try {
            data.weather = getPDF_weather();
        } catch (e) {
            issue = true;
            console.log('MISSING - weather')
        }
        try {
            data.scope = getPDF_scope();
        } catch (e) {
            issue = true;
            console.log('MISSING - scope')
        }
        try {
            data.ppe = getPDF_ppe(); 
        } catch (e) {
            issue = true;
            console.log('MISSING - ppe')
        }
        try {
            data.hazards = getPDF_hazards();
        } catch (e) {
            issue = true;
            console.log('MISSING - hazards')
        }
        try {
            if(bypass){
                data.signatures = {}
            } else {
                data.signatures = getPDF_signatures();
            }
        } catch (e) {
            issue = true;
            testIssue = true;
            console.log('MISSING - signatures')
        }
        if(issue && !bypass) {
            throw new Error('missing data');
        } else if (testIssue) {
            throw new Error('missing signatures');
        } else {
            return data;
        }
    }

    function make_fileName(){
        const date = document.getElementById('input-date').value;
        const time = document.getElementById('input-time').value;
        if (!bypass) {
            const jobNumber = document.getElementById('input-text-numeric-jobNumber').value;
            
            const location  = document.getElementById('input-text-location').value;
            const name = document.getElementById('input-text-signBlock_assessor_0').value;

            return `FLHA_${jobNumber}${location}_${name}_${date}_${time}`;
        } else {
            return `TEST-DISREGARD_${date}_${time}`;
        }
        
    }

    function upload_PDF(pdf, fileName){
        console.log('uploading pdf');
        // pdf.getBase64(function(base64) {
        //     console.log('made it 1');
        //     uploadToDrive(base64, fileName);
        // });
        pdf.getBase64((data) => {
            console.log('made it 1');
            uploadToDrive(data, fileName);
        })

        

        function uploadToDrive(base64, fileName) {
            console.log('made it 2');
            if(!bypass){
                fetch('https://script.google.com/macros/s/AKfycbz-VEUcuC0rzFkvESOHO6VJ2NTzcIPGSIyX___cU3gZnQ1hTbAbmMUR8Av7t0tdRAs3Aw/exec', {
                    method: 'POST',
                    body: new URLSearchParams({
                        type: 'pdf',
                        name: fileName,
                        content: base64
                    })
                })
                .then(response => response.text())
                .then(data => console.log(data))
                console.log('PDF sent to google services');
            }
            
            // const download = document.querySelector('input[name="download"]:checked').value;
            const download = RadioInput.getValueByName('download');
            if(download === 'Yes') {
                pdf.download(make_fileName());
            }
        }
    }
}


function submit_html(){
    // modular package that generates html
    // gathers scope of work
    // utilizes helper functions in order to keep things tidy
    // INPUT:   none
    // RETURN:  none
    const wrapper = document.createElement('div');
    wrapper.classList.add('block-wrapper');
    document.body.appendChild(wrapper);

    const wrapper_download = document.createElement('div');
    wrapper_download.style.display = 'flex';
    wrapper_download.style.flexDirection = 'row';
    wrapper_download.style.padding = '3px';
    
    wrapper.appendChild(wrapper_download);

    const downloadyn = new RadioInput('download', ['Yes', 'No'], 'Do you wish to download a copy for yourself?');
    downloadyn.setDefault(1);
    wrapper_download.appendChild(downloadyn.getLabelHTML());
    downloadyn.getInputHTML().forEach(option => {
        wrapper_download.appendChild(option);
    })

    const btn_submit = document.createElement('button');
    btn_submit.id = 'button-submit';
    btn_submit.textContent = 'SUBMIT';
    btn_submit.classList.add('fill');
    btn_submit.style.padding = '5px';
    btn_submit.style.borderRadius = '10px';
    btn_submit.onclick = () => createPDF();
    wrapper.appendChild(btn_submit);
    
}

submit_html();

document.addEventListener('change', function(event) {
    const btn = document.getElementById('button-submit');

    if(btn.style.backgroundColor === 'darkred'){
        btn.style.backgroundColor = 'mediumpurple';
        btn.textContent = 'SUBMIT';
    }
})