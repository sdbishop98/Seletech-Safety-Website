// import dependancies
const SignaturePad = window.SignaturePad;

// global variables
let signature_pads = {};

function signature_block(){
    /* SET STYLE SHEET */
    link_stylesheet('css/main.css');
    // link_stylesheet('css/signature_block.css');

    const wrapper = document.createElement('div');
    wrapper.classList.add('vertical-wrapper');
    wrapper.id = 'wrapper-signatures';
    document.body.appendChild(wrapper);

    wrapper.appendChild(create_assessor());
    wrapper.appendChild(create_reviewers());

}

function create_assessor(){
    // create wrapper
    const wrapper = document.createElement('div');
    wrapper.classList.add('vertical-wrapper');
    wrapper.id = 'wrapper-assessor';

    // create title
    const header = document.createElement('h2');
    header.textContent = 'Assessed by:';
    wrapper.appendChild(header);

    // create the spot for signing
    wrapper.appendChild(create_signatureSegment('assessor'));
    return wrapper;
}

function create_reviewers(){
    // create wrapper
    const wrapper = document.createElement('div');
    wrapper.classList.add('vertical-wrapper');
    wrapper.id = 'wrapper-reviewers';

    // create title
    const header = document.createElement('h2');
    header.textContent = 'Reviewed by:';
    wrapper.appendChild(header);

    // create the spot for signing
    const signature_wrapper = document.createElement('div');
    wrapper.appendChild(signature_wrapper);
    signature_wrapper.appendChild(create_signatureSegment('reviewer'));

    // create the buttons
    const btn_add = document.createElement('button');
    btn_add.textContent = 'Add Person'; // replace with pictogram
    btn_add.onclick = addReviewer;
    signature_wrapper.appendChild(btn_add);

    const btn_remove = document.createElement('button');
    btn_remove.textContent = 'Remove Person'; // replace with pictorgram
    btn_remove.onclick = removeReviewer;
    signature_wrapper.appendChild(btn_remove);



    return wrapper;
}

function create_signatureSegment(id){
    // best to create it row by row
    // starting with the headers
    const wrapper = document.createElement('div');
    wrapper.id = `wrapper-${id}-body`;
    wrapper.classList.add('vertical-wrapper');
    // row 1: headers
    const row_headers = document.createElement('div');
    row_headers.classList.add('horizontal-wrapper');
    wrapper.appendChild(row_headers);

    const label_name = document.createElement('label');
    label_name.textContent = 'Name';
    label_name.classList.add('signature-input')
    row_headers.appendChild(label_name);

    const label_signature = document.createElement('label');
    label_signature.textContent = 'Signature';
    label_signature.classList.add('signature-input')
    row_headers.appendChild(label_signature);
    // row 2: signature + name
    wrapper.appendChild(create_signatureRow(`${id}1`));

    return wrapper;
}

function create_signatureRow(id){
    const wrapper = document.createElement('div');
    wrapper.id = `wrapper-signatureRow-${id}`;
    wrapper.classList.add('horizontal-wrapper');

    const input = document.createElement('input');
    input.type = 'text';
    input.id = `input-${id}-name`;
    input.classList.add('signature-input');
    wrapper.appendChild(input);
    wrapper.appendChild(create_signaturePad(id));

    return wrapper;
}

function create_signaturePad(id){
    const wrapper = document.createElement('div');
    wrapper.classList.add('canvas-wrapper');

    const canvas = document.createElement('canvas');
    wrapper.appendChild(canvas);
    
    const sp = new SignaturePad(canvas, {
        backgroundColor: '#e8e8e8'
    });
    signature_pads[id] = sp;

    const btn = document.createElement('button');
    btn.textContent = 'Clear';
    btn.tabIndex = -1;
    btn.onclick = () => sp.clear();
    wrapper.appendChild(btn);

    return wrapper;
}


function addReviewer(){
    const wrapper = document.getElementById('wrapper-reviewer-body')
    const keys = Object.keys(signature_pads);
    const id = `reviewer${keys.length}`;
    wrapper.appendChild(create_signatureRow(id));
    resizeCanvas()
}

function removeReviewer(){
    // const wrapper = document.getElementById('wrapper-reviewer-body')
    const keys = Object.keys(signature_pads);
    if(keys.length > 2){
        const key = keys[keys.length-1];
        const id = `wrapper-signatureRow-reviewer${keys.length-1}`;
        const wrapper = document.getElementById(id);
        wrapper.remove();
        delete signature_pads[key];
    } else {
        console.log('Error: There must be at least one reviewer');
    }
}

function resizeCanvas(){
    const wrappers = document.querySelectorAll('.canvas-wrapper');
    const ratio = Math.max(window.devicePixelRatio || 1, 1);

    wrappers.forEach((wrapper, index) => {
        const canvas = wrapper.querySelector('canvas');
        const oldWidth = canvas.width;
        const oldHeight = canvas.height;
        const key = Object.keys(signature_pads)[index];
        const data = signature_pads[key].toData();

        // this part causes the canvas to be cleared
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext('2d').scale(ratio, ratio);

        // scale the signature
        const scaleX = canvas.width / oldWidth;
        const scaleY = canvas.height / oldHeight;
        const scaledData = data.map(group => ({
            ...group,
            points:
            group.points.map(point => ({
                x: point.x * scaleX,
                y: point.y * scaleY,
                pressure: point.pressure,
                time: point.time
            })),
            maxWidth: group.maxWidth * Math.min(scaleX, scaleY),
            minWidth: group.minWidth * Math.min(scaleX, scaleY),
        }));
        signature_pads[key].fromData(scaledData);
    })

}
// window.onresize = resizeCanvi;
window.addEventListener('resize', function() {
    // console.log('Window resized');
    resizeCanvas();
})
window.addEventListener('load', function() {
    // console.log(`window is loaded\nSignature Pad Keys: \n${Object.keys(signature_pads)}`);
    resizeCanvas();

})



signature_block();