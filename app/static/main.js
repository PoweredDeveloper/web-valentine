const btnYes = document.getElementById('btn-yes')
const btnNo = document.getElementById('btn-no')
const feedback = document.getElementById('feedback')

let submitted = false

function setFeedback(msg, isError = false) {
  feedback.textContent = msg
  feedback.className = 'mt-6 text-sm ' + (isError ? 'text-rose-600' : 'text-stone-500')
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
      setFeedback(agreed ? 'Thank you! 💕' : 'No worries, thanks for answering!')
    } else {
      setFeedback(data.detail || 'Something went wrong. Try again?', true)
      submitted = false
      btnYes.disabled = false
      btnNo.disabled = false
    }
  } catch (e) {
    setFeedback('Something went wrong. Try again?', true)
    submitted = false
    btnYes.disabled = false
    btnNo.disabled = false
  }
}

btnYes.addEventListener('click', () => submit(true))
btnNo.addEventListener('click', () => submit(false))
