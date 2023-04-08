import {members} from '../config/mongoCollections.js';

let exportedMethods = {

  async getAllTeamMates() {
    const userCollection = await members();
    const userList = await userCollection.find({}).toArray();

    return userList;
  }

};

export default exportedMethods;
