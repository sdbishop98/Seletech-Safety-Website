/** generates the html for the signature block
 */
function signatures_html() {    
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

function getPDF_signatures(){
    class SignatureBlock {
        constructor(modal) {
            const fit = [100, 100];
            this.modal = modal;
            this.sp = modal.getSignaturePad();
            this.png = this.sp.getPNG_URL(true);
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
            const reviewer = new SignatureBlock(modal);
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