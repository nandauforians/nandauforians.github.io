document.addEventListener("DOMContentLoaded", async function () {
    const response = await fetch("data.json");
    const families = await response.json();
    const container = document.getElementById("friends-container");
    const detailsContainer = document.getElementById("details-container");

    // 🔹 Ensure we check localStorage, not sessionStorage
    const user = JSON.parse(localStorage.getItem("google_user"));
    const logoutButton = document.getElementById("logout-btn");
    const userNameDisplay = document.getElementById("user-name");

    console.log("User Data: ", user); // Debugging purpose

    if (!user || !user.name) {
        console.warn("User not authenticated, redirecting to login...");
        localStorage.removeItem("google_user"); // Ensure no stale data
        window.location.href = "index.html";
        return;
    }

    console.log(`Logged in as ${user.name}`);
    document.getElementById("loading").style.display = "none";
    container.style.visibility = "visible";
    container.style.opacity = "1";
    userNameDisplay.innerText = `👤 ${user.name}`;

    // ✅ Handle logout properly
    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("google_user"); // Clear localStorage on logout
        window.location.href = "index.html";
    });

    function renderFirstGeneration() {
        families.sort((a, b) => new Date(a.birthday) - new Date(b.birthday));

        families.forEach(person => {
            const personCard = document.createElement("div");
            personCard.classList.add("person-card");
            personCard.innerHTML = `
                <img src="${person.image}" alt="${person.name}" class="profile-img">
                <p class="name-label">${person.name}</p>
                <p class="birthday-label">🎂 ${person.birthday}</p>
            `;
            personCard.addEventListener("click", () => displayFamilyTree(person));
            container.appendChild(personCard);
        });

        checkUpcomingEvents(families);
    }

    function displayFamilyTree(person) {
        detailsContainer.innerHTML = renderFamilyTree(person);
    }

    function renderFamilyTree(person) {
        if (!person) return "";

        let spouseHTML = "";
        let weddingPicHTML = "";
        let anniversaryHTML = "";

        if (person.spouse) {
            spouseHTML = `
                <div class="person-card">
                    <img src="${person.spouse.image}" alt="${person.spouse.name}" class="profile-img">
                    <p class="name-label">${person.spouse.name}</p>
                    <p class="birthday-label">🎂 ${person.spouse.birthday}</p>
                </div>
            `;

            if (person.weddingPic) {
                weddingPicHTML = `
                    <div class="wedding-section">
                        <img src="${person.weddingPic}" alt="Wedding Picture" class="wedding-img">
                    </div>
                `;
                anniversaryHTML = `<p class="anniversary-label">💍 Anniversary: ${person.anniversary}</p>`;
            }
        }

        let personBlock = `
            <div class="person-group">
                <div class="person-card">
                    <img src="${person.image}" alt="${person.name}" class="profile-img">
                    <p class="name-label">${person.name}</p>
                    <p class="birthday-label">🎂 ${person.birthday}</p>
                </div>
                ${spouseHTML}
            </div>
        `;

        let kidsHTML = "";
        if (person.kids && person.kids.length > 0) {
            kidsHTML = `
                <div class="kids-container">
                    <h3>Children</h3>
                    ${person.kids.map(child => renderFamilyTree(child)).join('')}
                </div>
            `;
        }

        return `
            <div class="family-block">
                ${personBlock}
                ${weddingPicHTML}
                ${anniversaryHTML}
                ${kidsHTML}
            </div>
        `;
    }

    function checkUpcomingEvents(families) {
        const today = new Date();
        const twoWeeksLater = new Date();
        twoWeeksLater.setDate(today.getDate() + 14);

        function traverseFamilyTree(person) {
            if (!person) return;

            let birthdayDate = new Date(person.birthday);
            birthdayDate.setFullYear(today.getFullYear());

            if (birthdayDate >= today && birthdayDate <= twoWeeksLater) {
                showNotification(person.name, "🎂 Birthday", person.birthday, person.image);
            }

            if (person.spouse && person.anniversary) {
                let anniversaryDate = new Date(person.anniversary);
                anniversaryDate.setFullYear(today.getFullYear());

                if (anniversaryDate >= today && anniversaryDate <= twoWeeksLater) {
                    let coupleName = `${person.name} & ${person.spouse.name}`;
                    showNotification(coupleName, "💍 Anniversary", person.anniversary, person.spouse.image);
                }
            }

            if (person.kids && person.kids.length > 0) {
                person.kids.forEach(child => traverseFamilyTree(child));
            }
        }

        families.forEach(person => traverseFamilyTree(person));
    }

    function showNotification(name, eventType, date, image) {
        const notificationContainer = document.getElementById("notification-container") || document.createElement("div");
        notificationContainer.id = "notification-container";
        document.body.appendChild(notificationContainer);

        const notification = document.createElement("div");
        notification.classList.add("notification-popup");
        notification.innerHTML = `
            <img src="${image}" alt="${name}" class="notification-img">
            <div class="notification-content">
                <p class="notification-text"><strong>${name}</strong>'s ${eventType} is coming up!</p>
                <p class="notification-date">📅 ${date}</p>
            </div>
        `;

        notificationContainer.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 10000);
    }

    renderFirstGeneration();
});
