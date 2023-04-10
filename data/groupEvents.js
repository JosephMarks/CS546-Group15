import { ObjectId } from "mongodb";
import { get } from "mongoose";
import { groups } from "../config/mongoCollections.js";
import * as groupData from "./groups.js";
import { parse, isValid } from "date-fns";

// Functinon to create the new group sub-document
export const create = async (groupId, title) => {
  groupId = groupId.trim();
  title = title.trim();

  if (!groupId || !title) {
    throw new Error("Parameters must be present");
  }
  if (typeof groupId !== "string" || typeof title !== "string") {
    throw new Error("Paramterst must be of type string");
  }

  if (groupId.length === 0 || title.length === 0) {
    throw new Error("Input must not be empty strings");
  }

  let eventDate;
  let users;
  let image;

  let newObjectId = new ObjectId();

  const newEvent = {
    _id: newObjectId,
    groupId: groupId,
    title: title,
    eventDate: eventDate,
    users: users,
    image: image,
  };

  const groupCollection = await groups();
  console.log(groupCollection);

  let providedGroup = newEvent.title;
  const foundGroup = await groupCollection.findOne({
    _id: new ObjectId(groupId),
    groups: {
      $elemMatch: { title: providedGroup },
    },
  });
  if (foundGroup) {
    throw new Error("This event already exists, and cannot be added");
  }
  const dataResult = await groupCollection.findOneAndUpdate(
    { _id: new ObjectId(groupId) },
    { $push: { events: newEvent } },
    { returnDocument: "after" }
  );

  let newlyAddedEvent = dataResult.value.events.find((events) =>
    events._id.equals(newObjectId)
  );
  newlyAddedEvent._id = newlyAddedEvent._id.toString();

  return newlyAddedEvent;
};

export const getAll = async (groupId) => {
  groupId = groupId.trim();
  if (!groupID) {
    throw new Error("You must provide a group id");
  }
  if (typeof groupId !== "string") {
    throw new Error("You must provide group id of type string");
  }
  if (groupId.length === 0) {
    throw new Error("Group Id must not be an empty string");
  }
  if (!ObjectId.isValid(groupId)) {
    throw new Error("Group Id must be a valid Object Id");
  }
  let group = await groupData.get(groupId);
  if (group === null) {
    throw new Error("Grouop does not exist");
  }
  let { events } = group;
  for (let i = 0; i < events.length; i++) {
    events[i]._id = events[i]._id.toString();
  }
  return events;
};

export const updateTitle = async (groupId, eventId, title) => {
  console.log(groupId, eventId, title);
  groupId = groupId.trim();
  eventId = eventId.trim();
  title = title.trim();
  if (!groupId || !eventId || !title) {
    throw new Error("Parameters must be present");
  }
  if (
    typeof groupId != "string" ||
    typeof eventId != "string" ||
    typeof title !== "string"
  ) {
    throw new Error("Parameters must be of type string");
  }
  if (groupId.length === 0 || eventId.length === 0 || title.length === 0) {
    throw new Error("Cannot be an empty string");
  }

  const updatedTitle = {
    "events.$.title": title,
  };
  const groupCollection = await groups();
  const foundGroup = await groupCollection.findOne({
    _id: new ObjectId(groupId),
  });
  console.log(foundGroup);
  if (foundGroup === null) {
    throw new Error("Group has not been found");
  }
  const updatedInfo = await groupCollection.findOneAndUpdate(
    {
      _id: new ObjectId(groupId),
      events: {
        $elemMatch: {
          _id: new ObjectId(eventId),
        },
      },
    },
    { $set: updatedTitle },
    { returnDocument: "after" }
  );

  console.log(updatedInfo);

  if (updatedInfo.lastErrorObject.n === 0) {
    throw new Error("Could not update the event title successfully");
  }
  return updatedInfo;
};

export const updateEventDate = async (groupId, eventId, eventDate) => {
  groupId = groupId.trim();
  eventId = eventId.trim();

  eventDate = eventDate.trim();
  if (!groupId || !eventDate || !eventId) {
    throw new Error("Parameters must be provided");
  }
  if (
    (typeof groupId != "string" || typeof eventDate !== "string",
    typeof eventId !== "string")
  ) {
    throw new Error("Parameters must be of type string");
  }
  if (groupId.length === 0 || eventDate.length === 0 || eventId.length === 0) {
    throw new Error("Cannot be an empty string");
  }

  const dateObject = parse(eventDate, "MM/dd/yyyy", new Date());
  if (!isValid(dateObject)) {
    throw new Error("Date is not of proper format");
  }

  let dateArray = [];
  dateArray = eventDate.split("/");
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
  if (yearValue < 2023 || yearValue > 2025) {
    throw new Error("The date is out of the appropriate range");
  }

  const updatedEventDate = {
    "events.$.eventDate": eventDate,
  };
  const groupCollection = await groups();
  const foundGroup = await groupCollection.findOne({
    _id: new ObjectId(groupId),
  });
  if (foundGroup === null) {
    throw new Error("Group has not been found");
  }
  const updatedInfo = await groupCollection.findOneAndUpdate(
    {
      _id: new ObjectId(groupId),
      events: {
        $elemMatch: {
          _id: new ObjectId(eventId),
        },
      },
    },
    { $set: updatedEventDate },
    { returnDocument: "after" }
  );

  if (updatedInfo.lastErrorObject.n === 0) {
    throw new Error("Could not update the event title successfully");
  }
  return updatedInfo;
};

export const updateUsers = async (groupId, user) => {
  return 1;
};

export const remove = async (groupId) => {
  return 1;
};
