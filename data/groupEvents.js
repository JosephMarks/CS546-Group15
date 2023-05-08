import { ObjectId, Binary } from "mongodb";
import { groups } from "../config/mongoCollections.js";
import * as groupData from "./groups.js";
import { parse, isValid } from "date-fns";
import { users } from "../config/mongoCollections.js";

// Functinon to create the new group sub-document.
export const create = async (
  groupId,
  title,
  description,
  eventDate,
  authorId,
  otherAttributes
) => {
  groupId = groupId.trim();
  title = title.trim();

  if (!groupId || !title || !eventDate || !description || !authorId) {
    throw new Error("Parameters groupId and title must be present");
  }
  if (
    typeof groupId !== "string" ||
    typeof title !== "string" ||
    typeof eventDate !== "string" ||
    typeof description !== "string"
  ) {
    throw new Error("Parameters groupId and title must be of type string");
  }

  if (groupId.length === 0 || title.length === 0 || eventDate.length === 0) {
    throw new Error("Input must not be empty strings");
  }
  if (typeof eventDate !== "string") {
    throw new Error("Parameters must be of type string");
  }
  if (eventDate.length === 0) {
    throw new Error("Cannot be an empty string");
  }

  const dateObject = new Date(eventDate);
  if (!isValid(dateObject)) {
    throw new Error("Date is not of proper format");
  }

  const yearValue = dateObject.getFullYear();
  if (yearValue < 2023 || yearValue > 2025) {
    throw new Error("The date is out of the appropriate range");
  }

  let users;
  let image;

  if (otherAttributes && otherAttributes.users) {
    if (!Array.isArray(otherAttributes.users)) {
      throw new Error("users must be an array");
    }
    otherAttributes.users.forEach((user) => {
      if (typeof user !== "string" || !ObjectId.isValid(user)) {
        throw new Error("Each user in users array must be a valid ObjectId");
      }
    });
    users = otherAttributes.users;
  } else {
    users = [];
  }

  if (otherAttributes && otherAttributes.image) {
    const bufferImage = Buffer.from(otherAttributes.image, "base64");
    const bin = new Binary(bufferImage);
    image = bin;
  }

  let newObjectId = new ObjectId();

  const newEvent = {
    _id: newObjectId,
    groupId: groupId,
    title: title,
    eventDate: eventDate,
    description: description,
    users: users,
    image: image,
    authorId: authorId,
  };

  const groupCollection = await groups();

  let providedGroup = newEvent.title;
  const foundGroup = await groupCollection.findOne({
    _id: new ObjectId(groupId),
    events: {
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
  if (!groupId) {
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
  console.log("Here is teh group");
  console.log(group);
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

  const dateObject = parse(eventDate);
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

export const addUser = async (groupId, eventId, user) => {
  groupId = groupId.trim();
  eventId = eventId.trim();
  user = user.trim();

  if (!groupId || !eventId || !user) {
    throw new Error("Parameters must be provided");
  }
  if (
    (typeof groupId != "string" || typeof eventId !== "string",
    typeof user !== "string")
  ) {
    throw new Error("Parameters must be of type string");
  }
  if (groupId.length === 0 || user.length === 0 || eventId.length === 0) {
    throw new Error("Cannot be an empty string");
  }

  const addedUser = {
    "events.$.users": user,
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
    { $set: addedUser },
    { returnDocument: "after" }
  );

  // Check if user exists in the database
  const usersCollection = await users();
  const foundUser = await usersCollection.findOne({ username: user });
  if (foundUser === null) {
    throw new Error("User does not exist in the database");
  }

  if (updatedInfo.lastErrorObject.n === 0) {
    throw new Error("Could not update the event title successfully");
  }
  return updatedInfo;
};

export const remove = async (eventId) => {
  eventId = eventId.trim();
  if (!eventId) {
    throw new Error("ID parameter must be provided");
  }
  if (typeof eventId !== "string") {
    throw new Error("Must be of type string");
  }
  if (eventId.length === 0) {
    throw new Error("Cannot be an empty string");
  }
  const groupCollection = await groups();

  const theEvent = await groupCollection.findOne({
    events: { $elemMatch: { _id: new ObjectId(eventId) } },
  });

  if (theEvent === null) {
    throw new Error("There is no event with that id");
  }

  const event = theEvent.events.find(
    (event) => event._id.toString() === eventId
  );
  if (!event) {
    throw new Error("There is no album with that id");
  }

  // Now we will remove the album from the array of the band document
  const updatedGroup = await groupCollection.findOneAndUpdate(
    { _id: theEvent._id },
    { $pull: { events: { _id: new ObjectId(eventId) } } },
    { returnOriginal: false }
  );

  if (!updatedGroup.value) {
    throw new Error("Album was not able to be deleted");
  }

  return updatedGroup;
};

export const removeUser = async (groupId, eventId, user) => {
  groupId = groupId.trim();
  eventId = eventId.trim();
  user = user.trim();

  if (!groupId || !eventId || !user) {
    throw new Error("Parameters must be provided");
  }
  if (
    (typeof groupId != "string" || typeof eventId !== "string",
    typeof user !== "string")
  ) {
    throw new Error("Parameters must be of type string");
  }
  if (groupId.length === 0 || user.length === 0 || eventId.length === 0) {
    throw new Error("Cannot be an empty string");
  }

  const addedUser = {
    "events.$.users": user,
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
    { $set: addedUser },
    { returnDocument: "after" }
  );
  // Check if user exists in the database
  const usersCollection = await users();
  const foundUser = await usersCollection.findOne({ username: user });
  if (foundUser === null) {
    throw new Error("User does not exist in the database");
  }

  if (updatedInfo.lastErrorObject.n === 0) {
    throw new Error("Could not update the event title successfully");
  }
  return updatedInfo;
};

export const update = async (groupId, eventId, newAttributes) => {
  groupId = groupId.trim();
  eventId = eventId.trim();

  if (!groupId || !eventId) {
    throw new Error("Parameters groupId and eventId must be provided");
  }

  if (typeof groupId !== "string" || typeof eventId !== "string") {
    throw new Error("Parameters groupId and eventId must be of type string");
  }

  const groupCollection = await groups();
  const foundGroup = await groupCollection.findOne({
    _id: new ObjectId(groupId),
  });

  if (foundGroup === null) {
    throw new Error("Group has not been found");
  }

  if (!newAttributes.title) {
    throw new Error("You must provide a title");
  }
  if (typeof newAttributes.title !== "string") {
    throw new Error("You must provide a string");
  }
  if (newAttributes.title.length === 0) {
    throw new Error("Cannnot be empty string");
  }

  if (!newAttributes.description) {
    throw new Error("You must provide a description");
  }
  if (typeof newAttributes.description !== "string") {
    throw new Error("You must provide a string");
  }
  if (newAttributes.description.length === 0) {
    throw new Error("Cannot be empty string");
  }

  if (newAttributes.users) {
    if (typeof newAttributes.users !== "string") {
      throw new Error("Users must be of type string");
    }
    if (!ObjectId.isValid(newAttributes.users)) {
      throw new Error("Users must be a valid ObjectId");
    }
  }

  if (newAttributes.image) {
    const bufferImage = Buffer.from(newAttributes.image, "base64");
    const bin = new Binary(bufferImage);
    newAttributes.image = bin;
  }

  if (newAttributes.eventDate) {
    if (typeof newAttributes.eventDate !== "string") {
      throw new Error("Parameters must be of type string");
    }
    if (newAttributes.eventDate.length === 0) {
      throw new Error("Cannot be an empty string");
    }

    const dateObject = new Date(newAttributes.eventDate);
    if (!isValid(dateObject)) {
      throw new Error("Date is not of proper format");
    }

    const yearValue = dateObject.getFullYear();
    if (yearValue < 2023 || yearValue > 2025) {
      throw new Error("The date is out of the appropriate range");
    }
  }

  const updateData = {};
  for (const [key, value] of Object.entries(newAttributes)) {
    if (typeof value !== "undefined") {
      updateData[`events.$.${key}`] = value;
    }
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
    { $set: updateData },
    { returnDocument: "after" }
  );

  if (updatedInfo.lastErrorObject.n === 0) {
    throw new Error("Could not update the event successfully");
  }
  return updatedInfo;
};
