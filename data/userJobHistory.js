import { ObjectId } from "mongodb";
import * as userData from "./user.js";
import validations from "../helpers.js";
import { parse, isValid } from "date-fns";
import { users } from "../config/mongoCollections.js";

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

  role = role.trim();
  if (typeof role !== "string") {
    throw new Error("Role must be of type string");
  }
  if (role.length === 0) {
    throw new Error("Role must not be empty string");
  }
  startDate = startDate.trim();
  endDate = endDate.trim().toLowerCase();

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
    if (endDateYearString < 1900 || endDateYearString > 2023) {
      throw new Error("The date is out of the appropriate range");
    }

    // need to ensure that the date provide is of the proper format
    // TO DO: double check all this date stuff - may be a little buggy?
    const dateObject = parse(startDate, "MM/dd/yyyy", new Date());
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
    if (yearValue < 1900 || yearValue > 2023) {
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
  for (let i = 0; i < jobHistory.length; i++) {
    jobHistory[i]._id = jobHistory[i]._id.toString();
  }
  return jobHistory;
};

export const updateTitle = async (groupId, eventId, title) => {};

export const updateEventDate = async (groupId, eventId, eventDate) => {};

export const remove = async (eventId) => {};
