import { MongoUnexpectedServerResponseError, ObjectId } from "mongodb";
import { team } from "../config/mongoCollections.js";

export const getAll = async () => {
  const teamCollection = await team();
  let teamList = await teamCollection.find({}).toArray();

  if (!teamList) {
    throw new Error("This group does not exist");
  }

  teamList = teamList.map((element) => {
    element._id = element._id.toString();
    return element;
  });
  console.log(teamList);
  return teamList;
};
