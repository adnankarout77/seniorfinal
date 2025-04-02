//nav mobile
document.querySelector(".hamburger-menu").addEventListener("click", function() {
    document.querySelector(".nav-links").classList.toggle("show");
});
//enter full credentials
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form");

    loginForm.addEventListener("submit", function (event) {
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (email === "" || password === "") {
            event.preventDefault();
            alert("Please enter both email and password.");
        }
    });
});
//toggle view
document.addEventListener("DOMContentLoaded", function () {
    const passwordField = document.getElementById("password");

    // Create the eye icon button
    const togglePassword = document.createElement("span");
    togglePassword.innerHTML = "👁️";  
    togglePassword.style.cursor = "pointer";
    togglePassword.style.position = "absolute";
    togglePassword.style.right = "10px";
    togglePassword.style.top = "50%";
    togglePassword.style.transform = "translateY(-50%)";

    // Create a wrapper div to hold the input and icon
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.width = "100%";

    // Insert the password field and eye icon into the wrapper
    passwordField.parentNode.insertBefore(wrapper, passwordField);
    wrapper.appendChild(passwordField);
    wrapper.appendChild(togglePassword);

    // Toggle password visibility on click
    togglePassword.addEventListener("click", function () {
        passwordField.type = passwordField.type === "password" ? "text" : "password";
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".login-container form"); // Selects form inside .login-container

    if (form) {
        form.addEventListener("submit", function (event) {
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            const confirmPassword = document.getElementById("confirm-password").value.trim();

            // Check if all fields are filled
            if (!name || !email || !password || !confirmPassword) {
                event.preventDefault();
                alert("All fields are required.");
                return;
            }

            // Medium Strength Password Validation (At least 8 characters, one letter, one number)
            const passwordRegex = /^.{8,}$/;

            if (!passwordRegex.test(password)) {
                event.preventDefault();
                alert("Password must be at least 8 characters long and include a letter and a number.");
                return;
            }

            // Confirm Password Match
            if (password !== confirmPassword) {
                event.preventDefault();
                alert("Passwords do not match.");
                return;
            }

            // If everything is correct, form will submit
        });
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const timelineEvents = document.querySelectorAll(".timeline-event");

    function checkScroll() {
        timelineEvents.forEach(event => {
            const eventTop = event.getBoundingClientRect().top;
            if (eventTop < window.innerHeight - 100) {
                event.classList.add("visible");
            }
        });
    }

    window.addEventListener("scroll", checkScroll);
    checkScroll();
});
document.addEventListener("DOMContentLoaded", function () {
    const forms = document.querySelectorAll("form");

    forms.forEach(form => {
        form.addEventListener("submit", function (event) {
            const inputs = form.querySelectorAll("input, textarea");
            inputs.forEach(input => {
                // Remove any malicious characters
                input.value = input.value.replace(/<[^>]*>?/gm, "");
            });
        });
    });
});
//allow 5 loginattempts (prevent brute force attack)
let loginAttempts = 0;
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("#login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!email || !password) {
                event.preventDefault();
                alert("Both fields are required.");
                return;
            }

            loginAttempts++;
            if (loginAttempts >= 5) {
                event.preventDefault();
                alert("Too many failed login attempts. Try again later.");
            }
        });
    }
});
//logout after 15mins (session handling)
let inactivityTime = 0;
const logoutTimer = setInterval(() => {
    inactivityTime++;
    if (inactivityTime >= 15) { // 15 minutes
        alert("You have been logged out due to inactivity.");
        window.location.href = "index.html"; // Redirect to logout page
    }
}, 60000); // Check every minute

document.addEventListener("mousemove", () => inactivityTime = 0);
document.addEventListener("keydown", () => inactivityTime = 0);
//Detect User Location
function detectLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async function(position) {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                
                // Use OpenStreetMap's Nominatim API for reverse geocoding (free service)
                let apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
                
                try {
                    let response = await fetch(apiUrl);
                    let data = await response.json();
                    if (data && data.display_name) {
                        document.getElementById("location").value = data.display_name;
                    } else {
                        alert("Location not found. Please enter manually.");
                    }
                } catch (error) {
                    alert("Error fetching location. Please enter manually.");
                }
            },
            function(error) {
                alert("Location access denied. Please enter manually.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// List of Banned Words
const bannedWords = [];

// Function to Check for Profanity
function containsProfanity(text) {
    return bannedWords.some(word => text.toLowerCase().includes(word));
}

// Function to Validate Forms
function validateForm(event) {
    event.preventDefault(); // Prevent form submission

    let inputs = document.querySelectorAll("input, textarea");
    for (let input of inputs) {
        if (containsProfanity(input.value)) {
            alert("Your submission contains inappropriate language. Please remove it.");
            return false;
        }
    }

    // If no profanity detected, submit the form
    event.target.submit();
}

// Attach to All Forms
document.addEventListener("DOMContentLoaded", function () {
    let forms = document.querySelectorAll("form");
    forms.forEach(form => {
        form.addEventListener("submit", validateForm);
    });
});
//Image Upload Preview
function previewImage() {
    let fileInput = document.getElementById("request-image");
    let preview = document.getElementById("image-preview");
    
    if (fileInput.files.length > 0) {
        let file = fileInput.files[0];
        if (file.type === "image/png") {
            let reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = "block";
            };
            reader.readAsDataURL(file);
        } else {
            alert("Only PNG images are allowed.");
            fileInput.value = ""; // Reset input field
            preview.style.display = "none";
        }
    }
}
const API_BASE = "http://localhost:5000"; // Change to your server URL

// Post a Donation Request (For Recipients)
document.getElementById("requestForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const token = localStorage.getItem("token"); // Get token from local storage

    const response = await fetch(`${API_BASE}/request-donation`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, category })
    });

    const data = await response.json();
    alert(data.message);
    document.getElementById("requestForm").reset();
    loadRequests(); // Reload requests after posting
});

// Load Available Requests (For Donors)
async function loadRequests() {
    const response = await fetch(`${API_BASE}/available-requests`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });

    const requests = await response.json();
    const container = document.getElementById("requestsContainer");
    container.innerHTML = ""; // Clear previous requests

    requests.forEach(request => {
        const requestDiv = document.createElement("div");
        requestDiv.className = "request";
        requestDiv.innerHTML = `
            <h3>${request.title}</h3>
            <p>${request.description}</p>
            <p><strong>Category:</strong> ${request.category}</p>
            <p><strong>Recipient:</strong> ${request.recipient_name}</p>
            <button onclick="acceptRequest(${request.id})">Accept Request</button>
        `;
        container.appendChild(requestDiv);
    });
}

// Accept a Donation Request (For Donors)
async function acceptRequest(requestId) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE}/respond-to-request`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ request_id: requestId })
    });

    const data = await response.json();
    alert(data.message);
    loadRequests(); // Reload after accepting
}

//  Load Requests on Page Load
window.onload = loadRequests;

document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");

    if (!signupForm) {
        console.error("❌ Signup form not found!");
        return;
    }
    
    console.log("✅ Signup form found, event listener attached.");
    
    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        console.log("🚀 Signup form submitted!");

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;

        try {
            console.log("✔ Server Response Data:", data);
            const response = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role })
            });

            const data = await response.json();
            console.log("📡 Server Response:", data);

            if (true) {
                alert("✅ Signup successful! Redirecting to login...");
                setTimeout(() => {
                    console.log("Redirecting");
                    window.location.replace = "http://localhost:5000/login.html";
                }, 1000);                
            } else {
                alert("❌ Signup Failed: " + data.error);
            }
        } catch (error) {
            console.error("Signup Error:", error);
            alert("An error occurred. Please try again.");
        }
    });
});



document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    if (!loginForm) {
        console.error("Login form not found!");
        return;
    }

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (response.ok) {
                alert("Login successful! Redirecting...");
                localStorage.setItem("token", data.token);

                // ✅ Redirect based on role
                if (data.role === "donor") {
                    window.location.href = "donor-dashboard.html";
                } else {
                    window.location.href = "recepeint-dashboard.html";
                }
            } else {
                alert("Login failed: " + data.error);
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("An error occurred. Please try again.");
        }
    });
});









