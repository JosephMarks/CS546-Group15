import { ObjectId } from "mongodb";
import userData from "../data/user.js";
import validations from "../helpers.js";
import { parse, isValid } from "date-fns";
import { users } from "../config/mongoCollections.js";
import { isBefore, differenceInCalendarDays } from "date-fns";

export const create = async (
  userId,
  role,
  organization,
  startDate,
  endDate,
  description
) => {
  if (
    !userId ||
    !role ||
    !organization ||
    !startDate ||
    !endDate ||
    !description
  ) {
    throw new Error("Parameters must be provied for job");
  }
  userId = validations.checkId(userId);

  let regex = /^[a-zA-Z_ ]*$/g
  if (!regex.test(role)) {
    throw new Error(
      "role not allowed to have numeric values or special characters"
    );
  }

  role = role.trim();
  if (typeof role !== "string") {
    throw new Error("Role must be of type string");
  }
  if (role.length === 0) {
    throw new Error("Role must not be empty string");
  }
  startDate = startDate.trim();
  endDate = endDate.trim().toLowerCase();
  console.log({ endDate });
  if (endDate !== "present") {
    // need to ensure that the date provide is of the proper format
    // TO DO: double check all this date stuff - may be a little buggy?
    const endDateDateObj = parse(endDate, "MM/dd/yyyy", new Date());
    if (!isValid(endDateDateObj)) {
      throw new Error("Date is not of proper format");
    }
    if (typeof endDate !== "string") {
      throw new Error("This is not a type string");
    }
    if (endDate.length === 0) {
      throw new Error("String cannot be of length empty");
    }
    let endDateDateArray = [];
    endDateDateArray = endDate.split("/");
    if (endDateDateArray.length < 3) {
      throw new Error("This is not valid");
    }
    if (endDateDateArray.length !== 3) {
      throw new Error("This is not valid");
    }
    if (
      endDateDateArray[0].length !== 2 ||
      endDateDateArray[1].length !== 2 ||
      endDateDateArray[2].length !== 4
    ) {
      throw new Error("This is not valid format");
    }
    let endDateYearString;
    let endDateYearValue;
    endDateYearString = endDateDateArray[2];
    endDateYearValue = Number(endDateYearString);
    if (endDateYearString < 1950 || endDateYearString > 2023) {
      throw new Error("The date is out of the appropriate range");
    }

    // need to ensure that the date provide is of the proper format
    // TO DO: double check all this date stuff - may be a little buggy?
    const dateObject = parse(startDate, "MM/dd/yyyy", new Date());
    console.log(dateObject);
    if (!isValid(dateObject)) {
      throw new Error("Date is not of proper format");
    }
    if (typeof startDate !== "string") {
      throw new Error("This is not a type string");
    }
    if (startDate.length === 0) {
      throw new Error("String cannot be of length empty");
    }
    let dateArray = [];
    dateArray = startDate.split("/");
    if (dateArray.length < 3) {
      throw new Error("This is not valid");
    }
    if (dateArray.length !== 3) {
      throw new Error("This is not valid");
    }
    if (
      dateArray[0].length !== 2 ||
      dateArray[1].length !== 2 ||
      dateArray[2].length !== 4
    ) {
      throw new Error("This is not valid format");
    }
    let yearString;
    let yearValue;
    yearString = dateArray[2];
    yearValue = Number(yearString);
    if (yearValue < 1950 || yearValue > 2023) {
      throw new Error("The date is out of the appropriate range");
    }
  }

  description = description.trim();
  if (typeof description !== "string") {
    throw new Error("description must be of type string");
  }
  if (description.length === 0) {
    throw new Error("May not be of empty string");
  }
  //check if user is even present
  const userCollection = await users();

  let foundUser = await userCollection.findOne({ _id: new ObjectId(userId) });
  if (!foundUser) {
    throw new Error("User is not in the database");
  }
  let newObjectId = new ObjectId();
  let newJobExperience = {
    _id: newObjectId,
    userId: new ObjectId(userId),
    role: role,
    organization: organization,
    startDate: startDate,
    endDate: endDate,
    description: description,
  };
  const dataResult = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $push: { jobHistory: newJobExperience } },
    { returnDocument: "after" }
  );
  // Check if the new job was added successfully
  if (dataResult.lastErrorObject.n !== 1) {
    throw new Error("Failed to add the new job experience");
  }

  // Return the new job experience
  return newJobExperience;
};

export const getAll = async (userId) => {
  userId = userId.trim();
  if (!userId) {
    throw new Error("user id must be provided");
  }
  if (userId.length === 0) {
    throw new Error("Must not be empty string");
  }
  if (typeof userId !== "string") {
    throw new Error("must be of type string");
  }
  if (!ObjectId.isValid(userId)) {
    throw new Error("Invalid object Id");
  }
  let userLookup = await userData.getUserById(userId);
  if (userLookup === null) {
    throw new Error("User does not exist");
  }
  let { jobHistory } = userLookup;
  console.log(jobHistory);
  for (let i = 0; i < jobHistory.length; i++) {
    jobHistory[i]._id = jobHistory[i]._id.toString();
  }
  return jobHistory;
};

export const removeJobHistory = async (userId, jobId) => {
  if (!userId || !jobId) {
    throw new Error("userId and jobId must be provided");
  }

  // Validate userId and jobId
  userId = validations.checkId(userId);
  jobId = validations.checkId(jobId);

  // Check if user is present
  const userCollection = await users();
  let foundUser = await userCollection.findOne({ _id: new ObjectId(userId) });
  if (!foundUser) {
    throw new Error("User is not in the database");
  }

  // Remove the job history sub-document
  const dataResult = await userCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $pull: { jobHistory: { _id: new ObjectId(jobId) } } }
  );

  // Check if the job history was removed successfully
  if (dataResult.modifiedCount !== 1) {
    throw new Error("Failed to remove the job history");
  }

  // Return success message
  return { message: "Job history removed successfully" };
};

export const removeAll = async (userId) => {
  if (!userId) {
    throw new Error("userId must be provided");
  }

  // Validate userId
  userId = validations.checkId(userId);

  // Check if user is present
  const userCollection = await users();
  let foundUser = await userCollection.findOne({ _id: new ObjectId(userId) });
  if (!foundUser) {
    throw new Error("User is not in the database");
  }

  // Remove all job history sub-documents
  const dataResult = await userCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { jobHistory: [] } }
  );

  // Check if the job histories were removed successfully
  if (dataResult.modifiedCount !== 1) {
    throw new Error("Failed to remove all job histories");
  }

  // Return success message
  return { message: "All job histories removed successfully" };
};

export const update = async (
  userId,
  jobId,
  role = null,
  organization = null,
  startDate = null,
  endDate = null,
  description = null
) => {
  if (!userId || !jobId) {
    throw new Error("userId and jobId must be provided");
  }

  // Validate userId and jobId
  userId = validations.checkId(userId);
  jobId = validations.checkId(jobId);

  //check if user is present
  const userCollection = await users();
  let foundUser = await userCollection.findOne({ _id: new ObjectId(userId) });
  if (!foundUser) {
    throw new Error("User is not in the database");
  }

  // Prepare the update object
  let updateObject = {};
  if (role) {
    updateObject["jobHistory.$.role"] = role.trim();
  }
  if (organization) {
    updateObject["jobHistory.$.organization"] = organization.trim();
  }
  if (startDate) {
    const parsedStartDate = parse(startDate, "MM/dd/yyyy", new Date());
    if (!isValid(parsedStartDate)) {
      throw new Error("Invalid start date format");
    }
    updateObject["jobHistory.$.startDate"] = startDate.trim();
  }
  if (endDate) {
    if (endDate !== "present") {
      const parsedEndDate = parse(endDate, "MM/dd/yyyy", new Date());
      if (!isValid(parsedEndDate)) {
        throw new Error("Invalid end date format");
      }
      updateObject["jobHistory.$.endDate"] = endDate.trim();
    } else {
      updateObject["jobHistory.$.endDate"] = endDate;
    }
  }

  // Check if endDate is not in the future
  if (endDate !== "present") {
    const currentDate = new Date();
    const parsedEndDate = parse(endDate, "MM/dd/yyyy", currentDate);
    if (differenceInCalendarDays(parsedEndDate, currentDate) > 0) {
      throw new Error("End date cannot be in the future");
    }
  }

  // Check if endDate is not before startDate
  if (startDate && endDate !== "present") {
    const parsedStartDate = parse(startDate, "MM/dd/yyyy", new Date());
    const parsedEndDate = parse(endDate, "MM/dd/yyyy", new Date());
    if (isBefore(parsedEndDate, parsedStartDate)) {
      throw new Error("End date cannot be before start date");
    }
  }
  if (description) {
    updateObject["jobHistory.$.description"] = description.trim();
  }

  if (Object.keys(updateObject).length === 0) {
    return { message: "No changes to update" };
  }

  // Update the job history
  const dataResult = await userCollection.updateOne(
    { _id: new ObjectId(userId), "jobHistory._id": new ObjectId(jobId) },
    { $set: updateObject }
  );

  // Return success message or updated job object
  return { message: "Job history updated successfully" };
};
