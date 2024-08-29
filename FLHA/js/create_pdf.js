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
    
    let data;
    try {
        data = getData()
    } catch (e) {
        console.log(e);
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

    console.log(upload_PDF(pdf, make_fileName()));

    pdf.download(make_fileName());

    function getData(){
        const data = {}
        let issue = false;

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
            console.log('MISSING - weathet')
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
            data.signatures = getPDF_signatures();
        } catch (e) {
            issue = true;
            console.log('MISSING - signatures')
        }
        if(issue) {
            throw new Error('missing data');
        } else {
            return data;
        }
    }

    function make_fileName(){
        const jobNumber = document.getElementById('input-number-jobNumber').value;
        const date = document.getElementById('input-date').value;
        const time = document.getElementById('input-time').value;

        return `FLHA_${jobNumber}_${date}_${time}`;
    }

    function upload_PDF(pdf, fileName){
        console.log('uploading pdf');
        pdf.getBase64(function(base64) {
            uploadToDrive(base64, fileName);
        });



        function uploadToDrive(base64, fileName) {
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
            console.log('PDF sent to google services')
        }
    }
}


function submit_html(){
    // modular package that generates html
    // gathers scope of work
    // utilizes helper functions in order to keep things tidy
    // INPUT:   none
    // RETURN:  none

    const btn_submit = document.createElement('button');
    btn_submit.textContent = 'Submit';
    btn_submit.onclick = () => createPDF();
    document.body.appendChild(btn_submit);
}

submit_html();