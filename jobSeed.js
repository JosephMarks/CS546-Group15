import { company } from "./config/mongoCollections.js";
import validations from "./helpers.js";
import { ObjectId } from "mongodb";

const companyCollection = await company();
import companyFunctions from "./data/company.js";

try {
    await companyFunctions.createJob("G", "pundirpradyumn1@gmail.com", "web developer intern summer 2023", "2100", "level", "jobType", "skills", "location", "description");
} catch (e){
    console.log(e);
}