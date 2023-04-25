import { Router } from "express";
import logInFunctions from "../data/login.js";
import validations from "../helpers.js";

const router = Router();

router.route('/').get(async (req, res) =>
{
  return res.render('Auth/login', { title: "Login" })
});

router.route("/data").post(async (req, res) =>
{
  const bodyData = req.body;

  if(!bodyData || Object.keys(bodyData).length === 0)
  {
    return res
      .status(400)
      .render('error', { error: "There are no fields in the request body" });
  }

  let { email, pass } = bodyData;

  try
  {
    if(!email || !pass) throw "Error: All parameters are required";
    if(!validations.isProperString([email, pass]))
      throw "Error : Email and Password can only be string not just string with empty spaces";
  } catch(e)
  {
    return res.status(400).render('Auth/login', { error: e });
  }
    const newData = await logInFunctions.logIn(email.trim().toLowerCase(), pass);
    
  try
  {
    const newData = await logInFunctions.logIn(email.trim().toLowerCase(), pass);
    req.session.user = { userId: newData._id, email: email, candidateType: newData.candidateType };
    return res.render('welcome', { message: `You are Logged In as ${email}}` });
  } catch(e)
  {

    if(e === "Error: User Email is not registered") return res.status(400).render('Auth/signup', { error: e });
    if(e === "Error : Wrong Password") return res.status(400).render('Auth/login', { error: e });
    else return res.status(500).json({ error: "Server Error" });
  }
});

export default router;
