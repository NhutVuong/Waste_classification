const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('captureButton');
const uploadButton = document.getElementById('uploadButton');
const resultElement = document.getElementById('result');

let capturedImage;

// Access the webcam
async function startWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (error) {
        console.error('Error accessing webcam:', error);
    }
}

// Capture an image from the webcam
function captureImage() {
    return new Promise((resolve) => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
            resolve(blob);
        }, 'image/jpeg');
    });
}

// Capture 10 images when the capture button is pressed
captureButton.addEventListener('click', async () => {
    for (let i = 0; i < 100; i++) {
        capturedImage = await captureImage();
        console.log(`Captured image ${i + 1}`);
    }
    alert('Captured 100 images.');
});

// Upload the captured image
uploadButton.addEventListener('click', async () => {
    console.log("btn")
    if (!capturedImage) {
        alert('Please capture an image first.');
        return;
    }

    const formData = new FormData();
    formData.append('data', JSON.stringify({ key: 'Filename' }));
    formData.append('Filename', capturedImage, 'webcam.jpg');

    try {
        const url = "http://172.16.0.211";
        const response = await fetch(`${url}/models/RACTHAI/v1/predict`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const result = await response.json();
        resultElement.textContent = `predictions:${result.predictions}, probabilities: ${result.probabilities}`
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        resultElement.textContent = 'Error: ' + error.message;
    }
});

// Start the webcam when the page loads
startWebcam();
