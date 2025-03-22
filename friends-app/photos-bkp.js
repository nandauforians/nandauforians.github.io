const API_GATEWAY_URL = "https://kvrsn4eqq4.execute-api.us-west-2.amazonaws.com/dev/my-resource";
const API_KEY = "your-api-key"; // Replace with your actual API key

const uploadArea = document.getElementById('upload-area');
const album = document.getElementById('album');
const popup = document.getElementById('popup');
const popupImage = document.getElementById('popup-image');

uploadArea.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => handleFiles(e.target.files);
    input.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#28a745';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#007bff';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
});

async function handleFiles(files) {
    Array.from(files).forEach(async (file) => {
        const reader = new FileReader();
        reader.onload = async function (e) {
            await uploadImage(file, e.target.result);
        };
        reader.readAsDataURL(file);
    });
}

async function uploadImage(file) {
    const reader = new FileReader();

    reader.onload = async (event) => {
        const base64Data = event.target.result.split(',')[1]?.trim();  // Ensures clean base64 data
        const user = JSON.parse(localStorage.getItem("google_user"));

        if (!user || !user.email) {
            alert('User information not found. Please log in again.');
            return;
        }

        const payload = {
            operation: "upload_image", 
            email: user.email,
            file_name: file.name,
            file_data: base64Data
        };

        try {
            const response = await fetch(API_GATEWAY_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY
                },
                body: JSON.stringify({ body: JSON.stringify(payload) }),  // Corrected payload structure
                mode: "cors"
            });

            const result = await response.json();
            console.log('Upload result:', result);

            if (response.ok) {
                alert('Image uploaded successfully!');
                loadImages(); // Refresh the image gallery
            } else {
                alert(`Upload failed: ${result.error || result.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('An error occurred while uploading the image.');
        }
    };

    reader.readAsDataURL(file);
}


function addPhotoToAlbum(src, uploadedBy, uploadedTime) {
    const photoCard = document.createElement('div');
    photoCard.className = 'photo-card';

    const img = document.createElement('img');
    img.src = src;
    img.onclick = () => openPopup(src);

    const metadata = document.createElement('div');
    metadata.innerHTML = `<small>Uploaded by: ${uploadedBy}<br>Time: ${uploadedTime}</small>`;
    metadata.className = 'metadata';

    photoCard.appendChild(img);
    photoCard.appendChild(metadata);
    album.appendChild(photoCard);
}

function openPopup(src) {
    popupImage.src = src;
    popup.style.display = 'flex';
}

function closePopup() {
    popup.style.display = 'none';
}
