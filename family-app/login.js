document.addEventListener("DOMContentLoaded", function () {
    const user = localStorage.getItem("google_user");

    if (user) {
        window.location.href = "family.html"; // Redirect if already logged in
    } else {
        document.getElementById("status-text").textContent = "Please log in to continue.";
        document.getElementById("google-login-button").style.display = "block";
    }
});

// Google Sign-In Callback
function handleCredentialResponse(response) {
    const jwtPayload = JSON.parse(atob(response.credential.split(".")[1]));

    localStorage.setItem("google_user", JSON.stringify(jwtPayload)); // Ensure consistency
    window.location.href = "family.html"; // Redirect to the main content page
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



