// In this file, you must perform all client-side validation for every single form input (and the role dropdown) on your pages. The constraints for those fields are the same as they are for the data functions and routes. Using client-side JS, you will intercept the form's submi
let profileEditForm = document.getElementById("profile-edit-form");
let inputFName = document.getElementById("fname");
let inputLName = document.getElementById("lname");
let inputGender = document.getElementById("gender");
let inputHeaderDescription = document.getElementById("headerDescription");
let inputGitHubUserName = document.getElementById("gitHubUserName");
let inputSkills = document.getElementById("skills");
let inputAboutMe = document.getElementById("aboutMe");
let inputLocationState = document.getElementById("locationState");
let inputUniversity = document.getElementById("university");
let inputCollegeMajor = document.getElementById("collegeMajor");
let errorDiv = document.getElementById("error");

if (profileEditForm) {
  profileEditForm.addEventListener("submit", (event) => {
    errorDiv.innerText = "";
    let errors = [];
    console.log(inputFName.value);

    // Validate First Name
    if (!inputFName.value || inputFName.value.trim().length === 0) {
      event.preventDefault();

      errors.push("Please enter a valid first name.");
    }

    // Validate Last Name
    if (!inputLName.value || inputLName.value.trim().length === 0) {
      event.preventDefault();

      errors.push("Please enter a valid last name.");
    }

    // Validate Gender
    console.log(inputGender.value);
    if (!inputGender.value) {
      // event.preventDefault();

      errors.push("Please select a gender.");
    }

    if (inputLocationState.value.length !== 2) {
      event.preventDefault();

      errors.push("Please select a valid state code.");
    }

    // Validate Header Description
    if (
      !inputHeaderDescription.value ||
      inputHeaderDescription.value.trim().length === 0
    ) {
      event.preventDefault();

      errors.push("Please enter a valid header description.");
    }

    // Validate GitHub UserName
    if (
      !inputGitHubUserName.value ||
      inputGitHubUserName.value.trim().length === 0
    ) {
      event.preventDefault();

      errors.push("Please enter a valid GitHub username.");
    }

    // Validate Skills
    console.log(inputSkills.value.length);
    if (!inputSkills.value) {
      event.preventDefault();

      errors.push("Please select at least two skills.");
    }

    console.log(inputSkills.length);
    if (inputSkills.length < 2) {
      event.preventDefault();
      errors.push("Please select at least two skills.");
    }

    // Validate About Me
    if (!inputAboutMe.value || inputAboutMe.value.trim().length === 0) {
      event.preventDefault();

      errors.push("Please enter a valid About Me text.");
    }

    // Validate Location State
    if (
      !inputLocationState.value ||
      inputLocationState.value.trim().length === 0
    ) {
      event.preventDefault();

      errors.push("Please enter a valid location state.");
    }

    // Validate University
    if (!inputUniversity.value || inputUniversity.value.trim().length === 0) {
      event.preventDefault();

      errors.push("Please enter a valid university.");
    }

    // Validate College Major
    if (
      !inputCollegeMajor.value ||
      inputCollegeMajor.value.trim().length === 0
    ) {
      event.preventDefault();

      errors.push("Please enter a valid college major.");
    }

    // Display errors and prevent form submission if there are any
    if (errors.length > 0) {
      event.preventDefault();
      errorDiv.innerText = errors.join("\n");
    }
  });
}
