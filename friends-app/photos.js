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

            photoDiv.appendChild(imageElement);
            album.insertBefore(photoDiv, sentinel);
        });

        loadedImages += batch.length;
        if (loadedImages >= allImages.length) observer.disconnect();

        document.body.click();
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

    fetchImages();

});
