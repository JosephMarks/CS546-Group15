import { Router } from "express";
import companyFunctions from "../data/company.js";
const router = Router();
import multer from "multer";
import validations from "../helpers.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()} - ${file.originalname}`);
  },
});

const upload = multer({ storage });

// --- GET AND POST FOR CREATE COMPANY

router.route("/").get(async (req, res) => {
  // display company's page.
  try {
    let ifExists = await companyFunctions.getCompanyDataFromEmail(req.session.user.email);

    if (ifExists) {
      return res.redirect(`/company/data/${ifExists.companyName}`);
    } else {
      return res.render("company/createCompany", {
        title: "Create Company",
        session: req.session.user,
        error: "Register Your company First",
      });
    }
  } catch (e) {
    return res.status(500).render("error", { error: e });
  }
});

router.route("/data").post(upload.single("uploadImage"), async (req, res) => {
  // creating the company in the monogDB
  const bodyData = req.body;

  if (!bodyData || Object.keys(bodyData).length === 0) {
    return res
      .status(400)
      .render("error", { error: "There are no fields in the request body" });
  }

  let { companyName, companyEmail, industry, employee, location, description } =
    bodyData;

  let createdAt = new Date();

  try {
    if (
      !companyName ||
      !companyEmail ||
      !industry ||
      !employee ||
      !location ||
      !description
    )
      throw "Error : You should provide all the parameters";

    if (
      !validations.isProperString([
        companyName,
        companyEmail,
        industry, // TODO : Validations for industry.
        description,
      ])
    )
      throw "Error : Parameters can only be string not just string with empty spaces";

    validations.isArrayWithTheNonEmptyStringForLocation([location]);
    validations.checkEmail(companyEmail);

    companyEmail = companyEmail.trim();
    companyName = companyName.trim().toLowerCase();
    industry = industry.trim().toLowerCase();
    description = description.trim().toLowerCase();
    location = location.map((x) => x.trim());
    validations.isNumberOfEmployee(employee);
    employee = Number(employee);

    const data = await companyFunctions.createComapny(
      companyName,
      companyEmail,
      industry,
      location,
      employee,
      description,
      createdAt,
      req.file.filename
    );

    return res.redirect(`/company/data/${companyName}`);
  } catch (e) {
    return res.status(500).render("company/createCompany", {
      error: e,
      title: "Create Company",
      session: req.session.user,
    });
  }
});

// --- GET AND POST FOR CREATE COMPANY

// --- UPDATE COMPANY

router.route("/updateCompany/:name").get(async (req, res) => {
  let companyName = req.params.name;
  if (!companyName || companyName.trim().length === 0)
    return res.render("error", { error: "Not a valid company name" });

  try {
    let getCompanyDetails = await companyFunctions.getCompanyDetailsFromCompanyName();
    if (!getCompanyDetails) throw "Error : No company Found";

    return res.render("company/updateCompany", {
      title: "Edit Company Details",
    });
  } catch (e) {
    return res.status(500).render("error", { title: "Error", error: e });
  }
});

router.route("/data/:name").get(async (req, res) => {
  if (!req.params.name)
    return res
      .status(400)
      .render({ title: "Error", error: "Error : Invalid Company Name" }); // todo render a page;

  try {
    let companyData = await companyFunctions.getCompanyDetailsFromCompanyName(req.params.name);

    if (companyData) {
      return res.render("company/displayCompany", {
        title: companyData.companyName,
        companyData: companyData,
      });
    } else {
      return res.redirect("/company/");
    }
  } catch (e) {
    return res.status(500).render("error", { error: e, title: "Error" });
  }
});

router.route("/dataUpdate/:name").get(async (req, res) => {
  if (!req.params.name) "Error : Invalid Company Name"; // todo render a page;

  try {
    let companyData = await companyFunctions.getCompanyDetailsFromCompanyName(req.params.name);
    return res.render("company/updateCompany", {
      title: "Update Company Details",
      companyData,
      session: req.session.user,
    });
  } catch (e) {
    return res.render("error", { error: e, title: "Error" });
  }
});

// --- UPDATE COMPANY




// --- GET AND CREATE JOBS

router.route("/job").get(async (req, res) => {

  try {

    let email = req.session.user.email;
    let companyDetails = await companyFunctions.getCompanyDataFromEmail(email);

    if (companyDetails) {

      return res.render("company/createJobs", {
        title: "Create Job",
        session: req.session.user,
        companyDetails,
      });

    } else {

      return res.render("company/createCompany", {
        title: "Create Company",
        session: req.session.user,
        error: "Register Your company First",
      });

    }

    
  } catch (e) {

    return res.render("company/createJobs", {
      title: "Create Job",
      session: req.session.user,
      companyDetails,
    });

  }

});

router.route("/job").post(async (req, res) => {

  const bodyData = req.body;

  if (!bodyData || Object.keys(bodyData).length === 0) {

    return res
      .status(400)
      .render("error", { error: "There are no fields in the request body" });

  }

  let { companyName, companyEmail, jobTitle, salary, level, jobType, skills, location, description } =
  req.body;

  try {

    if (
      !companyName ||
      !companyEmail ||
      !jobTitle ||
      !salary ||
      !level ||
      !jobType ||
      !location ||
      !description ||
      !skills
    )
      throw "Error : All parameters are required";

    if (
      !validations.isProperString([
        companyName,
        companyEmail,
        jobTitle,
        description,
        level
      ])
    )
      throw "Error : Parameters can only be string not just string with empty spaces";

    if (typeof (jobType) === 'string') {

      if (!validations.isProperString([jobType])) throw "Error : job type can only be a valid string or array with valid strings";

    } else {

      validations.isArrayWithTheNonEmptyStringForJobType([jobType]);
      jobType = jobType.map(x => x.trim().toLowerCase());

    }

    if (typeof (skills) === 'string') {

      if (!validations.isProperString([jobType])) throw "Error : skills can only be a valid string or array with valid strings";

    } else {

      validations.isArrayWithTheNonEmptyStringForSkills([skills]);
      skills = skills.map(x => x.trim().toLowerCase());

    }

    if (typeof (location) === 'string') {

      if (!validations.isProperString([location])) throw "Error : location can only be a valid string or array with valid strings";

    } else {

      validations.isArrayWithTheNonEmptyStringForLocation([location]);
      location = location.map(x => x.trim().toLowerCase());

    }

    validations.isSalary(salary);
    salary = Number(salary);

    let createJob = await companyFunctions.createJob(companyName, companyEmail, jobTitle, salary, level, jobType, skills, location, description);
    return res.redirect(`/company/viewJob/${companyName}`);

  } catch (e) {

    return res.render("company/createJobs", {
      error: e,
      title: "Create Job",
      session: req.session.user,
      companyDetails: { companyName },
    });
  }

});

router.route("/viewJob/:name").get(async (req, res) => {

  let companyName = req.params.name;
  if (!companyName || companyName.trim().length === 0) {
    return res.render("error", { error: "Not a valid Company Name" });
  }

  try {
    let checkCompanyName = await companyFunctions.getCompanyDetailsFromCompanyName(companyName);
    
    if (checkCompanyName) {

      if (checkCompanyName.companyName !== companyName){
  
        return res.status(400).render('error', {title: 'Not Authorized', error : `Can see only ${companyName} job listings`});
      
      }

    }
  
  } catch (e) {

    return res.status(400).render('error', {title: 'Error', error : e });

  }

  

  try {

    let allJobs = await companyFunctions.getAllJobs(companyName);

    if (!allJobs || allJobs.length === 0) {
      return res
        .status(404)
        .render("company/displayJobs", { error: "No Jobs", title: "No Jobs" });

    } else {
      
      for (let i in allJobs[0].jobs){

        allJobs[0].jobs[i]._id = allJobs[0].jobs[i]._id.toString();

      }

      return res.render('company/displayJobs', { title: 'All Jobs', jobs: allJobs[0].jobs, companyName })
    }
  } catch (e) {
    console.log(e);

    return res.render("error", { title: "Error" });
  }
});

// TODO : Remove all console.logs 

// --- GET AND CREATE JOBS

export default router;
