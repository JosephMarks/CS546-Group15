import { Router, urlencoded } from "express";
import companyFunctions from "../data/company.js";
const router = Router();
import multer from "multer";
import validations from "../helpers.js";
import { ObjectId } from "mongodb";
import xss from "xss";

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

router.route("/data").post(upload.single("uploadImage"), async (req, res) => { // done creating the company in the monogDB
  
  const bodyData = req.body;

  if (!bodyData || Object.keys(bodyData).length === 0) {
    return res.status(400).render("error", { error: "There are no fields in the request body" });
  }

  let { companyName, companyEmail, industry, employee, location, description, perks, goals } = bodyData;
  let createdAt = new Date();
  console.log(bodyData);

  if ( !companyName || !companyEmail || !industry || !employee || !location || !description || !req.file || !req.file.filename ||!perks || !goals )
      return res.status(400).render('error', { error :"Error : You should provide all the parameters"}) ;

  companyName = xss(req.body.companyName);
  companyEmail = xss(req.body.companyEmail);
  industry = xss(req.body.industry);
  employee = xss(req.body.employee);
  description = xss(req.body.description);
  perks = xss(req.body.perks);
  goals = xss(req.body.goals);


  // console.log( { companyName, companyEmail, industry } );

  if (typeof(location) === 'string') location = [location];
  location = location.map(x => xss(x));

  try {

    validations.checkLocationTags(location);

    if ( !companyName || !companyEmail || !industry || !employee || !location || !description|| !req.file|| !req.file.filename || !perks || !goals)
      throw "Error : You should provide all the parameters";

    if (typeof(location) === 'string') location = [location];
    validations.checkLocationTags(location);

    location = location.map(x => xss(x));

    if (!validations.isProperString([ companyName, companyEmail, industry,  description, req.file.filename, perks, goals ])) // TODO : Validations for industry.
      throw "Error : Parameters can only be string not just string with empty spaces";

    if (typeof(location) === 'string') location = [location];
    validations.checkLocationTags(location);
    validations.checkEmail(companyEmail);

    companyEmail = companyEmail.trim();
    companyName = companyName.trim().toLowerCase();
    industry = industry.trim().toLowerCase();
    description = description.trim().toLowerCase();
    perks = perks.trim().toLowerCase();
    goals = goals.trim().toLowerCase();
    validations.checkAreaText(description, "description");
    validations.checkAreaText(perks, "perks");
    validations.checkAreaText(goals, "goals");
    validations.checkTechJobTitle(industry, "industry");


    location = location.map((x) => x.trim());
    validations.isNumberOfEmployee(employee);
    employee = Number(employee);

  } catch (e) {

    return res.status(400).render("company/createCompany", { error: e, title: "Create Company", session: req.session.user });
  
  }

  try {

    const data = await companyFunctions.createCompany( companyName, companyEmail, industry, location, employee, description, encodeURIComponent (xss(req.file.filename)), perks, goals);
    return res.redirect(`/company/data/${companyName}`);

  } catch (e) {

    
    if (e === "Error: description cannot be empty" ||
    e === "Error: description cannot be less than 15 characters" ||
    e === "Error: description cannot be all numbers" ||

    e === "Error: perks cannot be empty" ||
    e === "Error: perks cannot be less than 15 characters" ||
    e === "Error: perks cannot be all numbers" ||

    e === "Error: goals cannot be empty" ||
    e === "Error: goals cannot be less than 15 characters" ||
    e === "Error: goals cannot be all numbers" ||
    
    e === "Error: industry cannot be empty" ||
    e === "Error: industry cannot be less than 15 characters" ||
    e === "Error: industry cannot be all numbers" 
    ) 
    
      return res.status(400).render("company/createCompany", { error: e, title: "Create Company", session: req.session.user });

    return res.status(500).render("company/createCompany", { error: e, title: "Create Company", session: req.session.user });
  
  }
});

// --- GET AND POST FOR CREATE COMPANY
// --- Delete Company

router.route("/delete/:id").delete(async (req, res) => {

  let id = req.params.id;


  if (!id  || !ObjectId.isValid(id)){

    return res.status(404).render('error', { error: 'Error : Id is not Valid'});

  }

  id = id.trim();

  try {

    let getCompany = await companyFunctions.getCompanyData(id);
    if (!getCompany) throw "Error : No Company Found";

    await companyFunctions.deleteCompany(id);
    
    return res.redirect('/company');

  } catch (e) {

    if (e === 'Error : No Company Found') return res.status(404).render('error', { error: e });

    if ( e === 'Error : Invalid Id') return res.status(400).render('error', { error: e });

    return res.status(500).render('error', { error: e });

  }


});

// --- Delete Company
// --- UPDATE COMPANY

router.route("/dataUpdate/:name").get(async (req, res) => { // done company update display

  let name = req.params.name;

  if (!name){
    
    return res.render("error", { error: "Error : Invalid Company Name", title: "Error" });

  }

  name = name.trim().toLowerCase();

  try {

    let companyData = await companyFunctions.getCompanyDetailsFromCompanyName(name.trim());

    if (companyData.companyEmail !== req.session.user.email) throw "Error : Not Authorized";
    return res.render("company/updateCompany", { title: "Update Company Details", companyData, session: req.session.user });

  } catch (e) {

    if (e === "Error : No Company Found") return res.status(404).render("error", { error: e, title: "Error" });

    if (e === "Error : Not Authorized") return res.status(401).render("error", { error: e, title: "Error" });

    if (e === "Error : Parameters can only be string not just string with empty spaces") return res.status(400).render("error", { error: e, title: "Error" });
    
    return res.status(500).render("error", { error: e, title: "Error" });
  }
});


router.route("/updateCompany/:id").patch(upload.single("uploadImage"), async (req, res) => { // chnage the method company update post

  const bodyData = req.body;
  let id = req.params.id;
  console.log(bodyData);


  if (!id || !ObjectId.isValid(id)) return res.render('error', { error: 'Error : Not a Valid Id' });
  id = id.trim();

  if (!bodyData || Object.keys(bodyData).length === 0) {

    return res.status(400).render("error", { error: "There are no fields in the request body" });
  
  }

  let { companyName, companyEmail, industry, numberOfEmployees, location, description, perks, goals } = bodyData;
  
  if ( !companyName || !companyEmail || !industry || !numberOfEmployees || !location || !description || !req.file || !req.file.filename ||!perks || !goals )
      return res.status(400).render('error', { error :"Error : You should provide all the parameters"}) ;

  companyName = xss(req.body.companyName);
  companyEmail = xss(req.body.companyEmail);
  industry = xss(req.body.industry);
  numberOfEmployees = xss(req.body.numberOfEmployees);
  description = xss(req.body.description);
  perks = xss(req.body.perks);
  goals = xss(req.body.goals);

  if (typeof(location) === 'string') location = [location];

  location = location.map(x => xss(x));

  try {

    validations.checkLocationTags(location);

    if ( !companyName || !companyEmail || !industry || !numberOfEmployees || !location || !description || !req.file || !req.file.filename ||!perks || !goals )
      throw "Error : You should provide all the parameters";

    if ( !validations.isProperString([ companyName, companyEmail, industry,  description, perks, goals ]) ) // TODO : Validations for industry.
      throw "Error : Parameters can only be string not just string with empty spaces";


    if (typeof(location) === 'string') location = [location];
    validations.checkLocationTags(location);

    location = location.map(x => xss(x));

    if (typeof(location) === 'string') location = [location];
    
    validations.checkLocationTags(location);
    validations.checkEmail(companyEmail);

    companyEmail = companyEmail.trim();
    companyName = companyName.trim().toLowerCase();
    industry = industry.trim().toLowerCase();
    description = description.trim().toLowerCase();
    location = location.map((x) => x.trim());
    perks = perks.trim().toLowerCase();
    goals = goals.trim().toLowerCase();
    validations.isNumberOfEmployee(numberOfEmployees);
    numberOfEmployees = Number(numberOfEmployees);

    validations.checkAreaText(description, "description");
    validations.checkAreaText(perks, "perks");
    validations.checkAreaText(goals, "goals");
    validations.checkTechJobTitle(industry, "industry");


    const data = await companyFunctions.updateCompany(req.session.user.email, companyName, companyEmail, industry, location, numberOfEmployees, description, encodeURIComponent (req.file.filename), perks, goals );

    return res.redirect(`/company/data/${companyName}`);

  } catch (e) {

    let fileName = await companyFunctions.getCompanyDataFromEmail(req.session.user.email);
    let newData = { companyName, companyEmail,industry, numberOfEmployees, locations: location, description,imgSrc: fileName.imgSrc }

    if ( e === "Error : No Company Found" ) return res.status(404).render("company/updateCompany", { error : e, companyData: newData, session: req.session.user, title:"edit company" });
    
    if ( e === "Error : Parameters can only be string not just string with empty spaces" ||
    
    e === "Error: description cannot be empty" ||
    e === "Error: description cannot be less than 15 characters" ||
    e === "Error: description cannot be all numbers" ||

    e === "Error: perks cannot be empty" ||
    e === "Error: perks cannot be less than 15 characters" ||
    e === "Error: perks cannot be all numbers" ||

    e === "Error: goals cannot be empty" ||
    e === "Error: goals cannot be less than 15 characters" ||
    e === "Error: goals cannot be all numbers" ||

    e === "Error: industry cannot be empty" ||
    e === "Error: industry cannot be less than 15 characters" ||
    e === "Error: industry cannot be all numbers"

    ) return res.status(400).render("company/updateCompany", { error : e, companyData: newData, session: req.session.user, title:"edit company" });
    
    return res.status(500).render("company/updateCompany", { error : e, companyData: newData, session: req.session.user, title:"error" });
  
  }
});

router.route("/data/:name").get(async (req, res) => { // done company details display page
  let name = req.params.name;

  if (!name)
    return res
      .status(400)
      .render({ title: "Error", error: "Error : Invalid Company Name" }); // todo render a page;

  name = name.trim().toLowerCase();

  try {

    let companyData =   await companyFunctions.getCompanyDetailsFromCompanyName(name.trim());
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

    if (e === "Error : You are not authorized to view this company details") return res.status(401).render("error", { error: e, title: "Error" });
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

      return res.render("company/createJobs", { title: "Create Job", session: req.session.user, companyDetails });

    } else {

      return res.render("company/createCompany", { title: "Create Company", session: req.session.user, error: "Register Your company First" });

    }

    
  } catch (e) {

    return res.render("company/createJobs", { title: "Create Job", session: req.session.user, companyDetails });

  }

});

router.route("/job/:name").post(async (req, res) => { // create job post

  const bodyData = req.body;

  if (!bodyData || Object.keys(bodyData).length === 0) {

    return res
      .status(400)
      .render("error", { error: "There are no fields in the request body" });

  }

  let { companyName, companyEmail, jobTitle, salary, level, jobType, skills, location, description } =
  req.body;

  if ( !companyName || !companyEmail || !jobTitle || !salary || !level || !jobType || !location || !description || !skills )
      return res.status(400).render('error', { error : 'Error: You should provide all the parameters'});

  companyName = xss(req.body.companyName);
  companyEmail = xss(req.body.companyEmail);
  jobTitle = xss(req.body.jobTitle);
  salary = xss(req.body.salary);
  level = xss(req.body.level);
  description = xss(req.body.description);

  if (typeof (jobType) === 'string') jobType = [jobType];
  jobType = jobType.map(x => xss(x));

  if (typeof(location) === 'string') location = [location];
  location = location.map(x => xss(x));

  if (typeof (skills) === 'string') skills = [skills];
  skills = skills.map(x => xss(x));

  try {

    validations.checkJobtypeTags(jobType);
    validations.checkLocationTags(location);
    validations.checkSkillsTags(skills);
    validations.checkAreaText(description, "description");
    validations.checkTechJobTitle(jobTitle, 'jobTitle');


    if ( !companyName || !companyEmail || !jobTitle || !salary || !level || !jobType || !location || !description || !skills )
      throw "Error : All parameters are required";

    // companyName = xss(companyName);
    // companyEmail = xss(companyEmail);
    // jobTitle = xss(jobTitle);
    // salary = xss(salary);
    // level = xss(level);
    // description = xss(description);

    if (typeof (jobType) === 'string') jobType = [jobType];
    validations.checkJobtypeTags(jobType);
    jobType = jobType.map(x => xss(x));

    if (typeof(location) === 'string') location = [location];
    validations.checkLocationTags(location);
    location = location.map(x => xss(x));

    if (typeof (skills) === 'string') skills = [skills];
    validations.checkSkillsTags(skills);
    skills = skills.map(x => xss(x));

    if ( !validations.isProperString([ companyName, companyEmail, jobTitle, description, level ]) )
      throw "Error : Parameters can only be string not just string with empty spaces";
    
    if (typeof (jobType) === 'string') jobType = [jobType];
    validations.checkJobtypeTags(jobType);
    jobType = jobType.map(x => x.trim().toLowerCase());

    if (typeof (skills) === 'string') skills = [skills];
    validations.checkSkillsTags(skills);
    skills = skills.map(x => x.trim().toLowerCase());

    if (typeof (location) === 'string') location = [location]; 
    validations.checkLocationTags(location);
    location = location.map(x => x.trim().toLowerCase());

    validations.isSalary(salary);
    salary = Number(salary);

    companyName = companyName.trim().toLowerCase();
    companyEmail = companyEmail.trim().toLowerCase();
    level = level.trim().toLowerCase();
    jobTitle = jobTitle.trim().toLowerCase();
    description = description.trim().toLowerCase();

    let createJob = await companyFunctions.createJob(companyName, companyEmail, jobTitle, salary, level, jobType, skills, location, description);
    return res.redirect(`/company/viewJob/${companyName}`);

  } catch (e) {

    if (e === "Error : All parameters are required" || 
    e === "Error : Company Email does not belong to the Company Name" ||
    e === "Error : Parameters can only be string not just string with empty spaces" ||

    e === "Error: description cannot be empty" ||
    e === "Error: description cannot be less than 15 characters" ||
    e === "Error: description cannot be all numbers" ||

    e === "Error: jobTitle cannot be empty" ||
    e === "Error: jobTitle cannot be less than 15 characters" ||
    e === "Error: jobTitle cannot be all numbers" ||

    e === "Error: same company cannot have same job title") return res.status(400).render("company/createJobs", { error: e, title: "Create Job", session: req.session.user, companyDetails: { companyName } });

    return res.status(500).render("company/createJobs", { error: e, title: "Create Job", session: req.session.user, companyDetails: { companyName } });
  }

});

router.route("/viewJob/:name").get(async (req, res) => { // view all jobs

  let companyName = req.params.name;
  if (!companyName || companyName.trim().length === 0) {
    return res.status(400).render("error", { error: "Not a valid Company Name" });
  }

  companyName = companyName.trim();

  try {

    let checkCompanyName = await companyFunctions.getCompanyDetailsFromCompanyName(companyName);
    if (checkCompanyName.companyEmail !== req.session.user.email) throw "Error : Not Authorized";

   } catch (e) {

    if ( e === "Error : Not Authorized") return res.status(401).render('error', {title: 'Error', error : e });
    if ( e === "Error : Parameters can only be string not just string with empty spaces") return res.status(400).render('error', {title: 'Error', error : e });

    return res.status(500).render('error', {title: 'Error', error : e });

  }

  try {

    let allJobs = await companyFunctions.getAllJobs(companyName);

    if (!allJobs || allJobs[0].jobs.length === 0) {
      
      return res.status(404).render("company/displayJobs", { companyName: companyName, error: "No Jobs", title: "No Jobs" });

    } else {

      for (let i in allJobs[0].jobs){

        allJobs[0].jobs[i]._id = allJobs[0].jobs[i]._id.toString();

      }

      return res.render('company/displayJobs', { title: 'All Jobs', jobs: allJobs[0].jobs, companyName });

    }
  } catch (e) {

    if (e === "Error : company name cannot be empty" || e === "Error : Company Name must be valid string") return res.status(400).render("error", { title: "Error" });

    return res.status(500).render("error", { title: "Error" });
  }
});

router.route("/jobUpdate/:id").get(async (req, res) => { // get for job update 

  let id = req.params.id;
  if (!id || !ObjectId.isValid(id)) {
    return res.status(400).render('error', { error: "No Id or Invalid Id" });
  }

  id = id.trim();

  try {

    let getJob = await companyFunctions.getJobById(id);
    return res.render('company/updateJob', { title: 'Edit Job', company: getJob, jobDetail: getJob.jobs[0], session: req.session.user }); 

  } catch (e) {

    if (e === "Error : Invalid Id") return res.status(400).render('error', { title: "Error", error: e });
    if (e === "Error : No Job Found") return res.status(404).render('error', { title: "Error", error: e });
    return res.status(500).render('error', { title: 'Error', error: 'Server Error' });

  }

});

router.route("/jobUpdate/:id").patch(async (req, res) => { // update page for jobs

  let id = req.params.id;
  const bodyData = req.body;

  if (!id || !ObjectId.isValid(id)) {
    return res.status(400).render("error", { error: "Error : Invalid Id" });
  };

  if (!bodyData || Object.keys(bodyData).length === 0) {
    return res.status(400).render("error", { error: "There are no fields in the request body" });
  }

  id = id.trim();

  let { companyName, companyEmail, jobTitle, salary, level, jobType, skills, location, description } = req.body;

  if ( !companyName || !companyEmail || !jobTitle || !salary || !level || !jobType || !location || !description || !skills )
      return res.status(400).render('error', { error : 'Error: You should provide all the parameters'});


  companyName = xss(req.body.companyName);
  companyEmail = xss(req.body.companyEmail);
  jobTitle = xss(req.body.jobTitle);
  salary = xss(req.body.salary);
  level = xss(req.body.level);
  description = xss(req.body.description);

  if (typeof (jobType) === 'string') jobType = [jobType];
  jobType = jobType.map(x => xss(x));

  if (typeof(location) === 'string') location = [location];
  location = location.map(x => xss(x));

  if (typeof (skills) === 'string') skills = [skills];
  skills = skills.map(x => xss(x));
  
  try {

    validations.checkJobtypeTags(jobType);
    validations.checkLocationTags(location);
    validations.checkSkillsTags(skills);
    validations.checkAreaText(description, "description");
    validations.checkTechJobTitle(jobTitle, 'jobTitle');


    if ( !companyName || !companyEmail || !jobTitle || !salary || !level || !jobType || !location || !description || !skills )
      throw "Error : All parameters are required";

      // companyName = xss(companyName);
      // companyEmail = xss(companyEmail);
      // jobTitle = xss(jobTitle);
      // salary = xss(salary);
      // level = xss(level);
      // description = xss(description);
    
      if (typeof (jobType) === 'string') jobType = [jobType];
      validations.checkJobtypeTags(jobType);
      jobType = jobType.map(x => xss(x));
    
      if (typeof(location) === 'string') location = [location];
      validations.checkLocationTags(location);
      location = location.map(x => xss(x));
    
      if (typeof (skills) === 'string') skills = [skills];
      validations.checkSkillsTags(skills);
      skills = skills.map(x => xss(x));
    

    if ( !validations.isProperString([ companyName, companyEmail, jobTitle, description, level ]) )
      throw "Error : Parameters can only be string not just string with empty spaces";

    if (typeof (jobType) === 'string') jobType = [jobType];
    validations.checkJobtypeTags(jobType);
    jobType = jobType.map(x => x.trim().toLowerCase());

    if (typeof (skills) === 'string') skills = [skills];
    validations.checkSkillsTags(skills);
    skills = skills.map(x => x.trim().toLowerCase());

    if (typeof (location) === 'string') location = [location];
    validations.checkLocationTags(location);
    location = location.map(x => x.trim().toLowerCase());

    validations.isSalary(salary);
    salary = Number(salary);

    let createJob = await companyFunctions.updateJob(id, companyName, companyEmail, jobTitle, salary, level, jobType, skills, location, description);
    
    return res.redirect(`/company/viewJob/${companyName}`);

  } catch (e) {

    let getJob = await companyFunctions.getJobById(id);

    return res.render('company/updateJob', { error: e, title: 'Edit Job', company: getJob, jobDetail: getJob.jobs[0], session: req.session.user }); 

  }

});

router.route("/jobSingleDisplay/:id").get(async (req, res) => {

  let id = req.params.id.replace(":", "");
 
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

router.route("/jobDelete/:id").delete(async (req, res) => {

  let id = req.params.id;

  if (!id || !ObjectId.isValid(id)) {
    return res.status(400).render("error", { error: "Error : Invalid Id", title: "Error" })
  }

  id = id.trim();

  try {

    let deleteData = await companyFunctions.deleteJob(id);
    let companyDetails = await companyFunctions.getCompanyDataFromEmail(req.session.user.email);

    return res.redirect(`/company/viewJob/${companyDetails.companyName}`);

  } catch(e) {

    if (e === "Error: Invalid Id" || e === "Error: Cannot delete the listing"){

      return res.status(400).render("error", { error: e });

    }

    return res.status(500).render("error", { error : e });
  }
}) 


// TODO : Remove all console.logs 

// --- GET AND CREATE JOBS



export default router;
