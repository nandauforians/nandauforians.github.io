document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("status-text").textContent = "Please log in to continue.";
    document.getElementById("google-login-button").style.display = "block";
});

const API_GATEWAY_URL = CONFIG.API_GATEWAY_URL;
const API_KEY = CONFIG.API_KEY;

// Google Sign-In Callback with integration to API Gateway
function handleCredentialResponse(response) {
    const jwtPayload = JSON.parse(atob(response.credential.split(".")[1]));
    localStorage.setItem("google_user", JSON.stringify(jwtPayload));
    checkAuthorization(jwtPayload);
}

async function checkAuthorization(user) {
    console.log("Checking authorization for:", user.email);
    try {
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
        if (responseBody.body) {
            const parsedBody = JSON.parse(responseBody.body);
            console.log("Parsed body:", parsedBody);
            const isAuthorized = parsedBody.authorized === true;
            console.log("isAuthorized:", isAuthorized);

            if (isAuthorized) {
                window.location.href = "uforians.html";
            } else {
                const requestAccessUrl = new URL("/friends-app/request-access.html", window.location.origin);
                requestAccessUrl.searchParams.set("name", btoa(user.name));
                requestAccessUrl.searchParams.set("email", btoa(user.email));
                window.location.href = requestAccessUrl.toString();
            }
        } else {
            console.error("No body in response:", responseBody);
            document.getElementById("status-text").textContent = "Error connecting to server. Please try again later.";
        }
    } catch (error) {
        console.error("Error checking authorization:", error);
        document.getElementById("status-text").textContent = "Error connecting to server. Please try again later.";
    }
}

// Initialize Google Login Button
window.onload = function () {
    google.accounts.id.initialize({
        client_id: "903504580116-2b6bac5ktp46of9i8sd1p51sedoruapu.apps.googleusercontent.com",
        callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(
        document.getElementById("google-login-button"),
        { theme: "outline", size: "large" }
    );
};



