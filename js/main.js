'use strict'

const sendBtn = document.getElementById('send'),
  form = document.getElementById('test'),
  camp = document.getElementById('camp'),
  quest = document.getElementById('quest'),
  response = document.getElementById('response'),
  timer = document.querySelector('.timer'),
  successWindow = document.createElement('div')

let i = 1;
let time

successWindow.classList.add('success_window', 'active')
form.append(successWindow)
successWindow.innerHTML = `<p>Добрый день!<br>
                              Внимательно выслушайте вопрос, <br>
                              затем нажмите кнопку "Ответить"<br>
                              На ответ у вас будет 30 секунд </p>
                            <div id="next_quest">Ответить</div>
                              <span>Не нажимайте кнопку, пока не услышите вопрос</span>`

const nextQuestBtn = document.getElementById('next_quest')
nextQuestBtn.addEventListener('click', () => {
  successWindow.classList.remove('active')
})

sendBtn.addEventListener('click', () => {
  i++;
  quest.textContent = `Вопрос № ${i}`
  questionTime()
  timer.textContent = ''
  clearInterval(time)
})

const sendForm = (e) => {
  e.preventDefault()
  const appLink = 'https://script.google.com/macros/s/AKfycbxCc2-2U7T6PpB7QJXu5W8Sg_Ptp7wy34MBKs6qgHOkgBCksn0y94m-iJ9nP_9LnQj3/exec'
  const formData = new FormData(form)
  $.ajax({
    url: appLink,
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
  })
  response.value = ''
  response.setAttribute('name', `Вопрос_${i}`)
}

const questionTime = () => {
  successWindow.classList.add('active')
  successWindow.innerHTML = `<p>Ваш ответ принят<br>
                                Ожидайте следующий вопрос</p>
                           <div id="next_quest">Дальше</div>
                           <span>Не нажимайте кнопку, пока не услышите вопрос</span>`
  const nextQuestBtn = document.getElementById('next_quest')

  nextQuestBtn.addEventListener('click', (e) => {
    e.preventDefault()
    successWindow.classList.remove('active')
    startTimer()
  })
}

// timer 

const startTimer = () => {
  let sec = 30;
  clearInterval(time)
  time = setInterval(() => {
    if (sec > 0) {
      timer.style.color = 'black'
      timer.innerHTML = `Осталось <br> ${--sec} секунд`

    } else {
      timer.innerHTML = `Время<br> вышло`
      timer.style.color = '#db0000'
      clearInterval(time)
    }
  }, 1000)
}

camp.addEventListener('change', startTimer)
form.addEventListener('submit', sendForm)