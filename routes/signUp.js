import { Router } from "express";
import signUpFunctions from "../data/signUp.js";
import validations from "../helpers.js";
import emailValidator from "email-validator"; //use to validate email address

// Setting the rules of validations for the password.

import passwordValidator from "password-validator";
let rules = new passwordValidator();
rules.is().min(8)                                    
.is().max(100)                                  
.has().uppercase()                              
.has().digits()                                
.has().not().spaces()                           
.has().symbols()

// Setting the rules of validations for the password.

const router = Router();

router.route('/').get(async (req, res) => {
  return res.render('Auth/signup', {title: 'Sign Up'})
});

router.route("/data").post(async (req, res) => {
  const bodyData = req.body;

  if (!bodyData || Object.keys(bodyData).length === 0) {
    return res
      .status(400)
      .render('error', { error: "There are no fields in the request body", title : 'Error' });
  }

  let { firstName, lastName, age, emailAddress, password, candidateType } = bodyData;
  try {
    
    if (!firstName || !lastName || !emailAddress || !password || !candidateType || !age) throw "Error : You should provide all the parameters";
    validations.isAge(age);
    age = Number(age);
    validations.validateIsString([firstName, lastName, emailAddress, password, candidateType]);
  
    firstName = firstName.trim();
    lastName = lastName.trim();
    emailAddress = emailAddress.trim().toLowerCase();
    password = password;
  
    validations.validateName(firstName);
    validations.validateName(lastName);
    if (!emailValidator.validate(emailAddress)) throw "Error : Invalid Email";
    rules.validate(password);

  } catch (e) {
    return res.status(400).render('Auth/signup', { error : e, title: 'Error' });
  }

  try {
    const newData = await signUpFunctions.createUser(
      firstName.trim(),
      lastName.trim(),
      age,
      emailAddress.trim().toLowerCase(),
      password,
      candidateType.trim()
    );

    return res.status(200).render('Auth/login', { error: " New User Registered ", title : 'Error' });
  } catch (e) {
    if (e === "Error : User Email is already registered")
      return res.status(404).render('Auth/login', { error: e, title : 'Error' });
    else return res.status(500).render('error', { error: "Sever Error", title : 'Server Error' });
  }
});

export default router;
