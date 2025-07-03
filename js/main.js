'use strict'

const sendBtn = document.getElementById('send'),
    form = document.getElementById('test'),
    camp = document.getElementById('camp'),
    quest = document.getElementById('quest'),
    response = document.getElementById('response'),
    timer = document.querySelector('.timer'),
    successWindow = document.createElement('div')

let time
let isFormEnabled = true // значение будет обновлено после запроса

let previousStatus = null

function checkFormStatus() {
    const statusUrl = 'https://script.google.com/macros/s/AKfycbxCc2-2U7T6PpB7QJXu5W8Sg_Ptp7wy34MBKs6qgHOkgBCksn0y94m-iJ9nP_9LnQj3/exec' // 🔁 Вставь СВОЙ URL

    fetch(statusUrl)
        .then(res => res.json())
        .then(data => {
            const newStatus = data.formEnabled === true || data.formEnabled === 'TRUE'

            if (newStatus !== previousStatus) {
                isFormEnabled = newStatus
                previousStatus = newStatus

                if (!isFormEnabled) {
                    sendBtn.setAttribute('disabled', 'disabled')
                    sendBtn.classList.add('disabled')
                    sendBtn.textContent = 'Ждём...'
                } else {
                    enableBtnIfAllowed()
                }
            }
        })
        .catch(err => {
            console.error('Ошибка при получении статуса формы:', err)
        })
}

setInterval(checkFormStatus, 2000)

function startTimer() {
    let sec = 30
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

function questionTime() {
    successWindow.classList.add('active')
    successWindow.innerHTML = `<p>Ваш ответ принят<br>
                                Ожидайте следующий вопрос</p>
                           <div id="next_quest">Дальше</div>
                           <span>Не нажимайте кнопку, пока не услышите вопрос</span>`

    const nextQuestBtn = successWindow.querySelector('#next_quest')
    nextQuestBtn.addEventListener('click', (e) => {
        e.preventDefault()
        successWindow.classList.remove('active')
        startTimer()
    })
}

function disabledBtn() {
    sendBtn.setAttribute('disabled', 'disabled')
    sendBtn.classList.add('disabled')
    sendBtn.textContent = isFormEnabled ? 'Ответить' : 'Ждём'
}

function enableBtnIfAllowed() {
    if (response.value !== '' && camp.value !== 'default' && isFormEnabled) {
        sendBtn.removeAttribute('disabled')
        sendBtn.classList.remove('disabled')
        sendBtn.textContent = 'Ответить'
    } else {
        disabledBtn()
    }
}

function sendForm() {
    const appLink = 'https://script.google.com/macros/s/AKfycbxCc2-2U7T6PpB7QJXu5W8Sg_Ptp7wy34MBKs6qgHOkgBCksn0y94m-iJ9nP_9LnQj3/exec'
    const formData = new FormData(form)

    $.ajax({
        url: appLink,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
    })
}

// --- Основной код ---
const urlParams = new URLSearchParams(window.location.search)
let i = parseInt(urlParams.get('question')) || 1
const campFromUrl = urlParams.get('camp')

// Устанавливаем номер вопроса
quest.textContent = `Вопрос № ${i}`
response.setAttribute('name', `Вопрос_${i}`)

// Устанавливаем лагерь, если есть в URL
camp.value = campFromUrl || ''
camp.removeAttribute('disabled')

// Создаем и добавляем окно-инструкцию
successWindow.classList.add('success_window')
form.append(successWindow)

if (!urlParams.get('question')) {
    successWindow.classList.add('active')
    successWindow.innerHTML = `<p>Добрый день!<br>
                                Внимательно выслушайте вопрос, <br>
                                затем нажмите кнопку "Ответить"<br>
                                На ответ у вас будет 30 секунд </p>
                              <div id="next_quest">Ответить</div>
                              <span>Не нажимайте кнопку, пока не услышите вопрос</span>`

    const nextQuestBtn = successWindow.querySelector('#next_quest')
    nextQuestBtn.addEventListener('click', () => {
        successWindow.classList.remove('active')
        startTimer()

        const newParams = new URLSearchParams()
        newParams.set('question', 1)
        if (camp.value !== 'default') newParams.set('camp', camp.value)
        const newUrl = `${window.location.pathname}?${newParams}`
        window.history.replaceState(null, '', newUrl)
    })
} else {
    startTimer()
}

camp.addEventListener('change', () => {
    const currentParams = new URLSearchParams(window.location.search)
    currentParams.set('camp', camp.value)
    window.history.replaceState(null, '', `${window.location.pathname}?${currentParams}`)

    startTimer()
    enableBtnIfAllowed()
})

sendBtn.addEventListener('click', (e) => {
    e.preventDefault()
    if (!isFormEnabled) return

    sendForm()

    i++
    quest.textContent = `Вопрос № ${i}`
    response.setAttribute('name', `Вопрос_${i}`)
    camp.removeAttribute('disabled')
    response.value = ''
    disabledBtn()

    questionTime()
    timer.textContent = ''
    clearInterval(time)

    const currentParams = new URLSearchParams()
    currentParams.set('question', i)
    if (camp.value !== 'default') currentParams.set('camp', camp.value)
    const newUrl = `${window.location.pathname}?${currentParams}`
    window.history.replaceState(null, '', newUrl)
})

response.addEventListener('input', enableBtnIfAllowed)

form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (!isFormEnabled) return
    sendForm()
})

disabledBtn()
checkFormStatus()