document.addEventListener("DOMContentLoaded", async function () {
    const response = await fetch("data.json");
    const friends = await response.json();
    const container = document.getElementById("friends-container");
    const detailsContainer = document.getElementById("details-container");

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
        if (!friend) return;
    
        detailsContainer.innerHTML = `
            <h2>${friend.name}'s Celebrations</h2>
            <div class="tree-container">
                <div class="tree-item">🎂 Birthday: ${formatBirthday(friend.birthday) || "N/A"}</div>
                <div class="tree-item">💍 Anniversary: ${friend.anniversary || "N/A"}</div>
    
                ${friend.weddingPic ? `
                    <div class="wedding-container">
                        <img src="${friend.weddingPic}" alt="Wedding" class="wedding-pic">
                        <p>Wedding Day</p>
                    </div>
                ` : ''}
    
                <div class="kids-container">
                    ${friend.kids ? friend.kids.map(kid => `
                        <div class="kid-pic">
                            <img src="${kid.image}" alt="${kid.name}" class="kid-img">
                            <p>🎈 ${kid.name} - Birthday: ${formatBirthday(kid.birthday)}</p>
                            
                            ${kid.kids ? `<div class="grandkids-container">
                                ${kid.kids.map(grandkid => `
                                    <div class="grandkid-pic">
                                        <img src="${grandkid.image}" alt="${grandkid.name}" class="grandkid-img">
                                        <p>🎈 ${grandkid.name} - Birthday: ${formatBirthday(grandkid.birthday)}</p>
                                    </div>
                                `).join('')}
                            </div>` : ''}
                        </div>
                    `).join('') : `<p class="no-kids">No kids data available.</p>`}
                </div>
            </div>
        `;
    
        detailsContainer.style.display = "block";
    }
    
});
