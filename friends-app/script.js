document.addEventListener("DOMContentLoaded", async function () {
    const response = await fetch("data.json");
    const friends = await response.json();
    const container = document.getElementById("friends-container");
    const detailsContainer = document.getElementById("details-container");

    // Function to format birthday as "Day Month"
    function formatBirthday(birthday) {
        if (!birthday) return "";
        const date = new Date(birthday);
        return date.toLocaleDateString("en-US", { day: "numeric", month: "long" });
    }

    // Function to extract MMDD format for sorting
    function getSortableDate(birthday) {
        if (!birthday) return 9999; // Push empty birthdays to the end
        const date = new Date(birthday);
        return date.getMonth() * 100 + date.getDate(); // Convert to MMDD format
    }

    // Get today's date in MMDD format
    const today = new Date();
    const todaySortable = today.getMonth() * 100 + today.getDate();

    // Sort friends by birthday (ignoring year)
    friends.sort((a, b) => getSortableDate(a.birthday) - getSortableDate(b.birthday));

    // Find the next 2 upcoming birthdays
    const upcomingBirthdays = friends
        .filter(friend => getSortableDate(friend.birthday) >= todaySortable) // Filter future birthdays
        .slice(0, 2); // Get the next 2 birthdays

    // Populate friend tiles
    friends.forEach(friend => {
        const card = document.createElement("div");
        card.classList.add("friend-card");

        // Highlight upcoming birthdays
        if (upcomingBirthdays.includes(friend)) {
            card.classList.add("highlight");
        }

        card.innerHTML = `
            <img src="${friend.image}" alt="${friend.name}">
            <h3>${friend.name}</h3>
            <h3>${formatBirthday(friend.birthday)}</h3>
        `;
        card.addEventListener("click", () => showDetails(friend));
        container.appendChild(card);
    });

    function showDetails(friend) {
        if (!friend) {
            detailsContainer.style.display = "none";
            return;
        }

        // Clear existing details before updating
        detailsContainer.innerHTML = "";

        detailsContainer.innerHTML = `
            <h2>${friend.name}'s Celebrations</h2>
            <div class="tree-container">
                <div class="tree-item">🎂 Birthday: ${formatBirthday(friend.birthday) || "N/A"}</div>
                <div class="tree-item">💍 Anniversary: ${formatBirthday(friend.anniversary) || "N/A"}</div>
                
                <!-- Wedding Pic Centered -->
                ${friend.weddingPic ? `
                    <div class="wedding-container">
                        <img src="${friend.weddingPic}" alt="Wedding" class="wedding-pic">
                        <p>Wedding Day</p>
                    </div>
                ` : ''}

                <!-- Kids Positioned as Tree -->
                <div class="kids-container">
                    ${friend.kids && friend.kids.length > 0 ? `
                        ${friend.kids.map((kid, index) => `
                            <div class="kid-pic ${index % 2 === 0 ? 'left' : 'right'}">
                                <img src="${kid.image}" alt="${kid.name}" class="kid-img">
                                <p>🎈 ${kid.name} - Birthday: ${formatBirthday(kid.birthday)}</p>
                            </div>
                        `).join('')}
                    ` : `<p class="no-kids">No kids data available.</p>`}
                </div>
            </div>
        `;

        detailsContainer.style.display = "block";
    }
});
