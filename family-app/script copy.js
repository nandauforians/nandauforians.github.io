document.addEventListener("DOMContentLoaded", async function () {
    const response = await fetch("data.json");
    const friends = await response.json();
    const container = document.getElementById("friends-container");
    const detailsContainer = document.getElementById("details-container");
    const calendarContainer = document.getElementById("calendar-container");

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

    // Gather all events for calendar view
    let events = [];
    friends.forEach(friend => {
        if (friend.birthday) {
            events.push({ name: friend.name, type: "🎂 Birthday", date: friend.birthday, image: friend.image });
        }
        if (friend.anniversary) {
            events.push({ name: friend.name, type: "💍 Anniversary", date: friend.anniversary, image: friend.weddingPic || friend.image });
        }
        if (friend.kids) {
            friend.kids.forEach(kid => {
                events.push({ name: kid.name, type: "🎈 Kid's Birthday", date: kid.birthday, image: kid.image });
            });
        }
    });

    // Sort events by date
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Populate the calendar view
    events.forEach(event => {
        const eventCard = document.createElement("div");
        eventCard.classList.add("event-card");
        eventCard.innerHTML = `
            <div class="event-date">${new Date(event.date).toDateString()}</div>
            <div class="event-content">
                <img src="${event.image}" alt="${event.name}">
                <div class="event-info">
                    <h3>${event.name}</h3>
                    <p>${event.type}</p>
                </div>
            </div>
        `;
        calendarContainer.appendChild(eventCard);
    });

    function showDetails(friend) {
        if (!friend) {
            detailsContainer.style.display = "none";
            return;
        }

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
