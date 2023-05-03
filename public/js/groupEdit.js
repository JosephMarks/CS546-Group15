// In this file, you must perform all client-side validation for every single form input (and the role dropdown) on your pages. The constraints for those fields are the same as they are for the data functions and routes. Using client-side JS, you will intercept the form's submi
let groupEditForm = document.getElementById("group-edit-form");
let inputName = document.getElementById("name");
let inputDescription = document.getElementById("description");
let inputImage = document.getElementById("image");
let errorDiv = document.getElementById("error");

if (groupEditForm) {
  groupEditForm.addEventListener("submit", (event) => {
    errorDiv.innerText = "";
    let nameVar = inputName.value;
    let descriptionVar = inputDescription.value;
    let imageVar = inputImage.value;

    if (!nameVar || !descriptionVar) {
      event.preventDefault();
      errorDiv.innerText =
        "please ensure you have input the name and description fields - client side";
    }
    if (nameVar.trim().length === 0 || descriptionVar.trim().length === 0) {
      event.preventDefault();
      errorDiv.innerText =
        "please ensure you have not entered white space, and inputting forms properly - client side";
    }

    if (typeof nameVar !== "string" || typeof descriptionVar !== "string") {
      event.preventDefault();
      errorDiv.innerText =
        "please ensure name and description are strings - client side";
    }
    if (!imageVar) {
      event.preventDefault();
      errorDiv.innerText = "please ensure there is an image being loaded";
    }
  });
}
