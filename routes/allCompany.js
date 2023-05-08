import { Router, urlencoded } from "express";
import companyFunctions from "../data/company.js";
const router = Router();
import multer from "multer";
import validations from "../helpers.js";
import { ObjectId } from "mongodb";
import xss from "xss";

router.route("/").get (async (req, res) => {

  return res.render('normal/searchCompany', { title: 'Search Company' });

});

router.route("/").post(async (req, res) => {

  const bodyData = req.body;

  if (!bodyData || Object.keys(bodyData).length === 0) {
    return res.status(400).render("error", { error: "There are no fields in the request body", title :"Error" });
  }

  let { companyName } = bodyData;

  try {

    companyName = xss(companyName);
    
    if (!companyName) throw "Error : Company Name cannot be empty";
    if (!validations.isProperString([ companyName])) throw "Error: Company Name should be proper string";

    let companyDetails = await companyFunctions.getCompanyDetailsFromCompanyName(companyName);
    return res.render('normal/displayCompanies', { companyData: companyDetails, title : companyName });

  } catch (e) {

    if (

      e === "Error : Company Name cannot be empty" ||
      e === "Error: Company Name should be proper string" ||
      e === "Error: All parameteres are required" ||
      e === "Error : Parameters can only be string not just string with empty spaces"
      
    ) return res.status(400).render('normal/searchCompany', { error : e, title :"Error" });

    if (e === "Error : No Company Found") {
      return res.status(404).render('normal/searchCompany', { error : e, title :"Error" });
    }

    else {
      return res.status(500).render ('error', { error : e, title :"Error" });
    }

  }

});

router.route("/jobSingleDisplay/:id").get(async (req, res) => {

    let id = req.params.id.replace(":", "");
    console.log(id);
    console.log(ObjectId.isValid(id));
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).render('error', { error: "No Id or Invalid Id", title :"Error" });
    }
  
    try {
  
      let getJob = await companyFunctions.getJobById(id);
      console.log(getJob);
  
      if (!getJob || getJob.length === 0) throw "Error : No Job Found";
      else return res.render('company/displaySingleJob', { title: 'View Job', jobData: getJob.jobs[0] }); 
  
    } catch (e) {
      if (e === "Error : Invalid Id" || e === "Error : No Job Found") {
        return res.status(404).render('error', { title: "Error", error: e, title :"Error" });
      } else {
        return res.status(500).render('error', { title: 'Error', error: 'Server Error', title :"Error" });
      }
    }
  
  });

export default router;
