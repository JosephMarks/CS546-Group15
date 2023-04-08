import { Router } from "express";
import signUpFunctions from "../data/signUp.js";
import validations from "../helpers.js";
import bcrypt from "bcrypt";

const router = Router();

router.route('/').get(async (req, res) => {
  return res.render('signup', {title: 'Sign Up'})
});

router.route("/data").post(async (req, res) => {
  const bodyData = req.body;
  // console.log(bodyData);

  if (!bodyData || Object.keys(bodyData).length === 0) {
    return res
      .status(400)
      .render('signup', { error: "There are no fields in the request body" });
  }

  let { fname, lname, age, email, pass } = bodyData;

  try {
    if (!fname || !lname || !age || !email || !pass)
      throw "Error: All parameters are required";
    age = Number(age);

    if (!validations.isProperString([fname, lname, email, pass]))
      throw "Error : FirstName, Last Name, Email, password can only be string not just string with empty spaces";
    validations.isAge(age);
    pass = await bcrypt.hash(pass.trim(), 5);
  } catch (e) {
    return res.status(400).render('signup', { error: e });
  }

  try {
    const newData = await signUpFunctions.create(
      fname.trim(),
      lname.trim(),
      age,
      email.trim(),
      pass
    );
    return res.status(200).render('login', { error: " New User Registered " });
  } catch (e) {
    if (e === "Error: User Email is already registered")
      return res.status(404).render('login', { error: e });
    else return res.status(500).render('signup', { error: "Sever Error" });
  }
});

export default router;
