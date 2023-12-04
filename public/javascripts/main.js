// 使用 navigator:clipboard 的方法 writeText() 來實現複製功能
async function copy() {
  // Get the text to be copied
  const copyMsg = document.querySelector("#generated-pw").value;
  try {
    await navigator.clipboard.writeText(copyMsg);
    // Alert user the copied content
    alert("Copied : " + copyMsg);
  } catch {
    console.error("Unable to copy: ", err);
  }
}

// 掛載 form 表單驗證功能
const form = document.querySelector('form')

// Remove 'was-validated' when the form is cleared
form.addEventListener('reset', function onFormReset(event) {
  form.classList.remove('was-validated')
})

// Form validation
form.addEventListener('submit', function onFormSubmitted(event) {
  if (!form.checkValidity()) {
    event.preventDefault()
    event.stopPropagation()
    form.classList.add('was-validated')
  }
})