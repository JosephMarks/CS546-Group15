import {members} from '../config/mongoCollections.js';

let exportedMethods = {

  async getAllTeamMates() {
    const userCollection = await members();
    const userList = await userCollection.find({}).toArray();

    return userList;
  },

  async pushAllTeamMates() {
  
    let teamWeb = {
      member1: "Ruobing Liu",
      member2: "Joseph Marks",
      member3: "Tzu-Ming Lu",
      member4: "Pradyumn Pundir"
    }

    const userCollection = await members();
    const userList = await userCollection.insertOne(teamWeb)

    return userList;
  },

};

export default exportedMethods;
