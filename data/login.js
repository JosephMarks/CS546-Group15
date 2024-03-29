import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import validations from "../helpers.js";
import bcrypt from "bcryptjs";
import * as emailValidator from "email-validator";

const userCollection = await users();

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

const logInFunctions = {

  async checkUser(emailAddress, password) {
    if (!emailAddress || !password)
      throw "Error : You should provide all the parameters";
    if (validations.validateIsString([emailAddress, password]) === 0) {
      throw "Error : All inputs must be valid String";
    }
    emailAddress = emailAddress.trim().toLowerCase();
    password = password;

    const userCollection = await users();
    const ifAlready = await userCollection.findOne(
      { email: emailAddress },
      { projection: { _id: 1, email: 1, password: 1, candidateType: 1 } }
    );

    if (!emailValidator.validate(emailAddress)) throw "Error : Invalid Email";
    if (!rules.validate(password)) throw "Error : Invalid Password";

    const ifExists = await userCollection.findOne({
      email: emailAddress,
    });

    if (!ifExists) {
      throw "Error : Email is not registered or Wrong Password";
    } else {
      if (!(await bcrypt.compare(password, ifExists.password))) {
        throw "Error : Email is not registered or Wrong Password";
      }
    }

    return ifExists;
  },
};

export default logInFunctions;
