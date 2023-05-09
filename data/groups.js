import { MongoUnexpectedServerResponseError, ObjectId, Binary } from "mongodb";
import { groups, users } from "../config/mongoCollections.js";
import userData from "./user.js";

export const create = async (name, description, userId) => {
  if (!name || !description || !userId) {
    throw new Error("You must provide all required parameters");
  }
  if (
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof userId !== "string"
  ) {
    throw new Error("Items must be of type string");
  }

  name = name.trim();
  description = description.trim();
  if (name.length === 0 || description.length === 0) {
    throw new Error("Strings cannot be empty strings");
  }

  let events = [];
  let activity = [];
  let users = [userId];
  let image;

  let newGroup = {
    name: name,
    description: description,
    image: image,
    events: events,
    activity: activity,
    users: users,
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
  try {
    const group = await groupCollection.findOne({ _id: new ObjectId(id) });
    if (group === null) {
      throw new Error("There is no group with that id");
    }

    if (group.image) {
      group.base64Image = group.image.buffer.toString("base64");
    }
    group._id = group._id.toString();
    return group;
  } catch (e) {
    throw new Error(`Could not retrieve group with id ${id}: ${e.message}`);
  }
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
  if (foundGroup.name === name) {
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

export const updateDescription = async (id, description) => {
  if (!id || !description) {
    throw new Error("Parameters must be provided to make the update");
  }
  // checking to make sure id is a valid ObjectId
  if (!ObjectId.isValid(id)) {
    throw new Error("This is not a valid object ID");
  }
  // if id, name, website, recordCompany, are not strings, throw error
  if (typeof id !== "string" || typeof description !== "string") {
    throw new Error("input values must be strings");
  }
  // if id, name, website, recordCompany, are empty strings, throw error
  if (id.trim().length === 0 || description.trim().length === 0) {
    throw new Error("Input cannot be empty strings");
  }

  // Now the main part of the function here
  const updatedGroup = {
    description: description,
  };
  const groupCollection = await groups();
  // Need to check to make sure at least one item is being changed in the band update, otherwise will throw
  const foundGroup = await groupCollection.findOne({ _id: new ObjectId(id) });
  if (foundGroup === null) {
    throw new Error("Group has not been found");
  }
  if (foundGroup.description === description) {
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

export const addUser = async (id, user) => {
  if (!id || !user) {
    throw new Error("Parameters must be provided to make the update");
  }
  if (!ObjectId.isValid(id)) {
    throw new Error("This is not a valid object ID");
  }
  if (typeof id !== "string" || typeof user !== "string") {
    throw new Error("input values must be strings");
  }
  if (id.trim().length === 0 || user.trim().length === 0) {
    throw new Error("Input cannot be empty strings");
  }

  const groupCollection = await groups();
  const foundGroup = await groupCollection.findOne({ _id: new ObjectId(id) });
  if (foundGroup === null) {
    throw new Error("Group has not been found");
  }
  if (foundGroup.users.includes(user)) {
    throw new Error("User has already joined the group!");
  }
  const updatedInfo = await groupCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $addToSet: { users: user } }, // Use $addToSet to add the user to the users array
    { returnDocument: "after" }
  );
  if (updatedInfo.lastErrorObject.n === 0) {
    throw new Error("Could not update the group successfully.");
  }

  let userCollection = await users();
  const updateInfo = await userCollection.updateOne(
    { _id: new ObjectId(user) },
    { $addToSet: { group: id } }
  );

  if (updateInfo.modifiedCount === 0) {
    throw new Error("Could not update user with ID " + user);
  }

  return await get(id);
};

export const updateImage = async (id, base64Image) => {
  id = id.trim();
  const parsedId = new ObjectId(id);
  if (!id || !base64Image) {
    throw new Error("parameters must be provided");
  }
  // checking to make sure id is a valid ObjectId
  if (!ObjectId.isValid(id)) {
    throw new Error("This is not a valid object ID");
  }

  // Convert base64Image to Binary
  const bufferImage = Buffer.from(base64Image, "base64");
  const bin = new Binary(bufferImage);

  const updatedGroup = {
    image: bin,
  };
  const groupCollection = await groups();
  // Need to check to make sure at least one item is being changed in the band update, otherwise will throw
  const foundGroup = await groupCollection.findOne({ _id: new ObjectId(id) });
  if (foundGroup === null) {
    throw new Error("Group has not been found");
  }
  const updatedInfo = await groupCollection.findOneAndUpdate(
    { _id: new ObjectId(parsedId) },
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

export const updateGroup = async (groupId, updates) => {
  if (!groupId || !updates) {
    throw new Error("Parameters must be provided to make the update");
  }
  if (!groupId) {
    throw new Error("Group id must be provided");
  }
  const updatedGroup = {};

  if (updates.name) {
    if (typeof updates.name !== "string" || updates.name.trim().length === 0) {
      throw new Error("Name must be a non-empty string");
    }
    updatedGroup.name = updates.name.trim();
  }

  if (updates.description) {
    if (
      typeof updates.description !== "string" ||
      updates.description.trim().length === 0
    ) {
      throw new Error("Description must be a non-empty string");
    }
    updatedGroup.description = updates.description.trim();
  }

  if (updates.users) {
    if (!Array.isArray(updates.users)) {
      throw new Error("Users must be an array");
    }
    updatedGroup.users = updates.users;
  }

  if (updates.image) {
    const bufferImage = Buffer.from(updates.image, "base64");
    const bin = new Binary(bufferImage);
    updatedGroup.image = bin;
  }

  const groupCollection = await groups();

  const result = await groupCollection.findOneAndUpdate(
    { _id: new ObjectId(groupId) },
    { $set: updatedGroup },
    { returnDocument: "after" }
  );

  if (!result.ok) {
    throw new Error("Failed to update group");
  }

  return result.value;
};

export const numberOfUsers = async (id) => {
  const groupCollection = await groups();
  const foundGroup = await groupCollection.findOne({ _id: new ObjectId(id) });

  // Must ensure that the group id is present in the db
  if (foundGroup === null) {
    throw new Error("Group not found");
  }

  // Get the number of users in the group.
  const numberOfUsers = foundGroup.users.length;

  return numberOfUsers;
};
