import { ObjectId } from "mongodb";
import { groups } from "../config/mongoCollections.js";
import * as groupData from "./groups.js";
import { parse, isValid } from "date-fns";

// Functinon to create the new group sub-document.
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

  let date = new Date();
  let message = "";
  let author;
  let likes = [];
  let comments = [];
  let image;

  let newObjectId = new ObjectId();

  const newActivity = {
    _id: newObjectId,
    title: title,
    date: date,
    author: author,
    likes: likes,
    message: message,
    comments: comments,
    image: image,
  };
  console.log(newActivity);

  const groupCollection = await groups();

  let providedActivity = newActivity.title;
  const foundGroup = await groupCollection.findOne({
    _id: new ObjectId(groupId),
    activity: {
      $elemMatch: { title: providedActivity },
    },
  });
  if (foundGroup) {
    throw new Error("This event already exists, and cannot be added");
  }
  const dataResult = await groupCollection.findOneAndUpdate(
    { _id: new ObjectId(groupId) },
    { $push: { activity: newActivity } },
    { returnDocument: "after" }
  );

  return newActivity;
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
  if (group === null) {
    throw new Error("Grouop does not exist");
  }
  let { activity } = group;

  return activity;
};
