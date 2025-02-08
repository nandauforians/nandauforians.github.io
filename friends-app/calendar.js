document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("data.json");
        const friends = await response.json();
        const calendarContainer = document.getElementById("calendar-container");

        let events = [];

        // Extract all birthdays, anniversaries, and kids' birthdays
        friends.forEach(friend => {
            if (friend.birthday) {
                events.push({
                    name: friend.name,
                    type: "🎂 Birthday",
                    date: new Date(friend.birthday),
                    image: friend.image
                });
            }
            if (friend.anniversary) {
                events.push({
                    name: friend.name,
                    type: "💍 Anniversary",
                    date: new Date(friend.anniversary),
                    image: friend.weddingPic || friend.image
                });
            }
            if (friend.kids) {
                friend.kids.forEach(kid => {
                    events.push({
                        name: kid.name,
                        type: "🎈 Kid's Birthday",
                        date: new Date(kid.birthday),
                        image: kid.image
                    });
                });
            }
        });

        // Sort events by date
        events.sort((a, b) => a.date - b.date);

        // Display events in a structured grid format
        calendarContainer.innerHTML = events.map(event => `
            <div class="event-box">
                <div class="event-date">${event.date.toDateString()}</div>
                <div class="event-content">
                    <img src="${event.image}" alt="${event.name}">
                    <div class="event-info">
                        <h3>${event.name}</h3>
                        <p>${event.type}</p>
                    </div>
                </div>
            </div>
        `).join("");

    } catch (error) {
        console.error("Error loading data.json:", error);
        document.getElementById("calendar-container").innerHTML = "<p>Failed to load events. Please check the data source.</p>";
    }
});
