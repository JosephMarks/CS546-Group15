let eventEditForms = document.querySelectorAll(".event-edit-form");
let errorDiv = document.getElementById("error");

if (eventEditForms) {
  eventEditForms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      errorDiv.innerText = "";
      let inputTitle = form.querySelector(".title");
      let inputEventDate = form.querySelector(".eventDate");
      let inputDescription = form.querySelector(".description");

      let titleVar = inputTitle.value;
      let eventDateVar = inputEventDate.value;
      let descriptionVar = inputDescription.value;

      if (!titleVar || !eventDateVar || !descriptionVar) {
        event.preventDefault();
        errorDiv.innerText =
          "Please ensure you have input the title, event date, and description fields - client side";
      }
      if (
        titleVar.trim().length === 0 ||
        eventDateVar.trim().length === 0 ||
        descriptionVar.trim().length === 0
      ) {
        event.preventDefault();
        errorDiv.innerText =
          "Please ensure you have not entered white space, and input fields properly - client side";
      }

      if (
        typeof titleVar !== "string" ||
        typeof eventDateVar !== "string" ||
        typeof descriptionVar !== "string"
      ) {
        event.preventDefault();
        errorDiv.innerText =
          "Please ensure title, event date, and description are strings - client side";
      }

      let currentDate = new Date();
      let inputEventDateTime = new Date(eventDateVar);

      if (inputEventDateTime <= currentDate) {
        event.preventDefault();
        errorDiv.innerText =
          "Please ensure the event date is in the future - client side";
      }
    });
  });
}
