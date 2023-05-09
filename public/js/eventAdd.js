const addEventForm = document.getElementById("event-add-form");
const inputTitle = document.getElementById("title");
const inputDescription = document.getElementById("description");
const inputEventDate = document.getElementById("eventDate");
const errorDiv = document.getElementById("error");

if (addEventForm) {
  addEventForm.addEventListener("submit", (event) => {
    errorDiv.innerText = "";
    const title = inputTitle.value.trim();
    const description = inputDescription.value.trim();
    const eventDate = inputEventDate.value;

    if (!title || !description || !eventDate) {
      event.preventDefault();
      errorDiv.innerText = "Please fill out all required fields.";
    }

    if (typeof title !== "string" || typeof description !== "string") {
      event.preventDefault();
      errorDiv.innerText = "Please ensure you are entering text";
    }

    if (title.length === 0 || description.length === 0) {
      event.preventDefault();
      errorDiv.innerText = "Please don't enter empty strings";
    }

    const now = new Date();
    const inputDate = new Date(eventDate);
    if (inputDate < now) {
      event.preventDefault();
      errorDiv.innerText = "Please choose a future date.";
    }

    if (title.length > 100) {
      event.preventDefault();
      errorDiv.innerText =
        "Title must be less than or equal to 100 characters.";
    }

    if (description.length > 200) {
      event.preventDefault();
      errorDiv.innerText =
        "Description must be less than or equal to 200 characters.";
    }
  });
}
