document.addEventListener("DOMContentLoaded", () => {
    const uploadArea = document.getElementById("uploadArea");
    const album = document.getElementById("album");
    const popup = document.getElementById("popup");
    const popupImage = document.getElementById("popupImage");
    const user = JSON.parse(localStorage.getItem("google_user"));

    const logoutButton = document.getElementById("logout-btn");
    const userNameDisplay = document.getElementById("user-name");

    userNameDisplay.innerText = `👤 ${user.name}`;

    const API_GATEWAY_URL = CONFIG.API_GATEWAY_URL;

    console.log("User:", user.name);

    if (!user || !user.email) {
        console.error("User is not logged in.");
        album.innerHTML = "<p>Error: User not authenticated.</p>";
        return;
    }

    album.innerHTML = "<p>🔄 Loading images...</p>";

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

            console.log("Payload:", payload);
               

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

                    await fetchImages();
                } catch (error) {
                    console.error("Error uploading file:", error);
                }
            };
            reader.readAsDataURL(file);
        }
    }

    async function fetchImages() {
        album.innerHTML = "<p>🔄 Loading images...</p>";

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
    
		
		
            // Fetch images uploaded by logged-in user
            //const userPayload = { operation: "get_images", method: "get_images_by_emailid", email: user.email };
           // const otherPayload = { operation: "get_images", method: "get_images_by_others", email: user.email };

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
            console.log("User images:", userData);
            console.log("Other images:", otherData);

            const userImages = JSON.parse(userData.body).images || [];
            const otherImages = JSON.parse(otherData.body).images || [];

            const allImages = [...userImages, ...otherImages];

            if (allImages.length === 0) {
                album.innerHTML = "<p>No images found.</p>";
                return;
            }

            album.innerHTML = "";
            allImages.forEach((img) => {
                if (!img.url) return; // Prevent broken images

                const photoDiv = document.createElement("div");
                photoDiv.className = "photo";
                photoDiv.innerHTML = `
                    <img src="${img.url}" alt="Uploaded Photo" onclick="openPopup('${img.url}')">
                    
                `;
                album.appendChild(photoDiv);
            });
        } catch (error) {
            console.error("Error fetching images:", error);
            album.innerHTML = "<p>Error loading images.</p>";
        }
    }

    window.openPopup = (imageSrc) => {
        popupImage.src = imageSrc;
        popup.style.display = "flex";
    };

    window.closePopup = () => {
        popup.style.display = "none";
    };

    fetchImages(); // Load images on page load
});
