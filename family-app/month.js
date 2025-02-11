document.addEventListener("DOMContentLoaded", () => {
    const calendarContainer = document.getElementById("calendar-container");
    const monthTitle = document.getElementById("month-title");
    const prevMonthBtn = document.getElementById("prev-month");
    const nextMonthBtn = document.getElementById("next-month");

    let currentDate = new Date();
    let eventsData = [];

    // Fetch event data from data.json
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            eventsData = parseEvents(data);
            renderCalendar();
        })
        .catch(error => console.error("Error loading data:", error));

    // Recursively parse events for all generations
    function parseEvents(data, generation = 1) {
        let events = [];
        data.forEach(person => {
            if (person.birthday) {
                events.push({ name: person.name, type: "Birthday", date: new Date(person.birthday), image: person.image, generation });
            }

            // Include spouse details with correct formatting
            if (person.spouse) {
                if (person.spouse.birthday) {
                    events.push({ name: person.spouse.name, type: "Birthday", date: new Date(person.spouse.birthday), image: person.spouse.image, generation });
                }
                if (person.anniversary) {
                    events.push({
                        name: `${person.name} & ${person.spouse.name}`,
                        type: "Anniversary",
                        date: new Date(person.anniversary),
                        image: person.weddingPic || person.image || person.spouse.image,
                        generation
                    });
                }
            }

            if (person.kids) {
                events = events.concat(parseEvents(person.kids, generation + 1)); // Recursively add kids' events
            }
        });
        return events;
    }

    // Render the calendar
    function renderCalendar() {
        calendarContainer.innerHTML = "";

        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        monthTitle.textContent = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(currentDate);

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Create empty slots for first week padding
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.classList.add("calendar-day", "empty");
            calendarContainer.appendChild(emptyCell);
        }

        // Create day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement("div");
            dayCell.classList.add("calendar-day");
            dayCell.textContent = day;

            // Check for events on this day
            const eventDate = new Date(year, month, day);
            const eventsForDay = eventsData.filter(event => 
                event.date.getDate() === day && event.date.getMonth() === month
            );

            if (eventsForDay.length > 0) {
                eventsForDay.forEach(event => {
                    const eventDiv = document.createElement("div");
                    eventDiv.classList.add("event", `gen-${event.generation}`);
                    eventDiv.innerHTML = `<img src="${event.image}" alt="${event.name}"><br>${event.name}'s ${event.type}`;
                    dayCell.appendChild(eventDiv);
                });
            }

            calendarContainer.appendChild(dayCell);
        }
    }

    // Event Listeners for navigating months
    prevMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
});
