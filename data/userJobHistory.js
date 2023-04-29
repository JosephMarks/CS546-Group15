import { ObjectId } from "mongodb";
import * as userData from "./users.js";
import validations from "../helpers.js";
import { parse, isValid } from "date-fns";

export const create = async (
  userId,
  role,
  company,
  startDate,
  endDate,
  description
) => {
  if (!userId || !role || !company || !startDate || !endDate || !description) {
    throw new Error("Parameters must be provied for job");
  }
  userId = validations.checkId(userId);
};
role = role.trim();
if (typeof role !== "string") {
  throw new Error("Role must be of type string");
}
if (role.length === 0) {
  throw new Error("Role must not be empty string");
}
startDate = startDate.trim();
endDate = endDate.trim();

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

export const getAll = async (userId) => {};

export const updateTitle = async (groupId, eventId, title) => {};

export const updateEventDate = async (groupId, eventId, eventDate) => {};

export const remove = async (eventId) => {};
