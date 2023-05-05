import { Router, urlencoded } from "express";
import companyFunctions from "../data/company.js";
const router = Router();

import validations from "../helpers.js";
import { ObjectId } from "mongodb";

router.route("/jobSingleDisplay/:id").get(async (req, res) => {

    let id = req.params.id.replace(":", "");
    console.log(id);
    console.log(ObjectId.isValid(id));
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).render('error', { error: "No Id or Invalid Id" });
    }
  
    try {
  
      let getJob = await companyFunctions.getJobById(id);
      console.log(getJob);
  
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

export default router;
