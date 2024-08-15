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

    const basics = getPDF_basics();
    const weather = getPDF_weather();

    const doc = {
        pageSize: 'A4',
        pageMargins: [30, 30, 30, 30],
        content: [
            basics,
            weather
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

    pdfMake.createPdf(doc).download('DEMO.pdf');

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