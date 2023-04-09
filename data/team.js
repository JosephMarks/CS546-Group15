import { MongoUnexpectedServerResponseError, ObjectId } from "mongodb";
import { members } from "../config/mongoCollections.js";

export const getAll = async () => {
  const teamCollection = await members();
  let teamList = await teamCollection.find({}).toArray();

  if (!groupList) {
    throw new Error("This group does not exist");
  }

  groupList = groupList.map((element) => {
    element._id = element._id.toString();
    return element;
  });
  console.log(groupList);
  return groupList;
};
