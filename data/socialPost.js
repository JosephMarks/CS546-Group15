import { ObjectId } from "mongodb";
import { users, socialPost } from "../config/mongoCollections.js";
import validation from "../helpers.js";
import userData from "./user.js";
import { create, remove } from "./groups.js";

const exportedMethods = {
  async getAllPosts() {
    const postCollection = await socialPost();
    return await postCollection.find({}).toArray();
  },

  async getPostById(id) {
    id = validation.checkId(id);
    const postCollection = await socialPost();
    const post = await postCollection.findOne({ _id: ObjectId(id) });

    if (!post) throw "Error: Post not found";

    return post;
  },
  async getPostsByTag(tag) {
    tag = validation.checkString(tag, "Tag");
    const postCollection = await socialPost();
    return await postCollection.find({ tags: tag }).toArray();
  },
  async addPost(title, body, posterId, eventdate, fields, company, category) {
    title = validation.checkString(title, "Title");
    body = validation.checkString(body, "Body");
    posterId = validation.checkId(posterId, "Poster ID");
    eventdate = validation.checkString(eventdate, "eventdate");
    if (!Array.isArray(fields)) {
      fields = [];
    } else {
      fields = validation.checkStringArray(fields, "fields");
    }
    if (!Array.isArray(company)) {
      company = [];
    } else {
      company = validation.checkStringArray(company, "company");
    }
    if (!Array.isArray(category)) {
      category = [];
    } else {
      category = validation.checkStringArray(category, "category");
    }
    const userThatPosted = await userData.getUserById(posterId);

    const newPost = {
      title: title,
      body: body,
      poster: {
        id: ObjectId(posterId),
        name: `${userThatPosted.firstName} ${userThatPosted.lastName}`,
      },
      eventdate: eventdate,
      fields: fields,
      category: category,
      company: company,
      likes: [],
    };
    const postCollection = await socialPost();
    const newInsertInformation = await postCollection.insertOne(newPost);
    const newId = newInsertInformation.insertedId;
    return await this.getPostById(newId.toString());
  },
  async removePost(id) {
    id = validation.checkId(id);
    const postCollection = await socialPost();
    const deletionInfo = await postCollection.findOneAndDelete({
      _id: ObjectId(id),
    });
    if (deletionInfo.lastErrorObject.n === 0)
      throw [404, `Could not delete post with id of ${id}`];
    return { ...deletionInfo.value, deleted: true };
  },
  async updatePostPut(id, updatedPost) {
    id = validation.checkId(id);
    updatedPost.title = validation.checkString(updatedPost.title, "title");
    updatedPost.body = validation.checkString(updatedPost.body, "body");
    updatedPost.posterId = validation.checkId(updatedPost.posterId);
    updatedPost.eventdate = validation.checkString(
      updatedPost.eventdate,
      "eventdate"
    );
    if (!Array.isArray(updatedPost.fields)) {
      updatedPost.fields = [];
    } else {
      updatedPost.fields = validation.checkStringArray(
        updatedPost.fields,
        "fields"
      );
    }
    if (!Array.isArray(updatedPost.category)) {
      updatedPost.category = [];
    } else {
      updatedPost.category = validation.checkStringArray(
        updatedPost.category,
        "category"
      );
    }
    if (!Array.isArray(updatedPost.company)) {
      updatedPost.company = [];
    } else {
      updatedPost.company = validation.checkStringArray(
        updatedPost.company,
        "company"
      );
    }
    const userThatPosted = await userData.getUserById(updatedPost.posterId);

    let updatedPostData = {
      title: updatedPost.title,
      body: updatedPost.body,
      eventdate: updatedPost.eventdate,
      poster: {
        id: updatedPost.posterId,
        firstName: userThatPosted.firstName,
        lastName: userThatPosted.lastName,
      },
      fields: updatedPost.fields,
      company: updatedPost.company,
      category: updatedPost.category,
    };
    const postCollection = await socialPost();
    const updateInfo = await postCollection.findOneAndReplace(
      { _id: ObjectId(id) },
      updatedPostData,
      { returnDocument: "after" }
    );
    if (updateInfo.lastErrorObject.n === 0)
      throw [404, `Error: Update failed! Could not update post with id ${id}`];
    return updateInfo.value;
  },
  async updatePostPatch(id, updatedPost) {
    const updatedPostData = {};
    if (updatedPost.posterId) {
      updatedPostData["poster.id"] = validation.checkId(
        updatedPost.posterId,
        "Poster ID"
      );

      const userThatPosted = await userData.getUserById(updatedPost.posterId);
      updatedPostData["poster.firstName"] = userThatPosted.firstName;
      updatedPostData["poster.lastName"] = userThatPosted.lastName;
    }
    if (updatedPost.fields) {
      updatedPostData.fields = validation.checkStringArray(
        updatedPost.fields,
        "fields"
      );
    }
    if (updatedPost.category) {
      updatedPostData.category = validation.checkStringArray(
        updatedPost.category,
        "category"
      );
    }
    if (updatedPost.company) {
      updatedPostData.company = validation.checkStringArray(
        updatedPost.company,
        "company"
      );
    }

    if (updatedPost.title) {
      updatedPostData.title = validation.checkString(
        updatedPost.title,
        "Title"
      );
    }
    if (updatedPost.eventdate) {
      updatedPostData.eventdate = validation.checkString(
        updatedPost.eventdate,
        "eventdate"
      );
    }
    if (updatedPost.body) {
      updatedPostData.body = validation.checkString(updatedPost.body, "Body");
    }
    const postCollection = await socialPost();
    let newPost = await postCollection.findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: updatedPostData },
      { returnDocument: "after" }
    );
    if (newPost.lastErrorObject.n === 0)
      throw [404, `Could not update the post with id ${id}`];

    return newPost.value;
  },
  async renameFieldsTag(oldTag, newTag) {
    oldTag = validation.checkString(oldTag, "Old Tag");
    newTag = validation.checkString(newTag, "New Tag");
    if (oldTag === newTag) throw "fields are the same";
    let findDocuments = {
      fields: oldTag,
    };

    let firstUpdate = {
      $addToSet: { fields: newTag },
    };

    let secondUpdate = {
      $pull: { fields: oldTag },
    };
    const postCollection = await socialPost();
    let updateOne = await postCollection.updateMany(findDocuments, firstUpdate);
    if (updateOne.matchedCount === 0)
      throw [404, `Could not find any posts with old tag: ${oldTag}`];
    let updateTwo = await postCollection.updateMany(
      findDocuments,
      secondUpdate
    );
    if (updateTwo.modifiedCount === 0) throw [500, "Could not update tags"];
    return await this.getPostsByTag(newTag);
  },
  async renameCategoryTag(oldTag, newTag) {
    oldTag = validation.checkString(oldTag, "Old Tag");
    newTag = validation.checkString(newTag, "New Tag");
    if (oldTag === newTag) throw "category are the same";
    let findDocuments = {
      category: oldTag,
    };

    let firstUpdate = {
      $addToSet: { category: newTag },
    };

    let secondUpdate = {
      $pull: { category: oldTag },
    };
    const postCollection = await socialPost();
    let updateOne = await postCollection.updateMany(findDocuments, firstUpdate);
    if (updateOne.matchedCount === 0)
      throw [404, `Could not find any posts with old tag: ${oldTag}`];
    let updateTwo = await postCollection.updateMany(
      findDocuments,
      secondUpdate
    );
    if (updateTwo.modifiedCount === 0) throw [500, "Could not update tags"];
    return await this.getPostsByTag(newTag);
  },
  async renameCompanyTag(oldTag, newTag) {
    oldTag = validation.checkString(oldTag, "Old Tag");
    newTag = validation.checkString(newTag, "New Tag");
    if (oldTag === newTag) throw "company are the same";
    let findDocuments = {
      company: oldTag,
    };

    let firstUpdate = {
      $addToSet: { company: newTag },
    };

    let secondUpdate = {
      $pull: { company: oldTag },
    };
    const postCollection = await socialPost();
    let updateOne = await postCollection.updateMany(findDocuments, firstUpdate);
    if (updateOne.matchedCount === 0)
      throw [404, `Could not find any posts with old tag: ${oldTag}`];
    let updateTwo = await postCollection.updateMany(
      findDocuments,
      secondUpdate
    );
    if (updateTwo.modifiedCount === 0) throw [500, "Could not update tags"];
    return await this.getPostsByTag(newTag);
  },
  //  Likes
  async getLikes(postId) {
    postId = validation.checkId(postId);
    const post = await this.getPostById(postId);
    const likesList = post.likes;
    return likesList;
  },

  async addLikes(postId, userId) {
    postId = validation.checkId(postId);
    userId = validation.checkId(userId);

    //check is there is a duplicates user press like button
    const socialPostCollection = await socialPost();
    let duplicateUser = await socialPostCollection.findOne(
      { likes: userId },
      { projection: { _id: 0 } }
    );
    if (duplicateUser !== null) {
      const userName = (await userData.getUserById(userId)).fname;
      throw `Error: ${userName} can not press likes more than twice!!`;
    }

    let newsocialPosts = await socialPostCollection.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $addToSet: { likes: userId } },
      { returnDocument: "after" }
    );
    const returnValue = newsocialPosts.value;
    returnValue._id = returnValue._id.toString();
    for (let ele of returnValue.comments) {
      ele._id = ele._id.toString();
    }
    return returnValue;
  },

  async removeLikes(postId, userId) {
    postId = validation.checkId(postId);
    userId = validation.checkId(userId);
    const posts = this.getPostById(postId);
    const socialPostCollection = await socialPost();
    const deletionInfo = await socialPostCollection.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $pull: { likes: userId } },
      { new: true },
      { returnDocument: "after" }
    );
    if (deletionInfo.lastErrorObject.n === 0)
      throw `Error: Could not delete post with id of ${commentId}`;
    deletionInfo.value._id = deletionInfo.value._id.toString();

    return deletionInfo.value;
  },
};

export default exportedMethods;
