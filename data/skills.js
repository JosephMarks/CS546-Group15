import { ObjectId } from "mongodb";
import { users, skills } from "../config/mongoCollections.js";
import validations from "../helpers.js";
import usersData from "./user.js";


const exportedMethods = {
    async getAllSkills ()
    {
        const skillsCollection = await skills();
        const skillsList = await skillsCollection.find({}).toArray();
        for(let ele of skillsList)
        {
            ele._id = ele._id.toString();
        }
        return skillsList;
    },

    async getSkillsByUserId (userId)
    {
        const skillsCollection = await skills();
        const skillsList = await skillsCollection.find({ userId: userId }).toArray();
        for(let ele of skillsList)
        {
            ele._id = ele._id.toString();
        }
        return skillsList;
    },
}

export default exportedMethods;