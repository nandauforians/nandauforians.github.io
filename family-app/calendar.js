document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("data.json");
        const friends = await response.json();
        const calendarContainer = document.getElementById("calendar-container");

        let events = [];

        // Recursive function to extract birthdays & anniversaries from all generations
        function extractEvents(data, generation = 1) {
            data.forEach(person => {
                if (person.birthday) {
                    events.push({
                        name: person.name,
                        type: generation === 1 ? "🎂 Birthday" : generation === 2 ? "🎈 Kid's Birthday" : "👶 Grandkid's Birthday",
                        date: new Date(person.birthday),
                        image: person.image,
                        generation
                    });
                }
                
                // Include spouse details
                if (person.spouse) {
                    if (person.spouse.birthday) {
                        events.push({
                            name: person.spouse.name,
                            type: "🎂 Spouse's Birthday",
                            date: new Date(person.spouse.birthday),
                            image: person.spouse.image,
                            generation
                        });
                    }
                    
                    if (person.anniversary) {
                        events.push({
                            name: `${person.name} & ${person.spouse.name}`,
                            type: "💍 Anniversary",
                            date: new Date(person.anniversary),
                            image: person.weddingPic || person.image || person.spouse.image,
                            generation
                        });
                    }
                }

                if (person.kids) {
                    extractEvents(person.kids, generation + 1); // Recursively process kids
                }
            });
        }

        extractEvents(friends); // Start processing from the first generation

        // Sort events by date
        events.sort((a, b) => a.date - b.date);

        // Display events in a structured grid format
        calendarContainer.innerHTML = events.map(event => `
            <div class="event-box gen-${event.generation}">
                <div class="event-date">${event.date.toDateString()}</div>
                <div class="event-content">
                    <img src="${event.image}" alt="${event.name}">
                    <div class="event-info">
                        <h3>${event.name}</h3>
                        <p>${event.type} (Gen ${event.generation})</p>
                    </div>
                </div>
            </div>
        `).join("");

    } catch (error) {
        console.error("Error loading data.json:", error);
        document.getElementById("calendar-container").innerHTML = "<p>Failed to load events. Please check the data source.</p>";
    }
});
