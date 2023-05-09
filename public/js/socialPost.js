import mainValidations from "../js/staticHelpers.js";

const helpersValidation = {
  validateIsString(param) {
    for (let element of param) {
      if (typeof element !== "string") return 0;
      if (element.trim().length === 0) return 0;
    }
    return 1;
  },

  validateArrayWithTheString(param) {
    for (let element of param) {
      if (!Array.isArray(element))
        throw "Error : genre, groupMembers must be array";
      if (element.length === 0)
        throw "Error : there must be atleast one element in the genre, groupMembers";
      if (!this.validateIsString(element))
        throw "Error : Array values in genre, groupMembers must be valid and non-empty string";
    }
  },

  validateName(param) {
    if (param.trim().length < 2 || param.trim().length > 25)
      throw "Error : Enter a valid firstName and the lastName";

    for (let i = 0; i < param.length; i++) {
      if (!Boolean(param[i].match(/^[A-Za-z]*$/))) {
        throw "Error : Enter a valid firstName or the lastName";
      }
    }
  },

  validateRole(param) {
    if (param != "admin" && param != "user")
      throw "Error : Role can only be admin or user";
  },

  validateMyPassword(param) {
    if (param.includes(" ")) throw "Error : Invalid Password";
    if (param.length < 8) throw "Error : Invalid Password";
    let temp1 = 0;
    let temp2 = 0;

    for (let i = 0; i < param.length; i++) {
      if (param[i].match(/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/)) temp1 = 1;
      if (param[i].match(/^[-+]?[0-9]+$/)) temp2 = 1;
    }

    if (temp1 === 0 || temp2 === 0) throw "Error : Invalid Password";
    if (param.toLowerCase() === param) throw "Error : Invalid Password";
  },

  validateMyEmail(param) {
    if (
      !param
        .toLowerCase()
        .match(
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
        )
    ) {
      throw "Error : Invalid Email";
    }
  },
};

let createJob = document.getElementById("createSocial");
let updateJob = document.getElementById("updateSocial");
let search = document.getElementById("search");
let errorMsg = document.getElementById("errorDisplay");

if (createJob) {
  createJob.addEventListener("submit", (e) => {
    let posttitle = document.getElementById("posttitle").value;
    let postbody = document.getElementById("postbody").value;
    let eventdate = document.getElementById("eventdate").value;
    let field = document.getElementById("field").value;
    let category = document.getElementById("category").value;
    let company = document.getElementById("company").value;

    if (typeof field === "string") field = [field];
    if (typeof category === "string") category = [category];
    if (typeof company === "string") company = [company];
    if (posttitle.trim() || postbody.trim() || eventdate.trim()) {
      try {
        if (!mainValidations.isProperString([posttitle, postbody])) {
          throw "Error : All inputs must be a valid strings";
        }
        mainValidations.checkDate(eventdate);
        mainValidations.checkFieldsTags(field);

        document.getElementById("posttitle").value = posttitle;
        document.getElementById("postbody").value = postbody;
        errorMsg.innerHTML = "";
      } catch (error) {
        errorMsg.innerHTML = error;
        document.getElementById("posttitle").value = posttitle;
        document.getElementById("postbody").value = postbody;
        e.preventDefault();
      }
    } else {
      errorMsg.innerHTML = "All parameters are required";
      document.getElementById("posttitle").value = posttitle;
      document.getElementById("postbody").value = postbody;
      e.preventDefault();
    }
  });
}

if (updateJob) {
  updateJob.addEventListener("submit", (e) => {
    let posttitle = document.getElementById("posttitle").value;
    let postbody = document.getElementById("postbody").value;
    let eventdate = document.getElementById("eventdate").value;
    let field = document.getElementById("field").value;

    let category = document.getElementById("category").value;
    let company = document.getElementById("company").value;

    if (typeof field === "string") field = [field];
    if (typeof category === "string") category = [category];
    if (typeof company === "string") company = [company];

    if (posttitle.trim() || postbody.trim()) {
      try {
        if (!mainValidations.isProperString([posttitle, postbody])) {
          throw "Error : All inputs must be a valid strings";
        }
        if (eventdate) {
          mainValidations.checkDate(eventdate);
        }
        if (field.length > 1) {
          mainValidations.checkFieldsTags(field);
        }
        if (category.length > 1) {
          mainValidations.checkCategoryTags(category);
        }
        if (company.length > 1) {
          mainValidations.checkCompanyTags(company);
        }

        document.getElementById("posttitle").value = posttitle;
        document.getElementById("postbody").value = postbody;

        errorMsg.innerHTML = "";
      } catch (error) {
        errorMsg.innerHTML = error;
        document.getElementById("posttitle").value = posttitle;
        document.getElementById("postbody").value = postbody;

        e.preventDefault();
      }
    }
  });
}
if (search) {
  search.addEventListener("submit", (e) => {
    let field = document.getElementById("field").value;
    let category = document.getElementById("category").value;
    let company = document.getElementById("company").value;
    if (typeof field === "string") field = [field];
    if (typeof company === "string") company = [company];
    try {
      if (field) {
        mainValidations.checkFieldsTags(field);
      }
      if (category) {
        mainValidations.checkCategoryTags(category);
      }
      if (company) {
        mainValidations.checkStringArray(company, "company");
      }
      errorMsg.innerHTML = "";
    } catch (error) {
      errorMsg.innerHTML = error;
    }
  });
}
