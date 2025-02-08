document.addEventListener("DOMContentLoaded", async function () {
    const response = await fetch("data.json");
    const friends = await response.json();
    const container = document.getElementById("friends-container");
    const detailsContainer = document.getElementById("details-container");

    // Populate friend tiles
    friends.forEach(friend => {
        const card = document.createElement("div");
        card.classList.add("friend-card");
        card.innerHTML = `
            <img src="${friend.image}" alt="${friend.name}">
            <h3>${friend.name}</h3>
        `;
        card.addEventListener("click", () => showDetails(friend));
        container.appendChild(card);
    });

    function showDetails(friend) {
        if (!friend) {
            detailsContainer.style.display = "none";
            return;
        }

        // Clear existing family tree before updating
        detailsContainer.innerHTML = "";

        detailsContainer.innerHTML = `
            <h2>${friend.name}'s Celebrations</h2>
            <div class="tree-container">
                <div class="tree-item">🎂 Birthday: ${friend.birthday || "N/A"}</div>
                <div class="tree-item">💍 Anniversary: ${friend.anniversary || "N/A"}</div>
                
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
                                <p>🎈 ${kid.name} - Birthday: ${kid.birthday}</p>
                            </div>
                        `).join('')}
                    ` : `<p class="no-kids">No kids data available.</p>`}
                </div>
            </div>
        `;

        detailsContainer.style.display = "block";
    }
});
