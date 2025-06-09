// app.js

document.addEventListener("DOMContentLoaded", () => {

  // Handle Create Note Form Submission (Mobile & Desktop)
  const createFormMobile = document.querySelector("#createFormMobile");
  const createFormDesktop = document.querySelector("#createFormDesktop");

  if (createFormMobile) {
    createFormMobile.addEventListener("submit", function (e) {
      e.preventDefault();
      handleSaveNote("noteTitle", "noteContent", "Note saved successfully!");
    });
  }

  if (createFormDesktop) {
    createFormDesktop.addEventListener("submit", function (e) {
      e.preventDefault();
      handleSaveNote("noteTitleDesktop", "noteContentDesktop", "Note saved successfully!");
    });
  }

  // Handle Edit Note Form Submission (Mobile & Desktop)
  const editFormMobile = document.querySelector("#editFormMobile");
  const editFormDesktop = document.querySelector("#editFormDesktop");

  if (editFormMobile) {
    editFormMobile.addEventListener("submit", function (e) {
      e.preventDefault();
      handleSaveNote("noteTitle", "noteContent", "Note updated successfully!");
    });
  }

  if (editFormDesktop) {
    editFormDesktop.addEventListener("submit", function (e) {
      e.preventDefault();
      handleSaveNote("noteTitleDesktop", "noteContentDesktop", "Note updated successfully!");
    });
  }

  // Handle Delete Confirmation (Mobile & Desktop)
  const deleteBtnMobile = document.querySelector("#confirmDeleteMobile");
  const deleteBtnDesktop = document.querySelector("#confirmDeleteDesktop");

  if (deleteBtnMobile) {
    deleteBtnMobile.addEventListener("click", function () {
      handleDeleteNote();
    });
  }

  if (deleteBtnDesktop) {
    deleteBtnDesktop.addEventListener("click", function () {
      handleDeleteNote();
    });
  }
});

// Generic Save Handler with Enhanced Validation
function handleSaveNote(titleId, contentId, successMessage) {
  const title = document.querySelector(`#${titleId}`).value.trim();
  const content = document.querySelector(`#${contentId}`).value.trim();

  // Validation rules
  const MIN_TITLE_LENGTH = 3;
  const MAX_TITLE_LENGTH = 100;
  const MIN_CONTENT_LENGTH = 5;
  const MAX_CONTENT_LENGTH = 5000;

  if (title === "" || content === "") {
    showToast("Please fill in all fields.", "danger");
  } else if (title.length < MIN_TITLE_LENGTH) {
    showToast(`Title must be at least ${MIN_TITLE_LENGTH} characters long.`, "danger");
  } else if (title.length > MAX_TITLE_LENGTH) {
    showToast(`Title cannot exceed ${MAX_TITLE_LENGTH} characters.`, "danger");
  } else if (content.length < MIN_CONTENT_LENGTH) {
    showToast(`Content must be at least ${MIN_CONTENT_LENGTH} characters long.`, "danger");
  } else if (content.length > MAX_CONTENT_LENGTH) {
    showToast(`Content cannot exceed ${MAX_CONTENT_LENGTH} characters.`, "danger");
  } else {
    showToast(successMessage, "success");
    setTimeout(() => {
      window.location.href = "save.html";
    }, 1500);
  }
}

// Delete Handler
function handleDeleteNote() {
  showToast("Note deleted successfully!", "success");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
}

// Toast Function
function showToast(message, type) {
  const toastContainer = document.querySelector("#toastContainer");
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
