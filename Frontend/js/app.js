//  Protect routes/pages
function checkAuth() {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    alert("You must login first!");
    window.location.href = "login.html";
  } else {
    fetch("/api/auth/verify", {
      method: "GET",
      headers: getAuthHeaders()
    })
      .then(res => {
        if (!res.ok) throw new Error("Session expired or invalid");
        return res.json();
      })
      .then(data => {
        console.log("Authenticated as:", data.user);
      })
      .catch(err => {
        alert("Session expired. Please login again.");
        logout();
      });
  }
}

//  Logout logic
function logout() {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

// Auth header for API
function getAuthHeaders() {
  const token = localStorage.getItem("jwtToken");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

// Optional: Pre-fill user info or hide/show UI parts
function loadUserInfo() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.username) {
    const userDisplay = document.getElementById("user-info");
    if (userDisplay) userDisplay.textContent = `Logged in as: ${user.username}`;
  }
}

// Call these on page load (for protected pages)
document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  loadUserInfo();
});
