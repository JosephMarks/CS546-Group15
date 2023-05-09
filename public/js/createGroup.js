const addGroupForm = document.getElementById("create-group-form");
const inputName = document.getElementById("name");
const inputDescription = document.getElementById("description");
const errorDiv = document.getElementById("error");

if (addGroupForm) {
  addGroupForm.addEventListener("submit", (event) => {
    console.log("...i got here");
    errorDiv.innerText = "";
    const name = inputName.value.trim();
    const description = inputDescription.value.trim();

    if (!name || !description) {
      event.preventDefault();
      errorDiv.innerText = "Please fill out all required fields.";
    }

    if (typeof name !== "string" || typeof description !== "string") {
      event.preventDefault();
      errorDiv.innerText = "Please ensure you are entering text";
    }

    if (name.length === 0 || description.length === 0) {
      event.preventDefault();
      errorDiv.innerText = "Please don't enter empty strings";
    }

    if (name.length > 100) {
      event.preventDefault();
      errorDiv.innerText =
        "Title must be less than or equal to 100 characters.";
    }

    if (description.length > 200) {
      event.preventDefault();
      errorDiv.innerText =
        "Message must be less than or equal to 200 characters.";
    }
  });
}
