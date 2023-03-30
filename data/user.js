import { MongoUnexpectedServerResponseError, ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";

export const updateUniversity = async (id, university) => {
  if (!id || !university) {
    throw new Error("University parameter must be provided");
  }
  if (typeof university !== "string" || typeof id !== "string") {
    throw new Error("University must be of type stirng");
  }

  let userCollection = await users();

  const updatedInfo = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { university: university } },
    { returnDocument: "after" }
  );

  if (updatedInfo.lastErrorObject.n === 0) {
    throw new Error("Could not update the user successfully.");
  }

  // TO DO: double check - am I returning the right thing here?
  const foundUser = await userCollection.findOne({ _id: new ObjectId(id) });

  return foundUser;
};
