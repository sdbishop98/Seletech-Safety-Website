function header_html(){
    // modular package that generates html
    // displays the header for an FLHA
    // utilizes helper functions in order to keep things tidy
    // INPUT:   none
    // RETURN:  none
    link_stylesheet('style/main.css');

    const wrapper = document.createElement('div');
    document.body.appendChild(wrapper);

    const title = document.createElement('h1');
    title.textContent = 'SELETECH FIELD LEVEL HAZARD ASSESSMENT';
    wrapper.appendChild(title);

    // const header = document.createElement('p');
    // header.innerHTML = 'this is a <b>test</b><br> of javascript';
    // wrapper.appendChild(header);

    const explanation = document.createElement('p');
    explanation_content = [
        '<b>As a group:</b>',
        '<span class="red-text">STOP:</SPAN> step back and observe.',
        '<span class="red-text">THINK:</SPAN> identify and review all tasks involved in the work scope.',
        '<span class="red-text">ASSESS:</SPAN> hazards, pathways, impact related to scope of work and site. Identify the hazards and the controls you will use.',
        '<span class="red-text">PLAN:</SPAN> identify needed controls, verify implementation and document.',
        '<span class="red-text">DISCUSS:</SPAN> the plan with all involved and complete the task.',
        '<span class="red-text">REVISE:</SPAN> repeat assessment with the group if conditions or tasks change.',
    ]
    explanation.innerHTML = explanation_content.join('<br>');

    wrapper.appendChild(explanation);
}



header_html();