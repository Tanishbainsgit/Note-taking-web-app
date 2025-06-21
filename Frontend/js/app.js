document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    window.location.href = "login.html"; // Redirect if not logged in
    return;
  }

  // Handle Create Note Form Submission (Mobile & Desktop)
  setupForm("#createFormMobile", "noteTitle", "noteContent", "Note saved successfully!", "create");
  setupForm("#createFormDesktop", "noteTitleDesktop", "noteContentDesktop", "Note saved successfully!", "create");

  // Handle Edit Note Form Submission (Mobile & Desktop)
  setupForm("#editFormMobile", "noteTitle", "noteContent", "Note updated successfully!", "edit");
  setupForm("#editFormDesktop", "noteTitleDesktop", "noteContentDesktop", "Note updated successfully!", "edit");

  // Handle Delete Confirmation (Mobile & Desktop)
  setupDelete("#confirmDeleteMobile");
  setupDelete("#confirmDeleteDesktop");
});

// Setup Form Handler
function setupForm(formSelector, titleId, contentId, successMessage, action) {
  const form = document.querySelector(formSelector);
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    handleSaveNote(titleId, contentId, successMessage, action);
  });
}

// Setup Delete Handler
function setupDelete(buttonId) {
  const btn = document.querySelector(buttonId);
  if (!btn) return;

  btn.addEventListener("click", handleDeleteNote);
}

// Save Handler
function handleSaveNote(titleId, contentId, successMessage, action) {
  const title = document.querySelector(`#${titleId}`).value.trim();
  const content = document.querySelector(`#${contentId}`).value.trim();

  const MIN_TITLE_LENGTH = 3, MAX_TITLE_LENGTH = 100;
  const MIN_CONTENT_LENGTH = 5, MAX_CONTENT_LENGTH = 5000;

  if (title === "" || content === "") {
    showToast("Please fill in all fields.", "danger");
    return;
  } else if (title.length < MIN_TITLE_LENGTH) {
    showToast(`Title must be at least ${MIN_TITLE_LENGTH} characters.`, "danger");
    return;
  } else if (title.length > MAX_TITLE_LENGTH) {
    showToast(`Title cannot exceed ${MAX_TITLE_LENGTH} characters.`, "danger");
    return;
  } else if (content.length < MIN_CONTENT_LENGTH) {
    showToast(`Content must be at least ${MIN_CONTENT_LENGTH} characters.`, "danger");
    return;
  } else if (content.length > MAX_CONTENT_LENGTH) {
    showToast(`Content cannot exceed ${MAX_CONTENT_LENGTH} characters.`, "danger");
    return;
  }

  // Prepare request
  const token = localStorage.getItem("jwtToken");
  const noteData = { title, content };
  const url = action === "edit"
    ? `/api/notes/${getNoteIdFromURL()}`
    : `/api/notes`;
  const method = action === "edit" ? "PUT" : "POST";

  fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(noteData)
  })
  .then(res => {
    if (!res.ok) throw new Error("Failed to save note.");
    return res.json();
  })
  .then(() => {
    showToast(successMessage, "success");
    setTimeout(() => window.location.href = "save.html", 1500);
  })
  .catch(err => {
    console.error(err);
    showToast("Something went wrong.", "danger");
  });
}

// Delete Note
function handleDeleteNote() {
  const token = localStorage.getItem("jwtToken");
  const noteId = getNoteIdFromURL();

  fetch(`/api/notes/${noteId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(res => {
    if (!res.ok) throw new Error("Failed to delete note.");
    showToast("Note deleted successfully!", "success");
    setTimeout(() => window.location.href = "index.html", 1500);
  })
  .catch(err => {
    console.error(err);
    showToast("Something went wrong.", "danger");
  });
}

// Utility to extract note ID from URL (e.g. ?id=1234)
function getNoteIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Toast Function
function showToast(message, type) {
  const toastContainer = document.querySelector("#toastContainer");
  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-white bg-${type} border-0 mb-2`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;

  toastContainer.appendChild(toast);
  const bootstrapToast = new bootstrap.Toast(toast);
  bootstrapToast.show();
}
