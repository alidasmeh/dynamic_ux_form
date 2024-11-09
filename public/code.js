let currentQuestionIndex = 0;
const started_at = Date.now()

const survey_options = [
  ["radio"],
  ["onebyone", "list"], 
  ["background", "no-background"],
];

const randomize_setup = () => {
  let setup = [];
  survey_options.forEach((row) => {
    setup.push(row[Math.floor(Math.random() * row.length)]);
  });
  return setup;
};

const render = (questions) => {
    console.log(`GENERAL_SETUP: `, GENERAL_SETUP)
    questions.forEach((question, index) => {
        create_card(index, question)
    })

    create_card(questions.length, { type: "final_card" })

    if (GENERAL_SETUP[1] == 'onebyone') init_card_moving()
}

const create_card = (question_index, question) => {
    let next_prev_buttons = ''
    if (GENERAL_SETUP[1] == 'onebyone') {
        next_prev_buttons = `<hr/> 
                            <div class="d-flex justify-content-between" data-questionindex=${question_index}>
                                <button class="btn btn-primary">قبلی</button>
                                <button class="btn btn-primary">بعدی</button>
                            </div>`
    }


    let question_section = ''
    if (GENERAL_SETUP[2] == 'background') question_section = question.section

    let question_content = ''
    // console.log(question)
    if (question.type == 'one' && GENERAL_SETUP[0] == 'radio') question_content = create_radio_tag(question_index, question)
    if (question.type == 'one' && GENERAL_SETUP[0] == 'select') question_content = create_select_tag(question_index, question)
    if (question.type == 'text') question_content = create_input_tag(question_index, question)
    if (question.type == 'final_card') {
        question_content = final_card()
        question_section = 'white'
        // next_prev_buttons = ''
    }



    let card = `<div class="card" data-questionIndex='${question_index}' style="background: ${get_background(question_section)}; ${get_card_format()}">
                    <div class="card-body">
                        ${question_content}
                        ${next_prev_buttons}
                    </div>
                </div>`

    $("#questions_list").append(card)
}

const create_radio_tag = (question_index, question) => {
    let options_html = ''
    question.options.forEach(option =>
        options_html += `<div class="form-check" style="margin-right: 1.5em;">
                            <input class="form-check-input" style='float: right; margin-right: -1.5em; margin-left: 0;' type="radio" name="question_${question_index}" value="${option}">
                            <label class="form-check-label">
                                ${option}
                            </label>
                        </div>`
    )

    return `<h5 class="card-title"> ${question_index + 1}- ${question.question}</h5>
        <div>
            ${options_html}
        </div>`
}

const create_select_tag = (question_index, question) => {
    let options_html = ''
    question.options.forEach(option =>
        options_html += `<option value='${option}'>${option}</option>`
    )

    return `<h5 class="card-title"> ${question_index + 1}- ${question.question}</h5>
        <div>
            <select class='form-select' name='question_${question_index}'>
                <option value="0">یک گزینه را انتخاب کنید.</option>
                ${options_html}
            </select>
        </div>`
}

const create_input_tag = (question_index, question) => {
    return `<h5 class="card-title"> ${question_index + 1}- ${question.question}</h5>
            <div class="form-group">
                <input type="text" class="form-control" name='question_${question_index}' placeholder="${question.options[0]}">
            </div>`
}

const final_card = () => {
    return `
        <div class="text-center">
            <p>با تشکر از همکاری شما...</p>
            <p>جهت ثبت پاسخ‌های خود بر روی گزینه زیر کلیک کنید.</p>
            <button class='btn btn-success' onclick='openSatisfactionMeterModal()'>ثبت</button>
        </div>
    `;
}

const get_background = (section) => {
    if (section == 1) return '#f1ffe3'
    if (section == 2) return '#e3fff5'
    if (section == 3) return '#a3f3ff'
    if (section == 4) return '#e7e3ff'
    if (section == 5) return '#f8e3ff'
    if (section == 6) return '#ffe3e3'

    return 'white';
}

const GENERAL_SETUP = randomize_setup()


// Initially hide all cards except the first one
function initializeQuiz(questionCards) {
    questionCards.forEach((card, index) => {
        if (index === 0) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    updateNavigationButtons(questionCards);
}

// Handle navigation button clicks
function handleNavigation(questionCards) {
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', (e) => {
            const isNext = e.target.textContent === 'بعدی';
            const questionIndex = parseInt(e.target.parentElement.getAttribute('data-questionindex'));
            
            // Hide current question
            questionCards[currentQuestionIndex].style.display = 'none';
            
            // Update current index
            if (isNext) {
                currentQuestionIndex = questionIndex + 1;
            } else {
                currentQuestionIndex = questionIndex - 1;
            }
            
            // Show new current question
            questionCards[currentQuestionIndex].style.display = 'block';
            
            // Update button states
            updateNavigationButtons(questionCards);
        });
    });
}

// Update navigation buttons visibility based on current question
function updateNavigationButtons(questionCards) {
    questionCards.forEach((card, index) => {
        if (card.style.display === 'block') {
            const navButtons = card.querySelector('.d-flex');
            if (navButtons) {
                const [prevButton, nextButton] = navButtons.children;
                
                // Handle previous button
                if (index === 0) {
                    prevButton.style.visibility = 'hidden';
                } else {
                    prevButton.style.visibility = 'visible';
                }
                
                // Handle next button
                if (index === questionCards.length - 1) { // -2 because last card is the finish button
                    nextButton.style.visibility = 'hidden';
                } else {
                    nextButton.style.visibility = 'visible';
                }
            }
        }
    });
}

// Add CSS for smooth transitions
function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .card {
            transition: opacity 0.3s ease-in-out;
        }
        .card[style*="display: none"] {
            opacity: 0;
        }
        .card[style*="display: block"] {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}

const init_card_moving = () => {
  // Get all question cards
  const questionCards = document.querySelectorAll('.card');


  // Initialize everything
  addStyles(questionCards);
  initializeQuiz(questionCards);
  handleNavigation(questionCards);
}

const get_card_format = () => {
  if (GENERAL_SETUP[1] == 'list'){
    return 'margin: 0; border: none; padding-top: 18px; padding-bottom: 18px; border-radius: 0;'
  }else{
    return 'margin-top: 3rem;'
  }

}

function openSatisfactionMeterModal() {
    let responses = collect_responses()

    let stop = false
    responses.forEach((row)=>{
        console.log(row)
        if (row == undefined) return stop = true
        if (row == null) return stop = true
        if (row.length == 0) return stop = true
        if (row == 0) return stop = true
    })
    if( stop ) return alert('پاسخ به تمام سوالات اجباری است. ');

  // Create modal elements
  const modalDiv = document.createElement('div');
  modalDiv.className = 'modal fade';
  modalDiv.id = 'dynamicModal';
  modalDiv.setAttribute('tabindex', '-1');
  modalDiv.setAttribute('aria-hidden', 'true');

  // Modal HTML structure
  modalDiv.innerHTML = `
      <div class="modal-dialog">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title">رضایت سنج</h5>
                  <!-- <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> -->
              </div>
              <div class="modal-body">
                  <p>تا چه میزان از شیوه‌ای که محتوا این فرم به شما ارائه شد، راضی بودید؟</p>
                  <div class="d-flex align-items-center gap-2">
                      <span class="small text-center">اصلا راضی نبودم</span>
                      <input type="range" class="form-range flex-grow-1" id="feedback" 
                          min="0" max="100" step="1" value="50">
                      <span class="small text-center">کاملا راضی بودم</span>
                  </div>
              </div>
              <div class="modal-footer">
                  <!-- <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button> -->
                  <button class="btn btn-primary" onclick="generate_output()">ثبت نظر</button> 
              </div>
          </div>
      </div>
  `;

  // Append modal to body
  document.body.appendChild(modalDiv);

  // Initialize and open modal
  const modal = new bootstrap.Modal(modalDiv);
  modal.show();

  // Remove modal from DOM after it's hidden
  modalDiv.addEventListener('hidden.bs.modal', function () {
      document.body.removeChild(modalDiv);
  });
}

const generate_output = async () => {

    let output = {
        setup: GENERAL_SETUP, // means survey_options[0,0], survey_options[1,0], survey_options[2,1]
        duration: (Date.now()-started_at)/1000, // how long it took users fill the form in s
        feedback: $("#feedback").val(), // a number between 1 to 100
        responses: collect_responses(),
        browser_info: get_browser_info()
    }

    try {
        const response = await fetch('/api/records', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(output)
        });

        if (response.ok) {
            alert('با موفقیت ثبت شد.');
        } else {
            throw new Error('خطا رخ داده است.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('خطا رخ داده است ۲.');
    }
}

const collect_responses = ()=>{
    let responses = data.map((question, index)=>{
        if(question.type == 'text') return $(`[name='question_${index}']`).val()
        if(question.type == 'one') {
            if(GENERAL_SETUP[0] == 'radio') return $(`[name='question_${index}']:checked`).val()
            if(GENERAL_SETUP[0] == 'select') return $(`[name='question_${index}']`).val()
        }
    })
    console.log(responses)
    return responses
}

const get_browser_info = ()=>{
    const browserInfo ={
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        vendor: navigator.vendor
    };
    const screenInfo = {
        width: window.screen.width,
        height: window.screen.height,
        availWidth: window.screen.availWidth,
        availHeight: window.screen.availHeight,
        colorDepth: window.screen.colorDepth,
        pixelDepth: window.screen.pixelDepth
    };
    const windowInfo = {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight
    };

    const browser = get_browser()

    return {
        browserInfo,
        screenInfo,
        windowInfo,
        browser,
        is_mobile: is_mobile()
    }
}

function get_browser() {
    const userAgent = navigator.userAgent;
    let browser = "Unknown";
    
    if (userAgent.match(/chrome|chromium|crios/i)) {
        browser = "Chrome";
    } else if (userAgent.match(/firefox|fxios/i)) {
        browser = "Firefox";
    } else if (userAgent.match(/safari/i)) {
        browser = "Safari";
    } else if (userAgent.match(/opr\//i)) {
        browser = "Opera";
    } else if (userAgent.match(/edg/i)) {
        browser = "Edge";
    } 
    
    return browser;
}

function is_mobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}