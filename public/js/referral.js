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

let createJob = document.getElementById("create-refer");
let updateJob = document.getElementById("update-refer");
let search = document.getElementById("search");
let errorMsg = document.getElementById("errorDisplay");

if (createJob) {
  createJob.addEventListener("submit", (e) => {
    let posttitle = document.getElementById("posttitle").value;
    let postbody = document.getElementById("postbody").value;
    let duedate = document.getElementById("duedate").value;
    let field = document.getElementById("field").value;
    let companyEmail = document.getElementById("companyEmail").value;
    let jobTitle = document.getElementById("jobTitle").value;
    let salary = document.getElementById("salary").value;
    let level = document.getElementById("level").value;
    let jobType = document.getElementById("jobType").value;
    let skills = document.getElementById("skills").value;
    let location = document.getElementById("location").value;
    let description = document.getElementById("description").value;

    if (typeof location === "string") location = [location];
    if (typeof skills === "string") skills = [skills];
    if (typeof jobType === "string") jobType = [jobType];
    if (typeof field === "string") field = [field];
    if (
      posttitle.trim() ||
      postbody.trim() ||
      duedate.trim() ||
      companyEmail.trim() ||
      jobTitle.trim() ||
      salary.trim() ||
      level.trim() ||
      description.trim() ||
      posttitle.trim() ||
      postbody.trim() ||
      duedate.trim()
    ) {
      try {
        if (
          !mainValidations.isProperString([
            jobTitle,
            description,
            salary,
            posttitle,
            postbody,
          ])
        ) {
          throw "Error : All inputs must be a valid strings";
        }

        helpersValidation.validateMyEmail(companyEmail.trim());
        mainValidations.checkDueDate(duedate);
        mainValidations.checkLocationTags(location);
        mainValidations.checkJobtypeTags(jobType);
        mainValidations.checkSkillsTags(skills);
        mainValidations.checkFieldsTags(field);
        mainValidations.isSalary(salary);
        document.getElementById("posttitle").value = posttitle;
        document.getElementById("postbody").value = postbody;
        document.getElementById("companyEmail").value = companyEmail;
        document.getElementById("jobTitle").value = jobTitle;

        document.getElementById("description").value = description;
        errorMsg.innerHTML = "";
      } catch (error) {
        errorMsg.innerHTML = error;
        document.getElementById("posttitle").value = posttitle;
        document.getElementById("postbody").value = postbody;
        document.getElementById("companyEmail").value = companyEmail;
        document.getElementById("jobTitle").value = jobTitle;

        document.getElementById("description").value = description;
        e.preventDefault();
      }
    } else {
      errorMsg.innerHTML = "All parameters are required";
      document.getElementById("posttitle").value = posttitle;
      document.getElementById("postbody").value = postbody;
      document.getElementById("companyEmail").value = companyEmail;
      document.getElementById("jobTitle").value = jobTitle;

      document.getElementById("description").value = description;
      e.preventDefault();
    }
  });
}

if (updateJob) {
  updateJob.addEventListener("submit", (e) => {
    let posttitle = document.getElementById("posttitle").value;
    let postbody = document.getElementById("postbody").value;
    let duedate = document.getElementById("duedate").value;
    let field = document.getElementById("field").value;
    let companyEmail = document.getElementById("companyEmail").value;

    if (typeof field === "string") field = [field];

    if (posttitle.trim() || postbody.trim() || companyEmail.trim()) {
      try {
        if (
          !mainValidations.isProperString([posttitle, postbody, companyEmail])
        ) {
          throw "Error : All inputs must be a valid strings";
        }

        helpersValidation.validateMyEmail(companyEmail.trim());
        if (duedate) {
          mainValidations.checkDueDate(duedate);
        }
        if (field.length > 1) {
          mainValidations.checkFieldsTags(field);
        }
        document.getElementById("posttitle").value = posttitle;
        document.getElementById("postbody").value = postbody;
        document.getElementById("companyEmail").value = companyEmail;
        errorMsg.innerHTML = "";
      } catch (error) {
        errorMsg.innerHTML = error;
        document.getElementById("posttitle").value = posttitle;
        document.getElementById("postbody").value = postbody;
        document.getElementById("companyEmail").value = companyEmail;
        e.preventDefault();
      }
    }
  });
}
if (search) {
  search.addEventListener("submit", (e) => {
    let field = document.getElementById("field").value;
    let company = document.getElementById("company").value;
    if (typeof field === "string") field = [field];
    if (typeof company === "string") company = [company];
    try {
      if (field) {
        mainValidations.checkFieldsTags(field);
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
