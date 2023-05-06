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

  try {
    id = userFunctions.getUserById()
  } catch (e) {

  }

  if (!req.params.id || ObjectId.isValid(req.params.id)) {
    return res.status(404).render("error", { error: "Error : Not a valid Id" });
  }

  try {

    let getSkills = await userFunctions.getUserSkills(id);
    return res.json({getSkills});

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
