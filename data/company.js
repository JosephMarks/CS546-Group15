import { company } from "../config/mongoCollections.js";
import validations from "../helpers.js";
import { ObjectId } from "mongodb";

const companyCollection = await company();

const companyFunctions = {

    async createComapny(companyName, companyEmail, industry, locations, numberOfEmployees, description, createdAt, imgSrc) {
      validations.isNumberOfEmployee(numberOfEmployees);
      validations.checkEmail(companyEmail);
      numberOfEmployees = Number(numberOfEmployees);
  
      if (!validations.isProperString([companyName, industry, description]))
        throw "Error : Parameters can only be string not just string with empty spaces";

      validations.isArrayWithTheNonEmptyString([locations])
        
      const ifAlready = await companyCollection.findOne({ companyName: companyName });
      if (ifAlready) throw "Error: User Company Name is already registered";
      
      companyName = companyName.trim().toLowerCase();
      industry = industry.trim().toLowerCase();
      locations = locations.map(x => x.trim()); // TODO : Must fall in the states array.
      description = description.trim().toLowerCase();

      const finalPush = await companyCollection.insertOne({
        companyName,
        companyEmail,
        industry, 
        locations,
        numberOfEmployees,
        jobs: [],
        description,
        imgSrc,
        createdAt
      });

      return await companyCollection.findOne({ _id: finalPush.insertedId });
    },

    async getCompanyData (id) {
      let companyData = await companyCollection.findOne({_id: new ObjectId(id)});
      if (!companyData) throw "Error : No Company Found";
      return companyData;
    },

    async getCompanyDataFromEmail (email) {

      validations.checkEmail(email);
      let companyData = await companyCollection.findOne({companyEmail: email});

      return companyData;
    },

    async getCompanyDetailsFromCompanyName (name) {
      if (!validations.isProperString([name]))
        throw "Error : Parameters can only be string not just string with empty spaces";

      let companyData = await companyCollection.findOne({ companyName: name});
      if (!companyData) throw "Error : No Company Found";
      return companyData;
    }
  };

export default companyFunctions;
