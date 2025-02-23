document.addEventListener("DOMContentLoaded", async function () {
    const API_GATEWAY_URL = "https://b85qcq4xrk.execute-api.us-west-2.amazonaws.com/dev/my-resource";
    const API_KEY = "79NHtBiXbg5SyfA15OBst2gAWmnB69rc9zdfY1V1";

    const container = document.getElementById("friends-container");
    const detailsContainer = document.getElementById("details-container");

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

        if (user.email === "nanda.uforians@gmail.com") {
            const adminLinkPlaceholder = document.getElementById("admin-link-placeholder");
            if (adminLinkPlaceholder) {
                const approvalLink = document.createElement("a");
                approvalLink.href = "approval.html";
                approvalLink.textContent = "🔒 Admin Approval";
                approvalLink.classList.add("calendar-link");
                adminLinkPlaceholder.appendChild(approvalLink);
            }
        }

        try {
            console.log("Checking authorization...");
            console.log(user.email);

            const response = await fetch(API_GATEWAY_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY
                },
                body: JSON.stringify({ 
                    body: JSON.stringify({ 
                        operation: "check_email", 
                        email: user.email 
                    })
                }),
                mode: "cors"
            });

            const responseBody = await response.json();
            console.log("Response from API:", responseBody);
            const parsedBody = JSON.parse(responseBody.body);
            console.log("Parsed body:", parsedBody);
            const isAuthorized = parsedBody.authorized === true;
            console.log("isAuthorized:", isAuthorized);

            if (!isAuthorized) {
                localStorage.removeItem("google_user");
                const requestAccessUrl = new URL("../friends-app/request-access.html", window.location.origin);
                requestAccessUrl.searchParams.set("name", btoa(user.name));
                requestAccessUrl.searchParams.set("email", btoa(user.email));
                window.location.href = requestAccessUrl.toString();
                return;
            }

            document.getElementById("loading").style.display = "none";
            container.style.visibility = "visible";
            container.style.opacity = "1";
            userNameDisplay.innerText = `👤 ${user.name}`;

            logoutButton.addEventListener("click", function () {
                localStorage.removeItem("google_user");
                window.location.href = "index.html";
            });

        } catch (error) {
            console.error("Error checking authorization:", error);
            showPopupNotification("Error connecting to server", true);
        }
    }

    function formatBirthday(birthday) {
        return birthday ? new Date(birthday).toLocaleDateString("en-US", { day: "numeric", month: "long" }) : "";
    }

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

    function getUpcomingEvents(friends) {
        return friends.flatMap(friend => {
            const events = [];
            if (friend.birthday && getDaysUntil(friend.birthday) <= 14) {
                events.push({ name: friend.name, type: "Birthday", date: formatBirthday(friend.birthday), image: friend.image });
            }
            if (friend.anniversary && getDaysUntil(friend.anniversary) <= 14) {
                events.push({ name: friend.name, type: "Anniversary", date: formatBirthday(friend.anniversary), image: friend.weddingPic });
            }
            return events;
        });
    }

    function showPopupNotification(message, isError = false) {
        const notification = document.createElement("div");
        notification.innerText = message;
        notification.style.position = "fixed";
        notification.style.top = "10px";
        notification.style.left = "10px";
        notification.style.padding = "8px 15px";
        notification.style.backgroundColor = isError ? "red" : "green";
        notification.style.color = "white";
        notification.style.fontSize = "13px";
        notification.style.borderRadius = "5px";
        notification.style.zIndex = "1000";
        notification.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
        notification.style.opacity = "0.9";
        
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = "0";
            setTimeout(() => document.body.removeChild(notification), 500);
        }, 3000);
    }

    function showEventNotifications(friends) {
        const upcomingEvents = getUpcomingEvents(friends);
        if (upcomingEvents.length === 0) return;
    
        const notificationContainer = document.createElement("div");
        notificationContainer.classList.add("notification-container");
        document.body.appendChild(notificationContainer);
    
        upcomingEvents.forEach(event => {
            const notification = document.createElement("div");
            notification.classList.add("event-notification");
    
            notification.innerHTML = `
                <img src="${event.image}" alt="${event.name}" class="notification-image">
                <div class="event-text">
                    <p><strong>${event.name}</strong>'s ${event.type} is coming up!</p>
                    <p>📅 ${event.date}</p>
                </div>
            `;
    
            notificationContainer.appendChild(notification);
    
            // Slide out after 5 seconds
            setTimeout(() => {
                notification.classList.add("slide-out");
                setTimeout(() => notification.remove(), 500);
            }, 5000);
        });
    }
    

    async function loadFriends() {
        try {
            const response = await fetch("data.json");
            const friends = await response.json();

            showEventNotifications(friends);

            friends.forEach(friend => {
                const card = document.createElement("div");
                card.classList.add("friend-card");
                card.innerHTML = `
                    <img src="${friend.image}" alt="${friend.name}">
                    <h3>${friend.name}</h3>
                    <h3>${formatBirthday(friend.birthday)}</h3>
                `;
                card.addEventListener("click", () => showDetails(friend));
                container.appendChild(card);
            });
        } catch (error) {
            console.error("Error loading friends:", error);
            showPopupNotification("Failed to load friends data", true);
        }
    }

    function showDetails(friend) {
        if (!friend) {
            detailsContainer.style.display = "none";
            return;
        }

        detailsContainer.innerHTML = `
            <h2 align="center">${friend.name}'s Celebrations</h2>
            <div class="tree-container">
                <div class="tree-item" align="center">🎂 Birthday: ${formatBirthday(friend.birthday) || "N/A"}</div>
                <div class="tree-item" align="center">💍 Anniversary: ${formatBirthday(friend.anniversary) || "N/A"}</div>
                
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

    loadFriends();
});
