function shareFile() {
    var fileLink = document.getElementById('file').value; // For simplicity, using the file input value as the link
    var fileInfo = document.getElementById('fileInfo');
  
    // Display file information if a file is selected
    if (fileLink) {
      fileInfo.innerHTML = `
        <div style="margin-bottom: 1rem;">
          Your file is uploaded
          <a href="${fileLink}" target="_blank">${fileLink}</a>
        </div>
      `;
    } else {
      fileInfo.innerHTML = ''; // Clear file information if no file is selected
    }
}