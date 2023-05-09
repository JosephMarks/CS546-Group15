console.log("I am running...");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event fired...");

  const jobHistoryForms = document.querySelectorAll("#jobHistoryForm");

  if (jobHistoryForms.length > 0) {
    jobHistoryForms.forEach((jobHistoryForm) => {
      const errorDiv = jobHistoryForm.querySelector(".error");

      jobHistoryForm.addEventListener("submit", (event) => {
        console.log("form submitted...");
        errorDiv.innerText = "";

        const roleInputs = jobHistoryForm.querySelectorAll(
          "input[name^='role']"
        );
        const organizationInputs = jobHistoryForm.querySelectorAll(
          "input[name^='organization']"
        );
        const startDateInputs = jobHistoryForm.querySelectorAll(
          "input[name^='startDate']"
        );
        const endDateInputs = jobHistoryForm.querySelectorAll(
          "input[name^='endDate']"
        );
        const descriptionInputs = jobHistoryForm.querySelectorAll(
          "textarea[name^='description']"
        );

        const inputs = [
          roleInputs,
          organizationInputs,
          startDateInputs,
          endDateInputs,
          descriptionInputs,
        ];

        const isNotEmpty = (input) => {
          console.log(`Checking if input is not empty: ${input.name}`);
          return input.value.trim().length > 0;
        };
        const isString = (input) => {
          console.log(`Checking if input is a string: ${input.name}`);
          return typeof input.value === "string";
        };
        const isValidDate = (input) => {
          console.log(`Checking if input is a valid date: ${input.name}`);
          return (
            input.value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/) ||
            input.value.toLowerCase() === "present"
          );
        };
        const isEndDateAfterStartDate = (startDate, endDate) => {
          console.log(`Checking if end date is after start date`);
          if (endDate.value.toLowerCase() === "present") return true;
          const [startMonth, startDay, startYear] = startDate.value.split("/");
          const [endMonth, endDay, endYear] = endDate.value.split("/");
          const startDateObj = new Date(startYear, startMonth - 1, startDay);
          const endDateObj = new Date(endYear, endMonth - 1, endDay);
          return endDateObj >= startDateObj;
        };

        for (let i = 0; i < roleInputs.length; i++) {
          console.log(`Checking roleInputs[${i}]...`);

          for (const inputArray of inputs) {
            const input = inputArray[i];
            if (!isNotEmpty(input) || !isString(input)) {
              event.preventDefault();
              errorDiv.innerText =
                "Please ensure all fields are filled with strings.";
              return;
            }
          }

          if (
            !isValidDate(startDateInputs[i]) ||
            !isValidDate(endDateInputs[i])
          ) {
            event.preventDefault();
            errorDiv.innerText =
              "Please ensure start and end dates are in the correct format (MM/DD/YYYY) or 'present'.";
            return;
          }

          if (!isEndDateAfterStartDate(startDateInputs[i], endDateInputs[i])) {
            event.preventDefault();
            errorDiv.innerText =
              "Please ensure the end date is after the start date.";
            return;
          }

          regex = /[^a-zA-Z]/g;
          if (regex.test(roleInputs)) {
            event.preventDefault();
            errorDiv.innerText =
              "Please ensure role doesn't include numbers or special characters.";
            return;
          }

          const currentDate = new Date();
          const [endMonth, endDay, endYear] = endDateInputs[i].value.split("/");
          const endDateObj = new Date(endYear, endMonth - 1, endDay);
          if (
            endDateInputs[i].value.toLowerCase() !== "present" &&
            endDateObj > currentDate
          ) {
            event.preventDefault();
            errorDiv.innerText =
              "Please ensure the end date is not in the future.";
            return;
          }
        }
      });
    });
  }
});
