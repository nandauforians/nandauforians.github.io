document.addEventListener("DOMContentLoaded", async function () {
    const response = await fetch("data.json");
    const families = await response.json();
    const container = document.getElementById("friends-container");
    const detailsContainer = document.getElementById("details-container");

    function renderFirstGeneration() {
        families.forEach(person => {
            const personCard = document.createElement("div");
            personCard.classList.add("person-card");
            personCard.innerHTML = `
                <img src="${person.image}" alt="${person.name}" class="profile-img" data-name="${person.name}">
                <p class="name-label">${person.name}</p>
                <p class="birthday-label">🎂 ${person.birthday}</p>
            `;
            personCard.addEventListener("click", () => displayFamilyTree(person));
            container.appendChild(personCard);
        });
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
