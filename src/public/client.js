// public/js/upload.js
function shareFile() {
  var fileInput = document.getElementById('file');
  var formData = new FormData();
  formData.append('file', fileInput.files[0]);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:3001/upload', true);

  // Track upload progress
  xhr.upload.addEventListener('progress', function (e) {
    if (e.lengthComputable) {
      var percent = (e.loaded / e.total) * 100;
      updateProgress(percent);
    }
  });

  // Handle successful upload
  xhr.addEventListener('load', function () {
    if (xhr.status === 200) {
      var fileInfo = document.getElementById('fileInfo');
      fileInfo.innerHTML = xhr.responseText;
      resetProgress();
    } else {
      console.error('Failed to upload file.');
    }
  });

  // Handle upload errors
  xhr.addEventListener('error', function () {
    console.error('Error during file upload.');
  });

  // Show progress container
  var progressContainer = document.getElementById('progress-container');
  progressContainer.style.display = 'block';

  // Send the request
  xhr.send(formData);
}

function updateProgress(percent) {
  var progressBar = document.getElementById('upload-progress');
  var progressText = document.getElementById('progress-text');

  progressBar.value = percent;
  progressText.innerText = percent.toFixed(2) + '%';
}

function resetProgress() {
  var progressContainer = document.getElementById('progress-container');
  progressContainer.style.display = 'none';

  var progressBar = document.getElementById('upload-progress');
  var progressText = document.getElementById('progress-text');

  progressBar.value = 0;
  progressText.innerText = '0%';
}

const file = document.querySelector('#file');
file.addEventListener('change', (e) => {
  // Get the selected file
  const [file] = e.target.files;
  // Get the file name and size
  const { name: fileName, size } = file;
  // Convert size in bytes to kilo bytes
  const fileSize = (size / 1000).toFixed(2);
  // Set the text content
  const fileNameAndSize = `${fileName} - ${fileSize}KB`;
  document.querySelector('.file-name').textContent = fileNameAndSize;
});

function copyLinkToClipboard() {
  var r = document.createRange();
  r.selectNode(document.getElementById("file-link"));
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(r);
  document.execCommand('copy');
  window.getSelection().removeAllRanges();
}