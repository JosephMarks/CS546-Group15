import { users } from "../config/mongoCollections.js";
import validations from "../helpers.js";
import bcrypt from "bcryptjs";
import emailValidator from "email-validator"; //use to validate email address

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

const userCollection = await users();

const signUpFunctions = {
  async createUser(
    firstName,
    lastName,
    age,
    emailAddress,
    password,
    candidateType
  ) {
    validations.isAge(age);
    age = Number(age);

    if (!firstName || !lastName || !emailAddress || !password || !candidateType)
      throw "Error : You should provide all the parameters";
    validations.validateIsString([
      firstName,
      lastName,
      emailAddress,
      password,
      candidateType,
    ]);

    firstName = firstName.trim();
    lastName = lastName.trim();
    emailAddress = emailAddress.trim().toLowerCase();
    password = password;

    validations.validateName(firstName);
    validations.validateName(lastName);
    if (!emailValidator.validate(emailAddress)) throw "Error : Invalid Email";
    if (!rules.validate(password)) throw "Error : Invalid Password";

    password = await bcrypt.hash(password, 10);

    const ifExists = await userCollection.findOne({
      emailAddress: emailAddress,
    });
    if (ifExists) throw "Error : User Email is already registered";

    // attributes need, but to be populated later when profile filled out by user
    let gender = "";
    let locationState = "";
    let university = "";
    let collegeMajor = "";
    let skills = [];
    let experience = 0;
    let seekingJob = [];
    let connections = [];
    let group = [];
    let createdAt = "";
    let updatedAt = "";
    let likedReferPost = [];
    const finalPush = await userCollection.insertOne({
      firstName,
      lastName,
      emailAddress: emailAddress.toLowerCase(),
      password,
      age: age,
      candidateType: candidateType,
      gender,
      locationState,
      university,
      collegeMajor,
      skills,
      experience,
      seekingJob,
      connections,
      group,
      createdAt,
      updatedAt,
      likedReferPost,
    });

    return await userCollection.findOne({ _id: finalPush.insertedId });
  },
};

export default signUpFunctions;
