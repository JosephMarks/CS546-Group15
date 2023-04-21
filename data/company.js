import { company } from "../config/mongoCollections.js";
import validations from "../helpers.js";

const companyCollection = await company();

const companyFunctions = {

    async createComapny(companyName, industry, locations, numberOfEmployees, tag, description) {
      numberOfEmployees = Number(numberOfEmployees); // TODO : needs to check if or not the string coming can be converted into a number.
  
      if (!validations.isProperString([companyName, industry, description]))
        throw "Error : Parameters can only be string not just string with empty spaces";

      validations.isArrayWithTheNonEmptyString([locations, tag])
        
      const ifAlready = await companyCollection.findOne({ companyName: companyName });
      if (ifAlready) throw "Error: User Company Name is already registered";
  
      const finalPush = await companyCollection.insertOne({
        companyName,
        industry, 
        locations,
        numberOfEmployees,
        tag,
        description
      });

      return await companyCollection.findOne({ _id: finalPush.insertedId });
    },
  };

export default companyFunctions;
