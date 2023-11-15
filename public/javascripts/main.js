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