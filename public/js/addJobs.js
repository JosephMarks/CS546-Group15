document.addEventListener("DOMContentLoaded", () => {
  function parseDate(dateString) {
    const dateRegex =
      /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/;

    if (!dateRegex.test(dateString)) {
      return null;
    }

    const [month, day, year] = dateString.split("/");
    return new Date(year, month - 1, day);
  }

  const addJobHistoryForm = document.getElementById("job-history-form");
  const inputRole = document.getElementById("role");
  const inputOrganization = document.getElementById("organization");
  const inputStartDate = document.getElementById("startDate");
  const inputEndDate = document.getElementById("endDate");
  const inputDescription = document.getElementById("description");
  const errorDiv = document.createElement("div");
  errorDiv.setAttribute("id", "error");
  errorDiv.style.color = "red";
  addJobHistoryForm.parentElement.insertBefore(errorDiv, addJobHistoryForm);

  if (addJobHistoryForm) {
    addJobHistoryForm.addEventListener("submit", (event) => {
      errorDiv.innerText = "";
      const role = inputRole.value.trim();
      const organization = inputOrganization.value.trim();
      const startDate = inputStartDate.value;
      const endDate = inputEndDate.value;
      const description = inputDescription.value.trim();

      // Check for empty fields
      if (!role || !organization || !startDate || !endDate || !description) {
        event.preventDefault();
        errorDiv.innerText = "Please fill out all required fields.";
      }

      let regex = /^[a-zA-Z_ ]*$/g;
      if (!regex.test(role)) {
        event.preventDefault();
        errorDiv.innerText =
          "Please ensure role doesn't include numbers or special characters.";
        return;
      }

      // Check for valid strings
      if (
        typeof role !== "string" ||
        typeof organization !== "string" ||
        typeof description !== "string"
      ) {
        event.preventDefault();
        errorDiv.innerText = "Please ensure you are entering text";
      }

      // Check for empty strings
      if (
        role.length === 0 ||
        organization.length === 0 ||
        description.length === 0
      ) {
        event.preventDefault();
        errorDiv.innerText = "Please don't enter empty strings";
      }

      // Check for date validity
      const now = new Date();
      const start = parseDate(startDate);
      const end = endDate === "present" ? now : parseDate(endDate);

      if (!start || start < parseDate("01/01/1950") || start > now) {
        event.preventDefault();
        errorDiv.innerText =
          "Please choose a start date between 1950 and today in MM/DD/YYYY format.";
      }

      if (!end || (endDate !== "present" && (end < start || end > now))) {
        event.preventDefault();
        errorDiv.innerText =
          "Please choose an end date between the start date and today, or enter 'present'. Make sure to use the MM/DD/YYYY format.";
      }
    });
  }
});
