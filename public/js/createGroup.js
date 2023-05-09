const addGroupForm = document.getElementById("create-group-form");
const inputName = document.getElementById("name");
const inputDescription = document.getElementById("description");
const errorDiv = document.getElementById("error");

if (addGroupForm) {
  addActivityForm.addEventListener("submit", (event) => {
    errorDiv.innerText = "";
    const name = inputName.value.trim();
    const message = inputDescription.value.trim();

    if (!title || !message) {
      event.preventDefault();
      errorDiv.innerText = "Please fill out all required fields.";
    }

    if (typeof title !== "string" || typeof message !== "string") {
      event.preventDefault();
      errorDiv.innerText = "Please ensure you are entering text";
    }

    if (title.length === 0 || message.length === 0) {
      event.preventDefault();
      errorDiv.innerText = "Please don't enter empty strings";
    }

    if (title.length > 100) {
      event.preventDefault();
      errorDiv.innerText =
        "Title must be less than or equal to 100 characters.";
    }

    if (message.length > 200) {
      event.preventDefault();
      errorDiv.innerText =
        "Message must be less than or equal to 200 characters.";
    }
  });
}
