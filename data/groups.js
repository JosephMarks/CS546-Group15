import { MongoUnexpectedServerResponseError, ObjectId } from "mongodb";
import { groups } from "../config/mongoCollections.js";

export const create = async (name, description) => {
  name = name.trim();
  description = description.trim();

  if (!name || !description) {
    throw new Error("You must provide all required parameters");
  }
  if (typeof name !== "string" || typeof description !== "string") {
    throw new Error("Items must be of type string");
  }
  if (name.length === 0 || description.length === 0) {
    throw new Error("Strings cannot be empty strings");
  }

  let event;
  let activity;

  let newGroup = {
    name: name,
    description: description,
    event: event,
    activity: activity,
  };

  const groupCollection = await groups();
  const insertInfo = await groupCollection.insertOne(newGroup);

  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw new Error("This group has not been successfully added");
  }

  const newId = insertInfo.insertedId.toString();
  const group = await get(newId);
  return group;
};

export const get = async (id) => {
  if (!id) {
    throw new Error("Id must be provided");
  }
  if (typeof id !== "string" || id.trim().length === 0) {
    throw new Error("Id must be of type string");
  }
  const groupCollection = await groups();
  const group = await groupCollection.findOne({ _id: new ObjectId(id) });
  if (group === null) {
    throw new Error("There is no group with that id");
  }
  group._id = group._id.toString();
  return group;
};

export const getAll = async () => {
  const groupCollection = await groups();
  let groupList = await groupCollection.find({}).toArray();

  if (!groupList) {
    throw new Error("This group does not exist");
  }

  groupList = groupList.map((element) => {
    element._id = element._id.toString();
    return element;
  });

  return groupList;
};

export const remove = async (id) => {
  if (!id) {
    throw new Error("no id has been provided");
  }
  if (typeof id !== "string") {
    throw new Error("the id provided must be of type string");
  }
  if (id.trim().length === 0) {
    throw new Error("the id provided must not be an empty string");
  }
  id = id.trim();
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid object id provided");
  }

  const groupCollection = await groups();
  const delitionInfo = await groupCollection.findOneAndDelete({
    _id: new ObjectId(id),
  });

  return `${delitionInfo.value.name} has been successfully deleted!`;
};

export const updateName = async (id, name) => {
  if (!id || !name) {
    throw new Error("Parameters must be provided to make the update");
  }
  // checking to make sure id is a valid ObjectId
  if (!ObjectId.isValid(id)) {
    throw new Error("This is not a valid object ID");
  }
  // if id, name, website, recordCompany, are not strings, throw error
  if (typeof id !== "string" || typeof name !== "string") {
    throw new Error("input values must be strings");
  }
  // if id, name, website, recordCompany, are empty strings, throw error
  if (id.trim().length === 0 || name.trim().length === 0) {
    throw new Error("Input cannot be empty strings");
  }

  // Now the main part of the function here
  const updatedGroup = {
    name: name,
  };
  const groupCollection = await groups();
  // Need to check to make sure at least one item is being changed in the band update, otherwise will throw
  const foundGroup = await groupCollection.findOne({ _id: new ObjectId(id) });
  if (foundGroup === null) {
    throw new Error("Group has not been found");
  }
  if (foundGroup.name === foundGroup.name) {
    throw new Error(
      "There are no differences in the updated values compared to the current values for the group!"
    );
  }
  const updatedInfo = await groupCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updatedGroup },
    { returnDocument: "after" }
  );
  if (updatedInfo.lastErrorObject.n === 0) {
    throw new Error("Could not update the band successfully.");
  }
  // TO DO: double check - am I returning the right thing here?
  return await get(id);
};
export const doesGroupExist = async (id) => {
  const groupCollection = await groups();
  const foundGroup = await groupCollection.findOne({ _id: new ObjectId(id) });
  // Must ensure that the band id is present in the db
  if (foundGroup === null) {
    return false;
  }
  return true;
};
