import { Router, urlencoded } from "express";
import companyFunctions from "../data/company.js";
const router = Router();
import multer from "multer";
import validations from "../helpers.js";
import { ObjectId } from "mongodb";

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

router.route("/").get(async (req, res) => { // done
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

router.route("/data").post(upload.single("uploadImage"), async (req, res) => { // done
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

    if (typeof(location) === 'string'){
      location = [location];
    }

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
      encodeURIComponent (req.file.filename)
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

router.route("/dataUpdate/:name").get(async (req, res) => { // done company update display

  const bodyData = req.body;
  if (!req.params.name || !bodyData || Object.keys(bodyData).length === 0) "Error : Invalid Company Name"; // todo render a page;

  let { companyName, companyEmail, industry, employee, location} = bodyData;

  try {

    let companyData = await companyFunctions.getCompanyDetailsFromCompanyName(req.params.name);

    if (companyData.companyEmail !== req.session.user.email) throw "Error : Not Authorized";
    if (!companyData) throw " Error : No Company Found with this name ";
    
    return res.render("company/updateCompany", {
      title: "Update Company Details",
      companyData,
      session: req.session.user,
    });

  } catch (e) {
    return res.render("error", { error: e, title: "Error" });
  }
});


router.route("/updateCompany/:name").post(upload.single("uploadImage"), async (req, res) => { // done company update post

  const bodyData = req.body;

  if (!bodyData || Object.keys(bodyData).length === 0) {
    return res
      .status(400)
      .render("error", { error: "There are no fields in the request body" });
  }

  let { companyName, companyEmail, industry, numberOfEmployees, location, description } =
    bodyData;

  let newData = {

    companyName, 
    companyEmail,
    industry, 
    numberOfEmployees, 
    locations: location, 
    description,
    imgSrc: encodeURIComponent (req.file.filename)

  }

  try {
    
    if (
      !companyName ||
      !companyEmail ||
      !industry ||
      !numberOfEmployees ||
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
    validations.isNumberOfEmployee(numberOfEmployees);
    numberOfEmployees = Number(numberOfEmployees);

    const data = await companyFunctions.updateCompany(

      companyName,
      companyEmail,
      industry,
      location,
      numberOfEmployees,
      description,
      encodeURIComponent (req.file.filename)

    );

    return res.redirect(`/company/data/${companyName}`);

  } catch (e) {
    console.log(bodyData);
    return res.status(500).render("company/updateCompany", { error : e, companyData: newData, session: req.session.user });
  }
});

router.route("/data/:name").get(async (req, res) => { // done company details display page

  if (!req.params.name)
    return res
      .status(400)
      .render({ title: "Error", error: "Error : Invalid Company Name" }); // todo render a page;

  try {

    let companyData = await companyFunctions.getCompanyDetailsFromCompanyName(req.params.name);
    // companyData.imgSrc = encodeURIComponent( companyData.imgSrc );
    if (companyData.companyEmail === req.session.user.email){
      if (companyData) {
        return res.render("company/displayCompany", {
          title: companyData.companyName,
          companyData: companyData,
        });
      } else {
        return res.redirect("/company/");
      }
    } else {
      throw "Error : You are not authorized to view this company details";
    }
    
  } catch (e) {
    return res.status(500).render("error", { error: e, title: "Error" });
  }
});

// --- UPDATE COMPANY

// --- GET AND CREATE JOBS

router.route("/job").get(async (req, res) => { // display page for create Job

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

router.route("/job").post(async (req, res) => { // create job post

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
    if (checkCompanyName.companyEmail !== req.session.user.email) throw "Error : Not Authorized";

   } catch (e) {

    return res.status(400).render('error', {title: 'Error', error : e });

  }

  try {

    let allJobs = await companyFunctions.getAllJobs(companyName);

    if (!allJobs || allJobs[0].jobs.length === 0) {
      return res
        .status(404)
        .render("company/displayJobs", { companyName: companyName, error: "No Jobs", title: "No Jobs" });

    } else {

      console.log(allJobs[0].jobs);
      
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

router.route("/jobUpdate/:id").get(async (req, res) => { // get for job update 

  let id = req.params.id;
  if (!id || !ObjectId.isValid(id)) {
    return res.status(400).render('error', { error: "No Id or Invalid Id" });
  }

  try {

    let getJob = await companyFunctions.getJobById(id);
    // console.log("hi", getJob.jobs[0]);

    if (!getJob || getJob.length === 0) throw "Error : No Job Found";
    else return res.render('company/updateJob', { title: 'Edit Job', company: getJob, jobDetail: getJob.jobs[0], session: req.session.user }); 

  } catch (e) {
    if (e === "Error : Invalid Id" || e === "Error : No Job Found") {
      return res.status(404).render('error', { title: "Error", error: e });
    } else {
      return res.status(500).render('error', { title: 'Error', error: 'Server Error' });
    }
  }

});

router.route("/jobUpdate/:id").post(async (req, res) => { // update page for jobs

  const bodyData = req.body;
  console.log(req.params.id);

  if (!bodyData || Object.keys(bodyData).length === 0) {

    return res
      .status(400)
      .render("error", { error: "There are no fields in the request body" });

  }

  let { companyName, companyEmail, jobTitle, salary, level, jobType, skills, location, description } =
  req.body;

  console.log(req.body);

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

    let createJob = await companyFunctions.updateJob(req.params.id, companyName, companyEmail, jobTitle, salary, level, jobType, skills, location, description);
    
    return res.redirect(`/company/viewJob/${companyName}`);

  } catch (e) {
    let getJob = await companyFunctions.getJobById(req.params.id);

    return res.render('company/updateJob', { error: e, title: 'Edit Job', company: getJob, jobDetail: getJob.jobs[0], session: req.session.user }); 

  }

});

router.route("/jobDetails/:id").get(async (req, res) => {

  // if (!req.params.id) throw "Error : No id found or Invalid Job Id";

  // let jobDetail = await companyFunctions.getJobById()
  // return console.log(jobDetail);

});

router.route("/jobSingleDisplay/:id").get(async (req, res) => {

  let id = req.params.id.replace(":", "");
  console.log(id);
  console.log(ObjectId.isValid(id));
  if (!id || !ObjectId.isValid(id)) {
    return res.status(400).render('error', { error: "No Id or Invalid Id" });
  }

  try {

    let getJob = await companyFunctions.getJobById(id);
    // return console.log(getJob);

    if (!getJob || getJob.length === 0) throw "Error : No Job Found";
    else return res.render('company/displaySingleJob', { title: 'View Job', jobData: getJob.jobs[0] }); 

  } catch (e) {
    if (e === "Error : Invalid Id" || e === "Error : No Job Found") {
      return res.status(404).render('error', { title: "Error", error: e });
    } else {
      return res.status(500).render('error', { title: 'Error', error: 'Server Error' });
    }
  }

});


// TODO : Remove all console.logs 

// --- GET AND CREATE JOBS



export default router;
