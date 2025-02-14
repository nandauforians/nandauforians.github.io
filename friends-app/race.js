document.addEventListener("DOMContentLoaded", async function () {
    const raceContainer = document.getElementById("race-container");

    if (!raceContainer) {
        console.error("Error: raceContainer not found!");
        return;
    }

    async function fetchFriendsData() {
        try {
            const response = await fetch("data.json");
            const friends = await response.json();

            return friends.map(friend => {
                const daysTo50 = calculateDaysTo50(friend.birthday);
                return {
                    name: friend.name,
                    image: friend.image || "default.jpg",
                    daysTo50: daysTo50
                };
            }).sort((a, b) => a.daysTo50 - b.daysTo50); // Sort ascending (negative values at the bottom)
        } catch (error) {
            console.error("Error fetching data.json:", error);
            return [];
        }
    }

    function calculateDaysTo50(birthday) {
        if (!birthday) return 0;

        const birthDate = new Date(birthday);
        if (isNaN(birthDate)) {
            console.error("Invalid date format for:", birthday);
            return 0;
        }

        const age50Date = new Date(birthDate);
        age50Date.setFullYear(birthDate.getFullYear() + 50);

        const today = new Date();
        return Math.floor((age50Date - today) / (1000 * 60 * 60 * 24)); // Negative if past 50
    }

    async function renderRaceChart() {
        const friends = await fetchFriendsData();
        raceContainer.innerHTML = ""; // Clear previous content

        // Find the max days to 50 (for scaling the bars)
        const maxDays = Math.max(...friends.map(friend => Math.abs(friend.daysTo50)), 50); // At least 50 to avoid division by zero

        friends.forEach(friend => {
            const barContainer = document.createElement("div");
            barContainer.classList.add("bar-container");

            const img = document.createElement("img");
            img.src = friend.image;
            img.alt = friend.name;
            img.classList.add("friend-image");

            const nameLabel = document.createElement("span");
            nameLabel.textContent = friend.name;
            nameLabel.classList.add("friend-name");

            const progressBar = document.createElement("div");
            progressBar.classList.add("race-bar");

            // Scale bar width dynamically
            const scaledWidth = (Math.abs(friend.daysTo50) / maxDays) * 100;
            progressBar.style.width = `${scaledWidth}%`;

            // Bar color logic: Red if past 50, Green otherwise
            const isPast50 = friend.daysTo50 < 0;
            progressBar.style.backgroundColor = isPast50 ? "red" : "green";

            // Create text inside the bar
            const progressText = document.createElement("span");
            progressText.classList.add("progress-text");
            progressText.textContent = `${friend.daysTo50} days to 50`;

            // Adjust text color for visibility
            progressText.style.color = "white";
            progressText.style.fontWeight = "bold";
            progressText.style.textAlign = "center";
            progressText.style.width = "100%";
            progressText.style.display = "block";
            progressText.style.lineHeight = "30px"; // Ensure it's vertically centered

            // Append elements
            progressBar.appendChild(progressText);
            barContainer.appendChild(img);
            barContainer.appendChild(nameLabel);
            barContainer.appendChild(progressBar);

            raceContainer.appendChild(barContainer);
        });
    }

    renderRaceChart();
});
