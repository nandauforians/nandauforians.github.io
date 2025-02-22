document.addEventListener("DOMContentLoaded", async function () {
    const response = await fetch("data.json");
    const friends = await response.json();
    const container = document.getElementById("friends-container");
    const detailsContainer = document.getElementById("details-container");

    // Handle user authentication & login flow
    await handleUserAuthentication();

    async function handleUserAuthentication() {
        const user = JSON.parse(localStorage.getItem("google_user"));
        const logoutButton = document.getElementById("logout-btn");
        const userNameDisplay = document.getElementById("user-name");

        if (!user || !user.email) {
            localStorage.removeItem("google_user");
            window.location.href = "index.html";
            return;
        }

        const approvedResponse = await fetch("uforians.json");
        const approvedEmails = await approvedResponse.json();

        if (!approvedEmails.includes(user.email)) {
            localStorage.removeItem("google_user");
            const requestAccessUrl = new URL("./friends-app/request-access.html", window.location.origin);
            const encryptedName = btoa(user.name);
            const encryptedEmail = btoa(user.email);
            requestAccessUrl.searchParams.set("name", encryptedName);
            requestAccessUrl.searchParams.set("email", encryptedEmail);
            window.location.href = requestAccessUrl.toString();
            return;
        }

        document.getElementById("loading").style.display = "none";
        container.style.visibility = "visible";
        container.style.opacity = "1";
        userNameDisplay.innerText = `👤 ${user.name}`;

        // Handle logout
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("google_user");
            window.location.href = "index.html";
        });
    }

    function formatBirthday(birthday) {
        if (!birthday) return "";
        const date = new Date(birthday);
        return date.toLocaleDateString("en-US", { day: "numeric", month: "long" });
    }

    function calculateAge(birthday) {
        if (!birthday) return null;
        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    function daysToFifty(birthday) {
        if (!birthday) return Infinity;
        const birthDate = new Date(birthday);
        const age = calculateAge(birthday);
        
        if (age >= 50) return Infinity; 

        const fiftyBirthday = new Date(birthDate);
        fiftyBirthday.setFullYear(birthDate.getFullYear() + 50);

        const today = new Date();
        const timeDiff = fiftyBirthday - today;
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    }

    function getSortableDate(birthday) {
        if (!birthday) return 9999;
        const date = new Date(birthday);
        return date.getMonth() * 100 + date.getDate();
    }

    const today = new Date();
    const todaySortable = today.getMonth() * 100 + today.getDate();

    // Sort by shortest time to reach 50 years
    friends.sort((a, b) => daysToFifty(a.birthday) - daysToFifty(b.birthday));

    // Find next 2 upcoming birthdays (ignoring sorting by 50)
    const upcomingBirthdays = friends
        .filter(friend => getSortableDate(friend.birthday) >= todaySortable)
        .sort((a, b) => getSortableDate(a.birthday) - getSortableDate(b.birthday))
        .slice(0, 2);

    function getDaysUntil(date) {
            if (!date) return Infinity;
            const eventDate = new Date(date);
            const today = new Date();
            eventDate.setFullYear(today.getFullYear());
            if (eventDate < today) {
                eventDate.setFullYear(today.getFullYear() + 1);
            }
            return Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
        }

     function getUpcomingEvents() {
        const today = new Date();
        return friends.flatMap(friend => {
            const events = [];
            if (friend.birthday) {
                const daysToBirthday = getDaysUntil(friend.birthday);
                if (daysToBirthday <= 14) {
                    events.push({ name: friend.name, type: "Birthday", date: formatBirthday(friend.birthday), image: friend.image });
                }
            }
            if (friend.anniversary) {
                const daysToAnniversary = getDaysUntil(friend.anniversary);
                if (daysToAnniversary <= 14) {
                    events.push({ name: friend.name, type: "Anniversary", date: formatBirthday(friend.anniversary), image: friend.weddingPic });
                }
            }
            return events;
        });
    }

    function showNotifications() {
        const upcomingEvents = getUpcomingEvents();
        if (upcomingEvents.length === 0) return;

        const notificationContainer = document.createElement("div");
        notificationContainer.classList.add("notification-container");
        document.body.appendChild(notificationContainer);

        upcomingEvents.forEach(event => {
            const notification = document.createElement("div");
            notification.classList.add("notification");
            notification.innerHTML = `
                <img src="${event.image}" alt="${event.type}" class="notification-img">
                <div class="notification-content">
                    <p class="notification-text"><strong>${event.name}</strong>'s ${event.type} is coming up!</p>
                    <p class="notification-date">📅 ${event.date}</p>
                </div>
            `;
            notificationContainer.appendChild(notification);

            setTimeout(() => {
                notification.remove();
                if (notificationContainer.childElementCount === 0) {
                    notificationContainer.remove();
                }
            }, 10000);
        });
    }

    showNotifications();

    friends.forEach(friend => {
        const card = document.createElement("div");
        card.classList.add("friend-card");

        if (upcomingBirthdays.includes(friend)) {
            card.classList.add("highlight");
        }

        const daysLeft = daysToFifty(friend.birthday);
        const daysTo50Text = daysLeft !== Infinity ? `<p class="fifty-countdown">🎈 ${daysLeft} days to 50!</p>` : '';

        card.innerHTML = `
            <img src="${friend.image}" alt="${friend.name}">
            <h3>${friend.name}</h3>
            <h3>${formatBirthday(friend.birthday)}</h3>
            ${daysTo50Text}
        `;
        card.addEventListener("click", () => showDetails(friend));
        container.appendChild(card);
    });

    function showDetails(friend) {
        if (!friend) {
            detailsContainer.style.display = "none";
            return;
        }

        detailsContainer.innerHTML = `
            <h2>${friend.name}'s Celebrations</h2>
            <div class="tree-container">
                <div class="tree-item">🎂 Birthday: ${formatBirthday(friend.birthday) || "N/A"}</div>
                <div class="tree-item">💍 Anniversary: ${formatBirthday(friend.anniversary) || "N/A"}</div>
                
                ${friend.weddingPic ? `
                    <div class="wedding-container">
                        <img src="${friend.weddingPic}" alt="Wedding" class="wedding-pic">
                        <p>Wedding Day</p>
                    </div>
                ` : ''}

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

const style = document.createElement('style');
style.innerHTML = `
    .notification-container {
        position: fixed;
        top: 20px;
        left: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 1000;
    }
    .notification {
       background: #fffae5;
        color: #333;
        padding: 10px 15px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        font-size: 14px;
        font-weight: bold;
        animation: fadeOut 10s forwards;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .notification-img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
    .notification-content {
        display: flex;
        flex-direction: column;
    }
    @keyframes fadeOut {
        0% { opacity: 1; }
        90% { opacity: 1; }
        100% { opacity: 0; }
    }
`;
document.head.appendChild(style);
