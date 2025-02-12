document.addEventListener("DOMContentLoaded", async function () {
    const response = await fetch("data.json");
    const families = await response.json();
    const container = document.getElementById("friends-container");
    const detailsContainer = document.getElementById("details-container");
    const notificationContainer = document.getElementById("notification-container");

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
                    showNotification(coupleName, "💍 Anniversary", person.anniversary, person.image, person.spouse.image);
                }
            }

            if (person.kids && person.kids.length > 0) {
                person.kids.forEach(child => traverseFamilyTree(child));
            }
        }

        families.forEach(person => traverseFamilyTree(person));
    }

    function showNotification(name, eventType, date, image, spouseImage) {
        const notification = document.createElement("div");
        notification.classList.add("notification-popup");
        notification.innerHTML = `
            <img src="${image}" alt="${name}" class="notification-img">
            <img src="${spouseImage}"  class="notification-img">
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

    function displayFamilyTree(person) {
        detailsContainer.innerHTML = renderFamilyTree(person);
    }

    function renderFamilyTree(person) {
        if (!person) return "";

        const spouseHTML = person.spouse ? `
            <div class="person-card">
                <img src="${person.spouse.image}" alt="${person.spouse.name}" class="profile-img small">
                <p class="name-label">${person.spouse.name}</p>
                <p class="birthday-label">🎂 ${person.spouse.birthday}</p>
            </div>
        ` : "";

        let personBlock = `
            <div class="person-group">
                <div class="person-card">
                    <img src="${person.image}" alt="${person.name}" class="profile-img small">
                    <p class="name-label">${person.name}</p>
                    <p class="birthday-label">🎂 ${person.birthday}</p>
                </div>
                ${spouseHTML}
            </div>
        `;

        let anniversaryHTML = person.spouse ? `<p class="anniversary-label">💍 Anniversary: ${person.anniversary}</p>` : "";

        let kidsHTML = "";
        if (person.kids && person.kids.length > 0) {
            kidsHTML = `
                <div class="kids-container">
                    ${person.kids.map(child => renderFamilyTree(child)).join('')}
                </div>
            `;
        }

        return `
            <div class="family-block">
                ${personBlock}
                ${anniversaryHTML}
                ${kidsHTML}
            </div>
        `;
    }

    renderFirstGeneration();
});
