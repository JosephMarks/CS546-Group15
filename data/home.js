import { team } from "../config/mongoCollections.js";

let exportedMethods = {
  async getAllTeamMates() {
    const userCollection = await team();
    const userList = await userCollection.find({}).toArray();

    return userList;
  },
};

export default exportedMethods;
