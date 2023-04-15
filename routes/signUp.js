import { Router } from "express";
import signUpFunctions from "../data/signUp.js";
import validations from "../helpers.js";
import bcrypt from "bcrypt";

const router = Router();

router.route('/').get(async (req, res) => {
  return res.render('Auth/signup', {title: 'Sign Up'})
});

router.route("/data").post(async (req, res) => {
  const bodyData = req.body;

  if (!bodyData || Object.keys(bodyData).length === 0) {
    return res
      .status(400)
      .render('Auth/signup', { error: "There are no fields in the request body" });
  }

  let { fname, lname, age, email, pass, candidateType } = bodyData;

  try {
    if (!fname || !lname || !age || !email || !pass || !candidateType)
      throw "Error: All parameters are required";
    validations.isAge(age);
    age = Number(age);

    if (!validations.isProperString([fname, lname, email, pass, candidateType]))
      throw "Error : FirstName, Last Name, Email, password, candidateType can only be string not just string with empty spaces";
    validations.isAge(age);
    pass = await bcrypt.hash(pass.trim(), 5);
  } catch (e) {
    return res.status(400).render('Auth/signup', { error: e });
  }

  try {
    const newData = await signUpFunctions.create(
      fname.trim(),
      lname.trim(),
      age,
      email.trim().toLowerCase(),
      pass,
      candidateType.trim()
    );
    return res.status(200).render('Auth/login', { error: " New User Registered " });
  } catch (e) {
    if (e === "Error: User Email is already registered")
      return res.status(404).render('Auth/login', { error: e });
    else return res.status(500).render('Auth/signup', { error: "Sever Error" });
  }
});

export default router;
