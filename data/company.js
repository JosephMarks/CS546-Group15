import { company } from "../config/mongoCollections.js";
import validations from "../helpers.js";
import { ObjectId } from "mongodb";

const companyCollection = await company();

const companyFunctions = {

  async createCompany( companyName, companyEmail, industry, locations, numberOfEmployees, description, createdAt, imgSrc ) {
    
    if ( !companyName || !companyEmail || !industry || !locations || !numberOfEmployees || !description|| !imgSrc || !createdAt)
      throw "Error : You should provide all the parameters";

    validations.isNumberOfEmployee(numberOfEmployees);
    validations.checkEmail(companyEmail);
    numberOfEmployees = Number(numberOfEmployees);

    if (!validations.isProperString([companyName, industry, description, imgSrc]))
      throw "Error : Parameters can only be string not just string with empty spaces";
    
    companyName = companyName.trim().toLowerCase();
    industry = industry.trim().toLowerCase();
    description = description.trim().toLowerCase();
    imgSrc = imgSrc.trim();

    if (typeof(locations) === 'string') locations = [locations];
    validations.isArrayWithTheNonEmptyStringForLocation([locations]);
    locations = locations.map((x) => x.trim());

    const ifAlready = await companyCollection.findOne({ companyName: companyName });
    if (ifAlready) throw "Error: User Company Name is already registered";

    const finalPush = await companyCollection.insertOne({ companyName, companyEmail, industry, locations, numberOfEmployees, jobs: [], description, imgSrc, createdAt});
    return await companyCollection.findOne({ _id: finalPush.insertedId });
    
  },

  async getCompanyData(id) {

    if (!id || !ObjectId.isValid(id)) throw "Error : Invalid Id";

    let companyData = await companyCollection.findOne( { _id: new ObjectId(id) });
    if (!companyData) throw "Error : No Company Found";

    return companyData;

  },

  async getCompanyDataFromEmail(email) {

    if (!email) throw "Error: Email required";
    
    validations.checkEmail(email);
    let companyData = await companyCollection.findOne({ companyEmail: email });

    return companyData;
  },

  async getCompanyDetailsFromCompanyName(name) {

    if (!name) throw "Error: All parameteres are required";

    if (!validations.isProperString([name]))
      throw "Error : Parameters can only be string not just string with empty spaces";

    let companyData = await companyCollection.findOne({ companyName: name });
    if (!companyData) throw "Error : No Company Found";
    return companyData;

  },

  // async createJob(
  //   companyName,
  //   companyEmail,
  //   jobTitle,
  //   salary,
  //   level,
  //   jobType,
  //   skills,
  //   location,
  //   description
  // ) {
  //   if (
  //     !companyName ||
  //     !companyEmail ||
  //     !jobTitle ||
  //     !salary ||
  //     !level ||
  //     !jobType ||
  //     !location ||
  //     !description
  //   )
  //     throw "Error : All parameters are required";

  //   if (
  //     !validations.isProperString([
  //       companyName,
  //       companyEmail,
  //       jobTitle,
  //       description,
  //       level,
  //     ])
  //   )
  //     throw "Error : Parameters can only be string not just string with empty spaces";

  //     return await companyCollection.findOne({ _id: finalPush.insertedId });
  //   },

    async deleteCompany(id){
      console.log(id);
      if(!ObjectId.isValid(id)) throw "Error : Invalid Id";

      let companyData = await companyCollection.findOneAndDelete({_id: new ObjectId(id)});
      if (!companyData) throw "Error : No Company Found";
      return companyData;
    },

    async createJob ( companyName, companyEmail, jobTitle, salary, level, jobType, skills, location, description ) {
      
      if ( !companyName || !companyEmail || !jobTitle || !salary || !level || !jobType || !location || !description )
        throw "Error : All parameters are required";
  
      if ( !validations.isProperString([ companyName, companyEmail, jobTitle, description, level ] ))
        throw "Error : Parameters can only be string not just string with empty spaces";

      if (typeof(jobType) === 'string') jobType = [jobType];
      validations.isArrayWithTheNonEmptyStringForJobType([jobType]);
      jobType = jobType.map(x => x.trim().toLowerCase());

      if (typeof(skills) === 'string') skills = [skills];
      validations.isArrayWithTheNonEmptyStringForSkills([skills]);
      skills = skills.map(x => x.trim().toLowerCase());

      if (typeof(location) === 'string') location = [location];
      validations.isArrayWithTheNonEmptyStringForLocation([location]);
      location = location.map(x => x.trim().toLowerCase());
          
      validations.isSalary(salary);
      salary = Number(salary);

      jobTitle = jobTitle.trim().toLowerCase();
      description = description.trim().toLowerCase();

      let jobData = {

        _id: new ObjectId(),
        jobTitle,
        skills,
        level,
        jobType,
        salary,
        location,
        description : description.trim().toLowerCase()

      } 

      const sameJob = await companyCollection.findOne({companyEmail: companyEmail, "jobs.jobTitle": jobTitle});
      if (sameJob) throw "Error: same company cannot have same job title";

      let createJobDetails = await companyCollection.updateOne({companyEmail: companyEmail}, {$push: {jobs: jobData}});
      return createJobDetails;

    },

    async updateJob (id, companyName, companyEmail, jobTitle, salary, level, jobType, skills, location, description) {

      if (!id || !ObjectId.isValid(id)) throw "Error: Invalid Id";
      
      if ( !companyName || !companyEmail || !jobTitle || !salary || !level || !jobType || !location || !description)
        throw "Error : All parameters are required";
  
      if ( !validations.isProperString([ companyName, companyEmail, jobTitle, description, level ]))
        throw "Error : Parameters can only be string not just string with empty spaces";

      if (typeof (jobType) === 'string') jobType = [jobType];
      validations.isArrayWithTheNonEmptyStringForJobType([jobType]);
      jobType = jobType.map(x => x.trim().toLowerCase());

      if (typeof (skills) === 'string') skills = [skills];
      validations.isArrayWithTheNonEmptyStringForSkills([skills]);
      skills = skills.map(x => x.trim().toLowerCase());

      if (typeof (location) === 'string') location = [location];
      validations.isArrayWithTheNonEmptyStringForLocation([location]);
      location = location.map(x => x.trim().toLowerCase());

      validations.isSalary(salary);
      salary = Number(salary);

      let jobData = {

        _id: new ObjectId(),
        jobTitle : jobTitle.trim().toLowerCase(),
        skills: skills,
        level,
        jobType,
        salary,
        location,
        description : description.trim().toLowerCase()

      } 

      let temp = await this.getJobById(id);

      let getCompanyDetails = await this.getCompanyDataFromEmail(companyEmail);

      let updatedInfo = await companyCollection.updateOne(

        {"jobs._id": new ObjectId(id)},
        {$pull: {jobs: { jobTitle: temp.jobs[0].jobTitle }}},
        {returnDocument: 'after'}

      );

      let getCompanyInfo = await companyCollection.updateOne(

        {_id: getCompanyDetails._id},
        {$push: {jobs: jobData}},
        {returnDocument: 'after'}

      )

      return getCompanyInfo;
    },

    async getJobById (id) {

      if (!id) throw "Error : Invalid Id";
      if (!ObjectId.isValid(id)) throw "Error : Invalid Id";
      id = id.trim();

      let getJob = await companyCollection.findOne( { "jobs._id": new ObjectId(id) }, { projection: { companyName: 1, "jobs.$": 1 } });
      
      if (!getJob || getJob.length === 0) throw "Error : No Job Found";
      
      return getJob;
      
      
    },

    async updateCompany(email, companyName, companyEmail, industry, locations, numberOfEmployees, description, imgSrc) {
      
      console.log("data", numberOfEmployees);

      if ( !companyName || !companyEmail || !industry || !locations || !numberOfEmployees || !description || !imgSrc )
        throw "Error : You should provide all the parameters";

      validations.isNumberOfEmployee(numberOfEmployees);
      validations.checkEmail(companyEmail);
      numberOfEmployees = Number(numberOfEmployees);
  
      if (!validations.isProperString([companyName, industry, description]))
        throw "Error : Parameters can only be string not just string with empty spaces";

      validations.isArrayWithTheNonEmptyString([locations])
        
      companyName = companyName.trim().toLowerCase();
      industry = industry.trim().toLowerCase();
      locations = locations.map(x => x.trim()); // TODO : Must fall in the states array.
      description = description.trim().toLowerCase();

      let ifExists = await companyCollection.findOne({ companyEmail: companyEmail });
      if (!ifExists) throw "Error : No Company Found";

      let updatedData = {
        companyName,
        companyEmail,
        industry, 
        locations,
        numberOfEmployees,
        description,
        jobs: ifExists.jobs,
        imgSrc,
      }

      let getCompanyDetails = await this.getCompanyDataFromEmail(email);

      const updatedInfo = await companyCollection.findOneAndUpdate(

        {companyName: getCompanyDetails.companyName},
        {$set: updatedData},
        {returnDocument: 'after'}

      );

      if (updatedInfo.lastErrorObject.n === 0) {
        throw 'could not update company successfully';
      }

      updatedInfo.value._id = updatedInfo.value._id.toString();
      return updatedInfo.value;

    },

    async getAllJobs (companyName){

      if (!companyName) throw "Error : company name cannot be empty";
      if (!validations.isProperString([companyName])) throw "Error : Company Name must be valid string";

      companyName = companyName.trim();

      let allJobs = await companyCollection.find({ companyName: companyName }, { projection : { jobs: 1 } } ).toArray();
       
      return allJobs;
    },

    async getAllCompanyName() {
      let res = ["others"];
      let companyNmae = await companyCollection
        .find({}, { projection: { companyName: 1 } })
        .toArray();
      if (companyNmae.length === 0) throw "no company in database";
      for (let x of companyNmae) {
        res.push(x.companyName);
      }
      return res.sort();
    },

    async getAllCompanyNameinObject() {
      let companyName = await companyCollection
        .find({}, { projection: { companyName: 1 } })
        .toArray();
      if (companyName.length === 0) throw "no company in database";
      companyName.push({ companyName: "others" });
      return companyName;
    },

    async getAllCompanyJobs() {
      let companyName = await companyCollection
        .find({}, { projection: { jobs: 1 } })
        .toArray();
      if (companyName.length === 0) throw "no company in database";
      companyName.push({ companyName: "others" });
      return companyName;
    },

    async deleteJob (id) {

      if (!id || !ObjectId.isValid(id)) throw "Error: Invalid Id";

      let temp = await this.getJobById(id);
      // console.log(temp);

      let updatedInfo = await companyCollection.updateOne(

        {_id: new ObjectId(temp._id)},
        {$pull: { "jobs": { "_id": new ObjectId(id) }} },
        {returnDocument: 'after'}

      );

      if (!updatedInfo) throw "Error: Cannot delete the listing";
      
      return updatedInfo;
    }


  //   if (typeof location === "string") {
  //     if (!validations.isProperString([location]))
  //       throw "Error : location can only be a valid string or array with valid strings";
  //   } else {
  //     validations.isArrayWithTheNonEmptyStringForLocation([location]);
  //     location = location.map((x) => x.trim().toLowerCase());
  //   }

  //   validations.isSalary(salary);
  //   salary = Number(salary);

  //   let jobData = {
  //     _id: new ObjectId(),
  //     jobTitle: jobTitle.trim().toLowerCase(),
  //     skills: skills,
  //     salary,
  //     location,
  //     description: description.trim().toLowerCase(),
  //   };

  //   let updatedInfo = await companyCollection.findOneAndUpdate(
  //     { "jobs._id": new ObjectId(id) }, // TODO validate id's
  //     { $set: jobData },
  //     { returnDocument: "after" }
  //   );

  //   return updatedInfo;
  // },

  // async getJobById(id) {
  //   if (!id) throw "Error : Invalid Id";
  //   if (!ObjectId.isValid(id)) throw "Error : Invalid Id";

  //   let getJob = await companyCollection.findOne({
  //     "jobs._id": new ObjectId(id),
  //   });
  //   if (!getJob || getJob.length === 0) throw "Error : No Job Found";

  //   return getJob;
  // },

  // async updateCompany(
  //   companyName,
  //   companyEmail,
  //   industry,
  //   locations,
  //   numberOfEmployees,
  //   description,
  //   imgSrc
  // ) {
  //   validations.isNumberOfEmployee(numberOfEmployees);
  //   validations.checkEmail(companyEmail);
  //   numberOfEmployees = Number(numberOfEmployees);

  //   if (!validations.isProperString([companyName, industry, description]))
  //     throw "Error : Parameters can only be string not just string with empty spaces";

  //   validations.isArrayWithTheNonEmptyString([locations]);

  //   companyName = companyName.trim().toLowerCase();
  //   industry = industry.trim().toLowerCase();
  //   locations = locations.map((x) => x.trim()); // TODO : Must fall in the states array.
  //   description = description.trim().toLowerCase();

  //   let ifExists = await companyCollection.findOne({
  //     companyEmail: companyEmail,
  //   });
  //   if (!ifExists) throw "Error : No Company Found";

  //   let updatedData = {
  //     companyName,
  //     companyEmail,
  //     industry,
  //     locations,
  //     numberOfEmployees,
  //     description,
  //     jobs: ifExists.jobs,
  //     imgSrc,
  //   };

  //   const updatedInfo = await companyCollection.findOneAndUpdate(
  //     { companyName: companyName },
  //     { $set: updatedData },
  //     { returnDocument: "after" }
  //   );

  //   if (updatedInfo.lastErrorObject.n === 0) {
  //     throw "could not update company successfully";
  //   }

  //   updatedInfo.value._id = updatedInfo.value._id.toString();
  //   return updatedInfo.value;
  // },

  // async getAllJobs(companyName) {
  //   if (!companyName) throw "Error : company name cannot be empty";
  //   if (!validations.isProperString([companyName]))
  //     throw "Error : Company Name must be valid string";

  //   let allJobs = await companyCollection
  //     .find({ companyName: companyName }, { projection: { jobs: 1 } })
  //     .toArray();

  //   return allJobs;
  // },

  // async getAllCompanyName() {
  //   let res = ["others"];
  //   let companyNmae = await companyCollection
  //     .find({}, { projection: { companyName: 1 } })
  //     .sort({ companyName: 1 })
  //     .toArray();
  //   if (companyNmae.length === 0) throw "no company in database";
  //   for (let x of companyNmae) {
  //     res.push(x.companyName);
  //   }
  //   return res.sort();
  // },
  // async getAllCompanyNameinObject() {
  //   let companyName = await companyCollection
  //     .find({}, { projection: { companyName: 1 } })
  //     .sort({ companyName: 1 })
  //     .toArray();
  //   if (companyName.length === 0) throw "no company in database";
  //   companyName.push({ companyName: "others" });
  //   return companyName;
  // },
};

export default companyFunctions;
