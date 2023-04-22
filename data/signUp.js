import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import validations from "../helpers.js";
const userCollection = await users();

const signUpFunctions = {
  async create(fname, lname, age, email, password, candidateType) {
    age = Number(age);

    if (
      !validations.isProperString([fname, lname, email.toLowerCase(), password, candidateType])
    )
      throw "Error : FirstName, Last Name, Email, Password, candidateType can only be string not just string with empty spaces";
    validations.isAge(age);

    const ifAlready = await userCollection.findOne({
      email: email.toLowerCase(),
    });
    if (ifAlready) throw "Error: User Email is already registered";

    // attributes need, but to be populated later when profile filled out by user
    let gender = "";
    let locationState = "";
    let university = "";
    let collegeMajor = "";
    let interestArea = [];
    let experience = 0;
    let seekingJob = [];
    let connections = [];
    let group = [];
    let createdAt = "";
    let updatedAt = "";

    const finalPush = await userCollection.insertOne({
      fname,
      lname,
      email: email.toLowerCase(),
      password,
      age: age,
      candidateType: candidateType,
      gender,
      locationState,
      university,
      collegeMajor,
      interestArea,
      experience,
      seekingJob,
      connections,
      group,
      createdAt,
      updatedAt,
    });
    return await userCollection.findOne({ _id: finalPush.insertedId });
  },
};

export default signUpFunctions;
