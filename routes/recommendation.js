import { Router, urlencoded } from "express";
import companyFunctions from "../data/company.js";
import userFunctions from "../data/user.js";
import validations from "../helpers.js";
import { ObjectId } from "mongodb";
const router = Router();

router.route("/").get(async (req, res) => {
  // done
  let email = req.session.user.email;
  let id = "";
  let allCompany = "";

  try {

    id = await userFunctions.getUserByEmail(email);
    id = id._id.toString();

  } catch (e) {
    if (e === "Error :No user found") {
      return res.status(404).render('error', {error: e});
    } else {
      return res.status(500).render('error', {error : e});
    }
  }

  if (!id || !ObjectId.isValid(id)) {
    return res.status(400).render("error", { error: "Error : Not a valid Id" });
  }

  try {

    let getSkills = await userFunctions.getUserSkills(id);
    allCompany = await companyFunctions.getAllCompanyJobs();

    if (!getSkills.skills) {
      return res.status(400).render('error', {error: "No skills no recommendation"});
    }else {
      getSkills = getSkills.skills;
    }


    if (typeof(getSkills) === 'string') {
      getSkills = [getSkills];
    }

    getSkills = getSkills.map(x => x.trim().toLowerCase());

    let allMyJobs = [];

    try {

      console.log(allCompany);

      allCompany.forEach(company => {
        if (company.jobs) company.jobs.forEach(job => {
          if (job.skills.some(j => getSkills.includes(j))) allMyJobs.push(job)
        }) 
      });

      return res.render('company/recommendation', { jobs: allMyJobs });
      
    } catch(e) {
      return res.status(500).render("error", { error: e });
    }

    // return res.json({allMyJobs});

  } catch (e) {
    if (
      e === "Error : Users interest area is empty" ||
      e === "Error : Invalid Id"
    ) {
      return res.status(400).render("error", { error: e });
    } else return res.status(500).render("error", { error: e });
  }
});

export default router;
