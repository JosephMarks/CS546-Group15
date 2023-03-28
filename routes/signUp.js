import { Router } from "express";
import signUpFunctions from "../data/signUp.js";
import validations from "../helpers.js";
import bcrypt from "bcrypt";

const router = Router();

router.route("/signup").post(async (req, res) => {
  const bodyData = req.body;

  if (!bodyData || Object.keys(bodyData).length === 0) {
    return res
      .status(400)
      .json({ error: "There are no fields in the request body" });
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
    return res.status(400).json({ errorMessage: e });
  }

  try {
    const newData = await signUpFunctions.create(
      fname.trim(),
      lname.trim(),
      age,
      email.trim(),
      pass
    );
    return res.status(200).json({ errorMessage: " New User Registered " });
  } catch (e) {
    if (e === "Error: User Email is already registered")
      return res.status(404).json({ errorMessage: e });
    else return res.status(500).json({ errorMessage: "Sever Error" });
  }
});

export default router;
