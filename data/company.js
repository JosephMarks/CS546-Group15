import { company } from "../config/mongoCollections.js";
import validations from "../helpers.js";
import { ObjectId } from "mongodb";

const companyCollection = await company();

const companyFunctions = {

    async createComapny(companyName, industry, locations, numberOfEmployees, description, createdAt, imgSrc) {
      numberOfEmployees = Number(numberOfEmployees); // TODO : needs to check if or not the string coming can be converted into a number.
  
      if (!validations.isProperString([companyName, industry, description]))
        throw "Error : Parameters can only be string not just string with empty spaces";

      validations.isArrayWithTheNonEmptyString([locations])
        
      const ifAlready = await companyCollection.findOne({ companyName: companyName });
      if (ifAlready) throw "Error: User Company Name is already registered";
  
      const finalPush = await companyCollection.insertOne({
        companyName,
        industry, 
        locations,
        numberOfEmployees,
        jobs: [],
        description,
        imgSrc
      });

      return await companyCollection.findOne({ _id: finalPush.insertedId });
    },

    async getCompanyData (id) {
      let companyData = await companyCollection.findOne({_id: new ObjectId(id)});
      if (!companyData) throw "Error : No Company Found";
      return companyData;
    }
  };

  

export default companyFunctions;
