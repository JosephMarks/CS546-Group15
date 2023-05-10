import { ObjectId, Binary } from "mongodb";
import { users } from "../config/mongoCollections.js";
import validations from "../helpers.js";
import bcrypt from "bcryptjs";
import passwordValidator from "password-validator";
// import { userData } from "./index.js";
let rules = new passwordValidator();
rules
  .is()
  .min(8)
  .is()
  .max(100)
  .has()
  .uppercase()
  .has()
  .digits()
  .has()
  .not()
  .spaces()
  .has()
  .symbols();
const exportedMethods = {
  async getAllUser() {
    //get all users data from collectoin
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    for (let ele of userList) {
      ele._id = ele._id.toString();
    }
    return userList;
  },

  async getUserByEmail(email) {
    email = validations.checkEmail(email);
    const userCollection = await users();

    let userDetails = await userCollection.findOne({ email: email });

    if (!userDetails) throw "Error :No user found";
    else return userDetails;
  },

  async getUserById(
    userId // get user from user collection using their id
  ) {
    userId = validations.checkId(userId);
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) throw "Error: user not found!";
    // Convert the Binary image data to base64 format
    if (user.image) {
      user.base64Image = user.image.buffer.toString("base64");
    }
    user._id = user._id.toString();
    return user;
  },

  async createUser(fname, lname, age, email, password, candidateType) {
    //Validations
    fname = validations.validateNameReturn(fname);
    lname = validations.validateNameReturn(lname);
    candidateType = validations.checkString(candidateType, "Candidate Type");
    age = validations.isAge(Number(age));
    const userCollection = await users();

    email = validations.checkEmail(email, "email"); //check email is valid
    if (!rules.validate(password)) throw "Error : Invalid Password";
    password = validations.checkString(password, "Password");
    
    const ifAlready = await userCollection.findOne({ email: email });
    if (ifAlready) throw "Error: User Email is already registered"; //check email is existed in db or not
    


    if (candidateType !== "Student" && candidateType !== "Company")
      throw "Error : Candidate Type can only be Strictly 'Student' or 'Company'";

    password = await bcrypt.hash(password, 10);

    // attributes need, but to be populated later when profile filled out by user
    let gender = "";
    let headerDescription = "";
    let aboutMe = "";
    let locationState = "";
    let image = "";
    let status = "";
    let university = "";
    let collegeMajor = "";
    let gitHubUserName = "";
    let skills = [];
    let experience = 0;
    let jobHistory = [];
    let seekingJob = [];
    let connections = [];
    let group = [];
    let createdAt = new Date().toLocaleDateString("en-GB"); // the first time user's registeration
    let updatedAt = new Date().toLocaleDateString("en-GB"); // update date that user modify their profile
    let likedPost = [];
    let collectedPost = [];
    let socialPost = [];

    if (candidateType === "Student") {
      const newCreateUser = await userCollection.insertOne({
        fname,
        lname,
        email,
        password,
        age: age,
        gender,
        candidateType,
        headerDescription,
        aboutMe,
        locationState,
        image,
        status,
        university,
        collegeMajor,
        gitHubUserName,
        skills,
        experience,
        jobHistory,
        seekingJob,
        connections,
        group,
        createdAt,
        updatedAt,
        socialPost,
        likedPost,
        collectedPost,
      });

      if (!newCreateUser.insertedId) throw `Error: Insert failed!!`;
      const returnUser = await this.getUserById(
        newCreateUser.insertedId.toString()
      );
      returnUser._id = returnUser._id.toString();
      return returnUser;
    } else {
      let referralPosts = [];
      const newCreateUser = await userCollection.insertOne({
        fname,
        lname,
        email,
        password,
        age: age,
        gender,
        candidateType,
        companyName: "",
        referralPosts,
        headerDescription,
        aboutMe,
        locationState,
        image,
        university,
        collegeMajor,
        gitHubUserName,
        skills,
        experience,
        jobHistory,
        seekingJob,
        connections,
        group,
        createdAt,
        updatedAt,
        socialPost,
        likedPost,
        collectedPost,
      });

      if (!newCreateUser.insertedId) throw `Error: Insert failed!!`;
      const returnUser = await this.getUserById(
        newCreateUser.insertedId.toString()
      );
      returnUser._id = returnUser._id.toString();
      return returnUser;
    }
  },
  async updateUsersCompany(
    userId,
    updateData // update user's profile
  ) {
    const userCollection = await users();
    const updateInfo = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { companyName: updateData } },
      { returnDocument: "after" }
    );
    if (updateInfo.lastErrorObject.n === 0)
      throw [
        404,
        `Error: Update failed, could not find a user with id of ${userId}`,
      ];
    updateInfo.value._id = updateInfo.value._id.toString();
    return await updateInfo.value;
  },
  async updateUsers(
    userId,
    updateData // update user's profile
  ) {
    userId = validations.checkId(userId);
    rules.validate(updateData.password);

    let fname = validations.validateNameReturn(updateData.fname);
    let lname = validations.validateNameReturn(updateData.lname);
    let email = validations.checkEmail(updateData.email, "Email");
    let password = validations.checkString(updateData.password, "Password");
    let age = validations.isAge(updateData.age, "age");
    let gender = validations.checkGender(updateData.gender, "Gender");
    let locationState = validations.checkState(
      updateData.locationState,
      "LocationState"
    );

    let headerDescription = validations.checkString(
      updateData.headerDescription,
      "Header Description"
    );
    let aboutMe = validations.checkString(updateData.aboutMe, "AboutMe");
    let image = updateData.image;
    let status = updateData.status;
    let university = validations.checkString(
      updateData.university,
      "University"
    );
    let collegeMajor = validations.checkString(
      updateData.collegeMajor,
      "Major"
    );
    let skills = updateData.skills;

    if (typeof updateData.skills === "string") {
      skills = validations.checkString(skills, "Skills");
    } else {
      skills = validations.checkStringArray(updateData.skills, "Interest area");
    }
    // let skills = validations.checkStringArray(
    //   updateData.skills,
    //   "Interest area"
    // );
    let experience = validations.checkExperience(
      updateData.experience,
      "Experience year"
    ); // experience year from 0 to 80 TO DO - NEED TO UPDATE THIS CHECK - ARRY OF OBJECTS
    let seekingJob = validations.checkStringArray(
      updateData.seekingJob,
      "Seeking job"
    );
    let connections = validations.checkGroupAndConnections(
      updateData.connections,
      "Connections"
    );
    let group = validations.checkGroupAndConnections(updateData.group, "group");
    let createdAt = validations.checkValidDate(
      updateData.createdAt,
      "Created date"
    ); // this cannot be modified
    let updatedAt = validations.checkValidDate(
      updateData.updatedAt,
      "Updated date"
    ); // updated date can be modified

    let gitHubUserName = updateData.gitHubUserName.trim();
    if (typeof gitHubUserName !== "string" || gitHubUserName.length === 0) {
      throw new Error("Github username must be a string that is not empty");
    }
    const userCollection = await users();
    let oldInfo = await this.getUserById(userId);
    let oldLikedPost = oldInfo.likedPost;
    let oldCollectedPost = oldInfo.collectedPost;
    let oldSocialPost = oldInfo.socialPost;
    const userUpdateInfo = {
      fname: fname,
      lname: lname,
      email: email,
      password: password,
      age: age,
      gender: gender,
      headerDescription: headerDescription,
      aboutMe: aboutMe,
      locationState: locationState,
      image: image,
      status: status,
      university: university,
      collegeMajor: collegeMajor,
      gitHubUserName: gitHubUserName,
      skills: skills,
      experience: experience,
      seekingJob: seekingJob,
      connections: connections,
      group: group,
      createdAt: createdAt,
      updatedAt: new Date().toLocaleDateString("en-GB"),
      likedPost: oldLikedPost,
      collectedPost: oldCollectedPost,
      socialPost: oldSocialPost,
    };

    const updateInfo = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: userUpdateInfo },
      { returnDocument: "after" }
    );
    if (updateInfo.lastErrorObject.n === 0)
      throw [
        404,
        `Error: Update failed, could not find a user with id of ${userId}`,
      ];
    updateInfo.value._id = updateInfo.value._id.toString();
    return await updateInfo.value;
  },

  async removeUser(userId) {
    userId = validations.checkId(userId);
    const userCollection = await users();
    const deletionInfo = await userCollection.findOneAndDelete({
      _id: new ObjectId(userId),
    });
    if (deletionInfo.lastErrorObject.n === 0)
      throw [404, `Error: Could not delete user with id of ${id}`];
    deletionInfo.value._id = deletionInfo.value._id.toString();
    return { ...deletionInfo.value, deleted: true };
  },

  async updateUniversity(id, university) {
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
  },

  async updateImage(id, base64Image) {
    id = id.trim();
    const parsedId = new ObjectId(id);
    if (!id || !base64Image) {
      throw new Error("parameters must be provided");
    }
    // checking to make sure id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      throw new Error("This is not a valid object ID");
    }

    // Convert base64Image to Binary
    const bufferImage = Buffer.from(base64Image, "base64");
    const bin = new Binary(bufferImage);

    const updatedProfile = {
      image: bin,
    };
    const userCollection = await users();
    // Need to check to make sure at least one item is being changed in the band update, otherwise will throw
    const foundUser = await userCollection.findOne({ _id: new ObjectId(id) });
    if (foundUser === null) {
      throw new Error("Group has not been found");
    }
    const updatedInfo = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(parsedId) },
      { $set: updatedProfile },
      { returnDocument: "after" }
    );
    if (updatedInfo.lastErrorObject.n === 0) {
      throw new Error("Could not update the band successfully.");
    }
    // TO DO: double check - am I returning the right thing here?
    return await this.getUserById(id);
  },

  async updateName(id, newName) {
    if (!id || !newName) {
      throw new Error("parameters must be provided");
    }
    if (!ObjectId.isValid(id)) {
      throw new Error("This is not a valid object ID");
    }

    const userCollection = await users();
    const foundUser = await userCollection.findOne({ _id: new ObjectId(id) });
    if (foundUser === null) {
      throw new Error("User has not been found");
    }

    const updatedInfo = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name: newName } }
    );

    if (updatedInfo.modifiedCount === 0) {
      throw new Error("Could not update the user's name successfully.");
    }

    return await this.getUserById(id);
  },

  async updateGitHubUserName(id, userName) {
    if (!id || !userName) {
      throw new Error("parameters must be provided");
    }
    if (!ObjectId.isValid(id)) {
      throw new Error("This is not a valid object ID");
    }

    const userCollection = await users();
    const foundUser = await userCollection.findOne({ _id: new ObjectId(id) });
    if (foundUser === null) {
      throw new Error("User has not been found");
    }

    const updatedInfo = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { gitHubUserName: userName } }
    );

    if (updatedInfo.modifiedCount === 0) {
      throw new Error("Could not update the user's name successfully.");
    }

    return await this.getUserById(id);
  },
  async getUserFullNameById(userId) {
    userId = validations.checkId(userId);
    const userCollection = await users();
    const objectId = new ObjectId(userId);
    const query = { _id: objectId };
    const options = { projection: { fname: 1, lname: 1 } };
    const user = await userCollection.findOne(query, options);

    if (!user) throw `Error: No user found with the given id: ${userId}`;

    return { firstName: user.fname, lastName: user.lname };
  },

  async getUserSkills(id) {
    if (!id || !ObjectId.isValid(id)) {
      throw "Error : Invalid Id";
    }

    const userCollection = await users();
    let getUserSkills = await userCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { skills: 1 } }
    );
    if (!getUserSkills) throw "Error : Users interest area is empty";

    return getUserSkills;
  },
};

export default exportedMethods;
