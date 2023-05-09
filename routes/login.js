import { Router } from "express";
import logInFunctions from "../data/login.js";
import validations from "../helpers.js";
import * as emailValidator from "email-validator";

// Setting the rules of validations for the password.

import passwordValidator from "password-validator";
let rules = new passwordValidator();
rules
  .is()
  .min(8)
  .is()
  .max(100)
  .has()
  .uppercase()
  .has()
  .digits()
  .has()
  .not()
  .spaces()
  .has()
  .symbols();

// Setting the rules of validations for the password.

const router = Router();

router.route("/").get(async (req, res) => {
  return res.render("Auth/login", { title: "Login" });
});

router.route("/data").post(async (req, res) => {
  const bodyData = req.body;

  if (!bodyData || Object.keys(bodyData).length === 0) {
    return res.status(400).render("error", {
      error: "There are no fields in the request body",
      title: "Error",
    });
  }

  let { email, pass } = bodyData;

  try {
    if (!email || !pass) throw "Error : You should provide all the parameters";
    if (validations.validateIsString([email, pass]) === 0) {
      throw "Error : All inputs must be valid String";
    }

    email = email.trim();
    if (!emailValidator.validate(email)) throw "Error : Invalid Email";
    if (!rules.validate(pass))
      throw "Error : Password Must be atleast 8 characters with a capital letter, number, and special character";
  } catch (e) {
    return res.status(400).render("Auth/login", { error: e, title: "Error" });
  }
  email = email.trim().toLowerCase();
  pass = pass;

  try {
    const newData = await logInFunctions.checkUser(email, pass);

    // setting up the session variables at the time of login
    req.session.user = {
      userId: newData._id,
      email: email,
      candidateType: newData.candidateType,
    };

    return res.render("welcome", {
      message: `You are Logged In as ${req.session.user.email} and candidate Type as ${req.session.user.candidateType}`,
      title: "Welcome",
    });
  } catch (e) {
    if (e === "Error : Email is not registered or Wrong Password")
      return res.status(400).render("Auth/login", { error: e });
    else
      return res
        .status(500)
        .render("error", { error: "Server Error", title: "Error" });
  }
});

export default router;
