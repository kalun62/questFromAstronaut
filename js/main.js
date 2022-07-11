'use strict'

const sendBtn = document.getElementById('send'),
  form = document.getElementById('test'),
  quest = document.getElementById('quest'),
  response = document.getElementById('response'),
  timer = document.querySelector('.timer')

let i = 1;

sendBtn.addEventListener('click', () => {
  i++;
  quest.textContent = `Вопрос № ${i}`
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
  // startTimer()
}

form.addEventListener('submit', sendForm)


//timer 

// const startTimer = () => {
//   let sec = 30;
//   let time = setInterval(tick, 1000)

//   function tick() {
//     if (sec > 0) {
//       timer.style.color = 'black'
//       timer.innerHTML = `Осталось <br> ${--sec} секунд`
      
//     } else {
//       timer.innerHTML = `Время<br> вышло`
//       timer.style.color = '#db0000'
//       clearInterval(time)

//     }
//   }
// }