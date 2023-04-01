import { Router } from "express";
import logInFunctions from "../data/login.js";
import validations from "../helpers.js";

const router = Router();

router.route("/login").post(async (req, res) => {
  const bodyData = req.body;

  if (!bodyData || Object.keys(bodyData).length === 0) {
    return res
      .status(400)
      .json({ errorMessage: "There are no fields in the request body" });
  }

  let { email, pass } = bodyData;

  try {
    if (!email || !pass) throw "Error: All parameters are required";
    if (!validations.isProperString([email, pass]))
      throw "Error : Email and Password can only be string not just string with empty spaces";
  } catch (e) {
    return res.status(200).json({ errorMessage: e });
  }

  try {
    const newData = await logInFunctions.logIn(email.trim(), pass);
    res.json({ errorMessage: "You are Logged In" });
  } catch (e) {
    if (e === "Error: User Email is not registered")
      return res.status(400).json({ errorMessage: e });
    if (e === "Error : Wrong Password")
      return res.status(400).json({ errorMessage: e });
    else return res.status(500).json({ errorMessage: "Server Error" });
  }
});

export default router;
