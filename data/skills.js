import { ObjectId } from "mongodb";
import { skills } from "../config/mongoCollections.js";
import validations from "../helpers.js";

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
    const skillsList = await skillsCollection
      .find({ userId: userId })
      .toArray();
    for(let ele of skillsList)
    {
      ele._id = ele._id.toString();
    }
    return skillsList;
  },

  async getSkillsBySkillsId (skillsId)
  {
    const skillsCollection = await skills();
    const skillsRes = await skillsCollection
      .find({ _id: new ObjectId(skillsId) })
      .toArray();
    skillsRes[0]._id = skillsRes[0]._id.toString();
    return skillsRes;
  },

  async createSkills (userId, title, article, videoUrl, tags)
  {
    userId = validations.checkId(userId);
    title = validations.checkString(title, "Title");
    article = validations.checkString(article, "Article");
    videoUrl = validations.checkVideoUrl(videoUrl); // Can allow empty string.
    tags = validations.checkTags(tags);
    const newSkills = {
      userId: userId,
      title: title,
      article: article,
      videoUrl: videoUrl,
      tags: tags,
    };

    const skillsCollection = await skills();
    const newSkillsInfo = await skillsCollection.insertOne(newSkills);
    if(!newSkillsInfo.insertedId) throw `Error: Insert failed!!`;
    const returnSkills = await this.getSkillsBySkillsId(
      newSkillsInfo.insertedId.toString()
    );
    return returnSkills;
  },

  async updateSkills (skillsId, userId, title, article, videoUrl, tags)
  {
    skillsId = validations.checkId(skillsId);
    userId = validations.checkId(userId);
    title = validations.checkString(title, "Title");
    article = validations.checkString(article, "Article");
    videoUrl = validations.checkVideoUrl(videoUrl); // Can allow empty string.
    tags = validations.checkTags(tags); // Can allow empty array

    const updateSkills = {
      title: title,
      article: article,
      videoUrl: videoUrl,
      tags: tags,
    };

    const skillsCollection = await skills();
    const updateInfo = await networkCollection.findOneAndUpdate(
      { _id: new ObjectId(skillsId), userId: userId },
      updateSkills,
      { returnDocument: "after" }
    );
    if(updateInfo.lastErrorObject.n === 0)
      `Error: Update failed, could not find a match skills article with skillsId: ${skillsId} or userId: ${userId}!`;

    const returnValue = await updateInfo.value;
    returnValue._id = returnValue._id.toString();
    returnValue.userId = returnValue.userId.toString();
    return returnValue;
  },

  async removeSkills (skillsId, userId)
  {
    skillsId = validations.checkId(skillsId);
    userId = validations.checkId(userId);
    const skillsCollection = await skills();
    const deletionInfo = await skillsCollection.findOneAndDelete({
      _id: new ObjectId(postId),
      userId: userId,
    });
    if(deletionInfo.lastErrorObject.n === 0)
      throw `Error: Could not delete this article from skills' section since the article does not exist.`;

    return { ...deletionInfo.value, deleted: true };
  },
};

export default exportedMethods;
