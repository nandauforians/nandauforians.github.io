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

    // Parse the event data into a structured format
    function parseEvents(data) {
        let events = [];
        data.forEach(person => {
            if (person.birthday) {
                events.push({ name: person.name, type: "Birthday", date: new Date(person.birthday), image: person.image });
            }
            if (person.anniversary) {
                events.push({ name: person.name, type: "Anniversary", date: new Date(person.anniversary), image: person.weddingPic || person.image });
            }
            if (person.kids) {
                person.kids.forEach(kid => {
                    events.push({ name: kid.name, type: "Birthday", date: new Date(kid.birthday), image: kid.image });
                });
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
            const eventsForDay = eventsData.filter(event => event.date.getDate() === day && event.date.getMonth() === month);

            if (eventsForDay.length > 0) {
                eventsForDay.forEach(event => {
                    const eventDiv = document.createElement("div");
                    eventDiv.classList.add("event");
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
