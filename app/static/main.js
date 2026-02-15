const TEXTS = {
  feedback: {
    yes: 'Hooray! Thank you!',
    no: 'No worries, thanks for your answer.',
    error: 'Something went wrong. Try again?',
  },
  noConfirm: {
    ask1: 'Are you sure?',
    ask2: 'Really? Last chance!',
    button1: "Yes, I'm sure",
    button2: 'Definitely not',
    buttonInitial: 'No',
  },
}

const btnYes = document.getElementById('btn-yes')
const btnNo = document.getElementById('btn-no')
const feedback = document.getElementById('feedback')
const telegramLinkEl = document.getElementById('telegram-link')

let submitted = false

async function loadTelegramLink() {
  try {
    const res = await fetch('/api/config')
    const data = await res.json()
    const handle = data.telegramHandle
    if (handle) {
      const a = document.createElement('a')
      a.href = 'https://t.me/' + handle
      a.target = '_blank'
      a.rel = 'noopener'
      a.className = 'inline-block text-stone-400 hover:text-stone-600 transition-colors'
      a.textContent = '@' + handle
      telegramLinkEl.appendChild(a)
    }
  } catch (_) {}
}
loadTelegramLink()

let noConfirmStep = 0

function setFeedback(msg, isError = false) {
  feedback.textContent = msg
  feedback.className = 'mt-6 text-sm ' + (isError ? 'text-red-600' : 'text-stone-500')
  feedback.classList.remove('hidden')
}

async function submit(agreed) {
  if (submitted) return
  submitted = true
  btnYes.disabled = true
  btnNo.disabled = true
  feedback.classList.add('hidden')
  try {
    const res = await fetch('/api/send-response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agreed }),
    })
    const data = await res.json()
    if (res.ok && data.success) {
      if (agreed && typeof confetti === 'function') {
        const pastels = ['#f8b4c4', '#e8c4e0', '#c4e0e8', '#e8e4c4', '#d4c4e8', '#ffdfba', '#bae1ff']
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.7 }, colors: pastels })
        setTimeout(() => {
          confetti({ particleCount: 80, spread: 100, origin: { y: 0.6 }, colors: pastels })
        }, 200)
      }
      setFeedback(agreed ? TEXTS.feedback.yes : TEXTS.feedback.no)
    } else {
      setFeedback(data.detail || TEXTS.feedback.error, true)
      submitted = false
      btnYes.disabled = false
      resetNoButton()
    }
  } catch (e) {
    setFeedback(TEXTS.feedback.error, true)
    submitted = false
    btnYes.disabled = false
    resetNoButton()
  }
}

function resetNoButton() {
  noConfirmStep = 0
  btnNo.textContent = TEXTS.noConfirm.buttonInitial
  btnNo.disabled = false
}

function onNoClick() {
  if (submitted) return
  if (noConfirmStep === 0) {
    noConfirmStep = 1
    setFeedback(TEXTS.noConfirm.ask1)
    btnNo.textContent = TEXTS.noConfirm.button1
    return
  }
  if (noConfirmStep === 1) {
    noConfirmStep = 2
    setFeedback(TEXTS.noConfirm.ask2)
    btnNo.textContent = TEXTS.noConfirm.button2
    return
  }
  submit(false)
}

btnYes.addEventListener('click', () => submit(true))
btnNo.addEventListener('click', onNoClick)
