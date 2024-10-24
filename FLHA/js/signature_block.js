/** generates the html for the signature block
 */
function signatures_html_OLD() {    
    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper-signatures';
    wrapper.classList.add('block-wrapper');
    document.body.appendChild(wrapper);
    
    // CREATE ASSESS SEGMENT
    const assessor = {}
    assessor.table = document.createElement('table');
    assessor.table.classList.add('signature');
    assessor.body = document.createElement('tbody');
    assessor.body.appendChild(create_signature_segment('assessor'));
    assessor.head = document.createElement('thead');
    assessor.table.appendChild(assessor.head);
    assessor.table.appendChild(assessor.body);

    let title = assessor.head.insertRow().insertCell();
    title.textContent = 'Assessed By:';

    wrapper.appendChild(assessor.table);


    // CREATE REVIEW SEGMENT
    const reviewSeg = {};
    reviewSeg.table = document.createElement('table');
    reviewSeg.table.classList.add('signature');

    reviewSeg.head = document.createElement('thead');
    title = reviewSeg.head.insertRow().insertCell();
    title.textContent = 'Reviewed By:';
    if(!isMobileDevice()) {
        title.colSpan = 2;
    }
    reviewSeg.table.appendChild(reviewSeg.head);

    const reviewers = [];

    reviewSeg.body = document.createElement('tbody');
    reviewSeg.subBody = document.createElement('tbody');
    reviewSeg.body.appendChild(reviewSeg.subBody);
    addReviewer(reviewers, reviewSeg.subBody);
    reviewSeg.table.appendChild(reviewSeg.body);

    // buttons
    const btn_wrapper = document.createElement('div');
    btn_wrapper.style.display = 'flex';
    if(isMobileDevice()){
        btn_wrapper.style.flexDirection = 'column';
    } else {
        btn_wrapper.style.flexDirection = 'row';
    }
    reviewSeg.body.appendChild(btn_wrapper);
    const btn_add = document.createElement('button');
    btn_add.classList.add('fill');
    btn_add.textContent = 'ADD REVIEWER';
    btn_add.onclick = () => addReviewer(reviewers, reviewSeg.subBody);
    btn_wrapper.appendChild(btn_add);
    const btn_remove = document.createElement('button');
    btn_remove.classList.add('fill');
    btn_remove.textContent = 'REMOVE REVIEWER';
    btn_remove.onclick = () => removeReviewer(reviewers, reviewSeg.subBody);
    btn_wrapper.appendChild(btn_remove);;


    wrapper.appendChild(reviewSeg.table);

    // HELPERS
    function addReviewer(reviewers, body) {
        let cell;
        if(isMobileDevice()){
            cell = body.insertRow().insertCell();
        } else {
            if(reviewers.length % 2 === 0) {
                cell = body.insertRow().insertCell();
            } else {
                cell = body.lastElementChild.insertCell();
            }
        }
        cell.style.padding = '0';
        
        const review = create_signature_segment(`reviewer${reviewers.length}`)
        reviewers.push(review);

        cell.appendChild(review);
    }

    function removeReviewer(reviewers, body) {
        // console.log(Modal_SignaturePad.getInstances())
        if(reviewers.length <=1) {
            alert('Error: Must have at least one reviewer');
            return;
        }
        
        const row = body.lastElementChild;
        if(isMobileDevice()){
            row.remove();
        } else {
            if(reviewers.length % 2 === 1){
                row.remove();
            } else {
                const cell = row.lastElementChild;
                cell.remove();
            }
        }
        reviewers.pop();
        Modal_SignaturePad.removeLast();
        // console.log(Modal_SignaturePad.getInstances())
    }

    /** creates a table body containing a text input and signature modal input
     * 
     * @param {string} id - a unique identifier
     * 
     *      will be mixed into other strings for html IDs
     * @returns {HTMLTableElement} - a wrapper containing the signature segment
     */
    function create_signature_segment(id) {
        const name = makeTextInputLabelPair(`name-${id}`, 'Name');

        let body = document.createElement('tbody');
        body.classList.add('signature');

        let row = body.insertRow();
        let cell = row.insertCell(); 

        cell.appendChild(name.label);
        cell.classList.add('accent');
        cell.style.borderTopLeftRadius = '10px';
        cell.style.padding = '0.1rem';

        // get the height
        document.body.appendChild(body);
        const height = cell.offsetHeight * 2;
        document.body.removeChild(body);

        const modal = new Modal_SignaturePad(id, height);

        cell = row.insertCell();
        modal.getHTML().style.height = height + 'px';
        cell.appendChild(modal.getHTML());
        cell.classList.add('secondary');
        cell.style.borderRadius = '0 10px 10px 0';
        cell.rowSpan = 2;

        row = body.insertRow();
        cell = row.insertCell();
        cell.appendChild(name.input);
        cell.classList.add('accent');
        cell.style.borderBottomLeftRadius = '10px';
        name.input.style.borderRadius = '0 0 0 5px';

        return body;
    }
}

function getPDF_signatures_OLD(){
    class SignatureBlock {
        constructor(modal, suppress = false) {
            const fit = [100, 100];
            this.modal = modal;
            this.sp = modal.getSignaturePad();
            try {
                this.png = this.sp.getPNG_URL(suppress);
            } catch (e) {
                console.log(modal.getHTML());
                modal.getHTML().classList.add('error');
                throw new Error('Missing signature');
            }
            this.wrapper = getAncestorWithTag(modal.getHTML(), 'tbody');
            this.name = this.wrapper.querySelector('input').value;
            this.table = {
                table: {
                    body: [
                        [{text: 'Name'}, {image: this.png, fit: fit, rowSpan: 2}],
                        [{text: this.name}, {text: ' '}]
                    ]
                }
            }
        }
        getName() {
            return this.name;
        }
        getSignature() {
            return this.png;
        }
        getTable() {
            return this.table;
        }
    }
    
    const tableBody = [];
    
    const modals = Modal_SignaturePad.getInstances();
    
    Array.from(modals).forEach((modal, index) => {
        if (index === 0) {
            tableBody.push([{text: 'Assessed By:', colSpan: 2}, {text: ' '}]);
            const assessor = new SignatureBlock(modal);
            tableBody.push([assessor.getTable(), {}]);
            tableBody.push([{text: 'Reviewed By:', colSpan: 2}, {text: ' '}])
        } else {
            const reviewer = new SignatureBlock(modal, true);
            const table = reviewer.getTable();
            if(index % 2 === 1) {
                tableBody.push(
                    [table, '']
                );
            } else {
                tableBody[tableBody.length - 1][1] = table;
            }
        }
        
    })
    return {
        table: {
            body: tableBody
        },
        layout: 'noBorders'
    }
}   

class Signature_Block{
    static #instances = [];
    constructor(id, required = false){
        this.id = `signBlock_${id}`;
        this.required = required;
        this.segments = [];

        this.wrapper = document.createElement('div');
        this.wrapper.id = `wrapper_${this.id}`;

        this.table = document.createElement('table');
        this.wrapper.appendChild(this.table);
        this.table.classList.add('signature');
        this.head = document.createElement('thead');
        this.body = document.createElement('tbody');
        this.table.appendChild(this.body);
        this.table.appendChild(this.head);

        Signature_Block.#instances.push(this);
    }

    static getInstances() {
        return this.#instances;
    }

    getHTML(){
        return this.wrapper;
    }

    getSegments(){
        return this.segments;
    }

    getPDF_Segments(){
        let bodies = [];
        this.segments.forEach(seg => {
            let png;
            try {
                png = seg.signature.getPNG_URL();
            } catch (e) {
                throw new Error('Missing Signature');
            }
            const fit = [100, 100];
            const body = [
                [{text: 'Name'}, {image: png, fit: fit, rowSpan: 2}],
                [{text: seg.name.getInputValue()}, {text: ''}]
            ]
            bodies.push(body);
        })
        // console.log(bodies);
        return bodies;
    }
    /**
     * 
     * @param {string} title 
     */
    setTitle(title){
        const cell = this.head.insertRow().insertCell();
        cell.textContent = title;
    }

    addSegment(){
        const id = `${this.id}_${this.segments.length}`;
        const name = new TextInput(id, 'Name:', this.required);

        let tbody = document.createElement('tbody');
        tbody.classList.add('signature');

        let row = tbody.insertRow();
        let cell = row.insertCell();

        cell.appendChild(name.getLabelHTML());
        cell.classList.add('accent');
        cell.style.borderTopLeftRadius = '10px'
        cell.style.padding = '0.1rem';

        // get the height
        document.body.appendChild(tbody);
        const height = cell.offsetHeight * 2;
        document.body.removeChild(tbody);

        const modal = new Modal_SignaturePad(id, height);

        cell = row.insertCell();
        modal.getHTML().style.height = height + 'px';
        cell.appendChild(modal.getHTML());
        cell.classList.add('secondary');
        cell.style.borderRadius = '0 10px 10px 0';
        cell.rowSpan = 2;

        row = tbody.insertRow();
        cell = row.insertCell();
        cell.appendChild(name.getInputHTML());
        cell.classList.add('accent');
        cell.style.borderBottomLeftRadius = '10px';
        name.getInputHTML().style.borderRadius = '0 0 0 5px';

        this.body.appendChild(tbody);
        this.segments.push({signature: modal.getSignaturePad(), name: name});
    }
    removeSegment(){
        if(this.segments.length <= 1) {
            console.log('Error: Must have at least one reviewer');
            return;
        }
        
        const row = this.body.lastElementChild;
        row.remove();
        this.segments.pop();
    }

    addButtons(text = null){
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        if(isMobileDevice()){
            wrapper.style.flexDirection = 'column';
        } else {
            wrapper.style.flexDirection = 'row';
        }
        this.table.appendChild(wrapper);

        if(text){
            text = ` ${text}`;
        } else {
            text = '';
        }

        const btn_add = document.createElement('button');
        btn_add.classList.add('fill');
        btn_add.textContent = `ADD${text}`;
        btn_add.onclick = () => this.addSegment();
        wrapper.appendChild(btn_add);

        const btn_remove = document.createElement('button');
        btn_remove.classList.add('fill');
        btn_remove.classList.add('fill');
        btn_remove.textContent = `REMOVE${text}`;
        btn_remove.onclick = () => this.removeSegment();
        wrapper.appendChild(btn_remove);

    }
    
}

function signatures_html(){
    

    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper-scopeOfWork';
    wrapper.classList.add('block-wrapper');
    document.currentScript.parentElement.appendChild(wrapper);

    const assessor = new Signature_Block('assessor');
    assessor.setTitle('Assessed By:');
    assessor.addSegment();
    wrapper.appendChild(assessor.getHTML());
    
    const reviewer = new Signature_Block('reviewer');
    reviewer.setTitle('Reviewed By:');
    reviewer.addSegment();
    wrapper.appendChild(reviewer.getHTML());

    const crew = new Signature_Block('crew');
    crew.setTitle('Crew Sign-On');
    crew.addSegment();
    crew.addButtons('CREW');
    wrapper.appendChild(crew.getHTML());
}

function getPDF_signatures(){
    const signatures = Signature_Block.getInstances();


    const tableBody = [];
    // assessor
    tableBody.push([
        {text: 'Assessed By:', style: 'tableHeader', colSpan: 2},
        {text: ''}
    ])
    console.log(signatures[0]);
    console.log(signatures[0].getPDF_Segments());
    const assessorBody = signatures[0].getPDF_Segments()[0];
    tableBody.push(assessorBody[0]);
    tableBody.push(assessorBody[1]);

    // reviewer
    tableBody.push([
        {text: 'Reviewed By:', style: 'tableHeader', colSpan: 2},
        {text: ''}
    ])
    const reviewerBody = signatures[1].getPDF_Segments()[0];
    tableBody.push(reviewerBody[0]);
    tableBody.push(reviewerBody[1]);

    // crew sign on
    tableBody.push([
        {text: 'Crew Sign-On:', style: 'tableHeader', colSpan: 2},
        {text: ''}
    ])
    const crewBody = signatures[2].getPDF_Segments();
    crewBody.forEach(c => {
        tableBody.push(c[0]);
        tableBody.push(c[1]);
    })


    return {
        table: {
            widths: '*',
            body: tableBody
        }
    }

}

window.addEventListener('resize', function() {
    const modals = Modal_SignaturePad.getInstances();
    for (const modal of modals) {
        if (modal.getModal().style.display === 'block') {
            const sp = modal.getSignaturePad().resize();
            break;
        }
    }
})

signatures_html();