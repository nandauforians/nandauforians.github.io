document.addEventListener("DOMContentLoaded", () => {
    const uploadArea = document.getElementById("uploadArea");
    const album = document.getElementById("album");
    const popup = document.getElementById("popup");
    const popupImage = document.getElementById("popupImage");
    const closePopupBtn = document.querySelector(".close");
    const sentinel = document.createElement("div");
    sentinel.id = "sentinel";
    album.appendChild(sentinel);
    const user = JSON.parse(localStorage.getItem("google_user"));

    const API_GATEWAY_URL = CONFIG.API_GATEWAY_URL;
    let allImages = [];
    let loadedImages = 0;
    const imagesPerBatch = 12;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Selected";
    deleteButton.className = "delete-button floating-button"; // Floating button for better visibility

    deleteButton.addEventListener("click", deleteSelectedPhotos);
    document.body.appendChild(deleteButton);

    function toggleDeleteButton() {
        const selectedPhotos = document.querySelectorAll(".delete-checkbox:checked");
        deleteButton.style.display = selectedPhotos.length > 0 ? "block" : "none";
    }

    if (!user || !user.email) {
        console.error("User is not logged in.");
        album.innerHTML = "<p>Error: User not authenticated.</p>";
        return;
    }

    document.body.style.opacity = "1"; // Ensure the body is fully visible

    uploadArea.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.multiple = true;
        input.onchange = (e) => handleFiles(e.target.files);
        input.click();
    });

    uploadArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadArea.style.backgroundColor = "#d6e4ff";
    });

    uploadArea.addEventListener("dragleave", () => {
        uploadArea.style.backgroundColor = "#e6f7ff";
    });

    uploadArea.addEventListener("drop", (e) => {
        e.preventDefault();
        uploadArea.style.backgroundColor = "#e6f7ff";
        handleFiles(e.dataTransfer.files);
    });

    async function handleFiles(files) {
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64Data = e.target.result.split(",")[1];

                const payload = {
                    body: JSON.stringify({
                        operation: "upload_image",
                        email: user.email,
                        file_name: file.name,
                        file_data: base64Data,
                        user: user.name
                    })
                };

                try {
                    const progressDiv = document.createElement("div");
                    progressDiv.className = "upload-progress";
                    progressDiv.innerHTML = "📤 Uploading...";
                    album.prepend(progressDiv);

                    const response = await fetch(API_GATEWAY_URL, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    });

                    progressDiv.remove();

                    if (!response.ok) {
                        throw new Error(`Upload failed: ${response.statusText}`);
                    }

                    await fetchImages(true);
                } catch (error) {
                    console.error("Error uploading file:", error);
                }
            };
            reader.readAsDataURL(file);
        }
    }

    const totalImagesCounter = document.createElement("div");
    totalImagesCounter.id = "totalImagesCounter";
    totalImagesCounter.className = "total-images-counter";
    totalImagesCounter.style.position = "fixed";
    totalImagesCounter.style.top = "10px";
    totalImagesCounter.style.right = "10px";
    totalImagesCounter.style.backgroundColor = "#f0f0f0";
    totalImagesCounter.style.padding = "10px 20px";
    totalImagesCounter.style.borderRadius = "8px";
    totalImagesCounter.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    totalImagesCounter.style.fontSize = "16px";
    totalImagesCounter.style.fontWeight = "bold";
    totalImagesCounter.style.zIndex = "1000";
    document.body.appendChild(totalImagesCounter);

    function updateTotalImagesCounter(total) {
        totalImagesCounter.textContent = `Total Images: ${total}`;
    }

    async function fetchImages(reset = false) {
        if (reset) {
            allImages = [];
            loadedImages = 0;
        }

        try {
            const userPayload = {
                body: JSON.stringify({
                    operation: "get_images",
                    method: "get_images_by_emailid",
                    email: user.email
                })
            };

            const otherPayload = {
                body: JSON.stringify({
                    operation: "get_images",
                    method: "get_images_by_others",
                    email: user.email
                })
            };

            const [userResponse, otherResponse] = await Promise.all([
                fetch(API_GATEWAY_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userPayload),
                }),
                fetch(API_GATEWAY_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(otherPayload),
                }),
            ]);

            if (!userResponse.ok || !otherResponse.ok) {
                throw new Error("Error fetching images.");
            }

            const userData = await userResponse.json();
            const otherData = await otherResponse.json();

            const userImages = JSON.parse(userData.body).images || [];
            const otherImages = JSON.parse(otherData.body).images || [];

            allImages = [...userImages, ...otherImages];

            // Sort images by upload_timestamp in descending order
            allImages.sort((a, b) => new Date(b.upload_timestamp) - new Date(a.upload_timestamp));

            updateTotalImagesCounter(allImages.length); // Update total images counter
            deleteButton.style.display = "none"; // Ensure delete button is hidden after refresh
            album.innerHTML = "";
            album.appendChild(sentinel);
            loadMoreImages();
        } catch (error) {
            console.error("Error fetching images:", error);
            album.innerHTML = "<p>Error loading images.</p>";
        } finally {
            document.getElementById("loadingOverlay").style.display = "none"; // Hide loader
        }
    }

    function loadMoreImages() {
        const batch = allImages.slice(loadedImages, loadedImages + imagesPerBatch);

        batch.forEach((img) => {
            if (!img.url) return;

            const photoDiv = document.createElement("div");
            photoDiv.className = "photo";

            const imageElement = document.createElement("img");
            imageElement.src = img.url;
            imageElement.alt = "Uploaded Photo";
            imageElement.addEventListener("click", () => openPopup(img.url));

            // Display uploader's name and uploaded date
            const uploaderInfo = document.createElement("span");
            uploaderInfo.className = "uploader";
            const uploadedDate = new Date(img.upload_timestamp).toLocaleDateString();
            uploaderInfo.textContent = `Uploaded By: ${img.user} (${uploadedDate})`;

            photoDiv.appendChild(imageElement);
            photoDiv.appendChild(uploaderInfo);

            // Add delete checkbox for logged-in user's images
            if (img.email === user.email) {
                const deleteIcon = document.createElement("span");
                deleteIcon.className = "delete-icon";
                deleteIcon.innerHTML = "🗑"; // Trash icon
                deleteIcon.style.color = "grey"; // Default color

                const deleteMark = document.createElement("span");
                deleteMark.className = "delete-mark";
                deleteMark.innerHTML = ""; // Initially empty

                deleteIcon.appendChild(deleteMark);

                deleteIcon.addEventListener("click", () => {
                    checkbox.checked = !checkbox.checked;
                    deleteIcon.style.color = checkbox.checked ? "red" : "grey"; // Change color on selection
                    deleteIcon.classList.toggle("selected", checkbox.checked); // Add/remove a CSS class
                    checkbox.value = img.photo_id;

                    // Toggle "X" mark when selected
                    deleteMark.innerHTML = checkbox.checked ? " ❌" : "";
                    deleteMark.style.color = "red";

                    toggleDeleteButton();
                });

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.className = "delete-checkbox";
                checkbox.value = img.id;
                checkbox.style.display = "none"; // Hide default checkbox
                checkbox.addEventListener("change", toggleDeleteButton);

                photoDiv.appendChild(deleteIcon);
                photoDiv.appendChild(checkbox);
            }

            album.insertBefore(photoDiv, sentinel);
        });

        loadedImages += batch.length;

        if (loadedImages >= allImages.length) return;

        album.appendChild(sentinel);
        observer.unobserve(sentinel);
        observer.observe(sentinel);
    }

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) loadMoreImages();
    }, { rootMargin: "100px" });

    observer.observe(sentinel);

    function openPopup(imageSrc) {
        popupImage.src = imageSrc;
        popup.style.display = "flex";
    }

    function closePopup() {
        popup.style.display = "none";
    }

    closePopupBtn.addEventListener("click", closePopup);
    popup.addEventListener("click", (event) => {
        if (event.target === popup) closePopup();
    });

    async function deleteSelectedPhotos() {
        const selectedPhotos = [...document.querySelectorAll(".delete-checkbox:checked")]
            .map(checkbox => checkbox.value);

        if (selectedPhotos.length === 0) return;

        const confirmDelete = confirm(`Are you sure you want to delete ${selectedPhotos.length} image(s)?`);
        if (!confirmDelete) return;

        const deletePayload = JSON.stringify({
            body: JSON.stringify({
                operation: "delete_images",
                email: user.email,
                photo_ids: selectedPhotos
            })
        });

        try {
            const response = await fetch(API_GATEWAY_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: deletePayload
            });

            if (!response.ok) {
                throw new Error("Failed to delete images.");
            }

            alert("Selected images deleted successfully.");
            fetchImages(true);  // Reload images
            deleteButton.style.display = "none"; // Hide the delete button after deletion
        } catch (error) {
            console.error("Error deleting images:", error);
            alert("Error deleting images. Try again.");
        }
    }

    fetchImages();
});
