import { ObjectId } from "mongodb";
import { users, referral, company } from "../config/mongoCollections.js";
import validation from "../helpers.js";
import userData from "./user.js";

const exportedMethods = {
  async getAllPosts() {
    const postCollection = await referral();
    return await postCollection.find({}).toArray();
  },

  async getPostById(id) {
    id = validation.checkId(id);
    const postCollection = await referral();
    const post = await postCollection.findOne({ _id: new ObjectId(id) });

    if (!post) throw "Error: Post not found";

    return post;
  },
  async getLikedPostByUserId(userId) {
    let usersCollection = await users();

    let user = await userData.getUserById(userId);
    let arr = user.likedPost;
    let res = [];
    if (!Array.isArray(arr)) {
      arr = [];
    } else {
      if (arr.length > 0) {
        arr = validation.checkArrofId(arr, "Array of post Id");

        for (let id of arr) {
          let post = await this.getPostById(id);
          if (!post) {
            let newPost = await usersCollection.findOneAndUpdate(
              { _id: new ObjectId(userId) },
              { $pull: { likedPost: id } },
              { returnDocument: "after" }
            );
            if (newPost.lastErrorObject.n === 0)
              throw [404, `Could not delete the post with id ${id}`];
            continue;
          }
          res.push(post);
        }
      }
    }

    return res;
  },

  async getPostedPostByUserId(userId) {
    let usersCollection = await users();
    let user = await userData.getUserById(userId);
    let arr = user.socialPost;
    let res = [];
    if (!Array.isArray(arr)) {
      arr = [];
    } else {
      if (arr.length > 0) {
        arr = validation.checkArrofId(arr, "Array of post Id");

        for (let id of arr) {
          let post = await this.getPostById(id);
          if (!post) {
            let newPost = await usersCollection.findOneAndUpdate(
              { _id: new ObjectId(userId) },
              { $pull: { socialPost: id } },
              { returnDocument: "after" }
            );
            if (newPost.lastErrorObject.n === 0)
              throw [404, `Could not delete the post with id ${id}`];
            continue;
          }
          res.push(post);
        }
      }
    }
    return res;
  },

  async getPostsByAllTag(fields, companyName) {
    if (!Array.isArray(fields)) {
      fields = [];
    } else {
      fields = validation.checkStringArray2(fields, "fields");
    }
    if (!Array.isArray(companyName)) {
      companyName = [];
    } else {
      companyName = validation.checkStringArray2(companyName, "company");
    }

    const postCollection = await referral();
    return await postCollection
      .find({
        fields: { $in: fields },
        company: { $in: companyName },
      })
      .toArray();
  },

  async getPostsByCompanyTag(companyName) {
    if (!Array.isArray(company)) {
      companyName = [];
    } else {
      companyName = validation.checkStringArray2(companyName, "company");
    }
    const postCollection = await referral();
    return await postCollection
      .find({ company: { $in: companyName } })
      .toArray();
  },

  async getPostsByFieldsTag(fields) {
    if (!Array.isArray(fields)) {
      fields = [];
    } else {
      fields = validation.checkStringArray2(fields, "fields");
    }
    const postCollection = await referral();
    return await postCollection.find({ fields: { $in: fields } }).toArray();
  },

  async addPost(
    title,
    body,
    posterId,
    duedate,
    fields,
    companyName,
    jobTitle,
    jobDes,
    jobFields
  ) {
    title = validation.checkString(title, "Title");
    body = validation.checkString(body, "Body");
    posterId = validation.checkId(posterId, "Poster ID");
    duedate = validation.checkString(duedate, "duedate");
    jobTitle = validation.checkString(jobTitle, "jobTitle");
    jobDes = validation.checkString(jobDes, "jobDes");
    companyName = validation.checkString(companyName, "company");
    if (!Array.isArray(fields)) {
      fields = [];
    } else {
      fields = validation.checkStringArray2(fields, "fields");
    }

    if (!Array.isArray(jobFields)) {
      jobFields = [];
    } else {
      jobFields = validation.checkStringArray2(jobFields, "jobFields");
    }

    const userThatPosted = await userData.getUserById(posterId);
    let postdate = new Date().toUTCString();
    const newPost = {
      title: title,
      body: body,
      poster: {
        id: new ObjectId(posterId),
        name: `${userThatPosted.fname} ${userThatPosted.lname}`,
      },
      duedate: duedate,
      fields: fields,
      company: companyName,
      jobs: { jobTitle: jobTitle, jobDes: jobDes, jobFields: jobFields },
      likes: [],
      comments: [],
      postdate: postdate,
    };
    const postCollection = await referral();
    const newInsertInformation = await postCollection.insertOne(newPost);
    const newId = newInsertInformation.insertedId;

    //job in company database
    let companyCollection = await company();
    let newJobInser = await companyCollection.findOneAndUpdate(
      { companyName: companyName },
      { $addToSet: { jobs: newPost.jobs } },
      { returnDocument: "after" }
    );
    if (newJobInser.lastErrorObject.n === 0)
      throw [404, `Could not update the post with id ${id}`];

    //user post in user database
    let usersCollection = await users();
    let newuserPost = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(posterId) },
      { $addToSet: { socialPost: newId.toString() } },
      { returnDocument: "after" }
    );
    if (newuserPost.lastErrorObject.n === 0)
      throw [404, `Could not update the post with id ${id}`];

    return await this.getPostById(newId.toString());
  },

  async removePost(id, userId) {
    id = validation.checkId(id);
    let oldinfo = await this.getPostById(id);
    const postCollection = await referral();
    const deletionInfo = await postCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });
    if (deletionInfo.lastErrorObject.n === 0)
      throw [404, `Could not delete post with id of ${id}`];

    //user liked posts stored in user history
    let usersCollection = await users();
    let newPost = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $pull: { socialPost: id } },
      { returnDocument: "after" }
    );
    if (newPost.lastErrorObject.n === 0)
      throw [404, `Could not delete the post with id ${id}`];

    //job in company database
    const companyCollection = await company();
    let companyName = oldinfo.company;
    let job = oldinfo.jobs;
    console.log(job);
    let newJobInser = await companyCollection.findOneAndUpdate(
      { companyName: companyName },
      { $pull: { jobs: job } },
      { returnDocument: "after" }
    );
    if (newJobInser.lastErrorObject.n === 0)
      throw [404, `Could not update the post with id ${id}`];

    return { ...deletionInfo.value, deleted: true };
  },

  //  Comments
  async getCommentsByUserId(userId) {
    userId = validation.checkId(userId);
    const referralCollection = await referral();
    const userComment = await referralCollection
      .aggregate([
        { $unwind: "$comments" },
        { $match: { "comments.userId": userId } },
        {
          $project: {
            _id: "$comments._id",
            userId: "$comments.userId",
            comments: "$comments.comments",
          },
        },
      ])
      .toArray();

    if (!userComment) throw "Error: Post not found";
    for (let ele of userComment) {
      ele._id = ele._id.toString();
    }
    return userComment;
  },

  async getCommentsByCommentId(commentId) {
    commentId = validation.checkId(commentId);
    const referralCollection = await referral();
    const userComment = await referralCollection
      .aggregate([
        { $unwind: "$comments" },
        { $match: { "comments._id": new ObjectId(commentId) } },
        {
          $project: {
            _id: "$comments._id",
            fname: "$comments.fname",
            lname: "$comments.lname",
            comments: "$comments.comments",
          },
        },
      ])
      .toArray();
    if (!userComment) throw "Error: Post not found";
    for (let ele of userComment) {
      ele._id = ele._id.toString();
    }
    return userComment;
  },

  async addComments(postId, userId, comments) {
    postId = validation.checkId(postId);
    userId = validation.checkId(userId);
    comments = validation.checkString(comments, "Comments");
    const userName = await userData.getUserById(userId);

    const newComments = {
      _id: new ObjectId(),
      userId: userId,
      fname: userName.fname,
      lname: userName.lname,
      comments,
    };

    const referralCollection = await referral();
    let newreferrals = await referralCollection.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $addToSet: { comments: newComments } },
      { returnDocument: "after" }
    );
    const returnValue = newreferrals.value;
    returnValue._id = returnValue._id.toString();
    for (let ele of returnValue.comments) {
      ele._id = ele._id.toString();
    }
    return returnValue;
  },

  async removeComments(commentId) {
    commentId = validation.checkId(commentId);
    const comments = this.getCommentsByCommentId(commentId);
    const referralCollection = await referral();
    const deletionInfo = await referralCollection.findOneAndUpdate(
      { "comments._id": new ObjectId(commentId) },
      { $pull: { comments: { _id: new ObjectId(commentId) } } },
      { new: true },
      { returnDocument: "after" }
    );
    if (deletionInfo.lastErrorObject.n === 0)
      throw `Error: Could not delete post with id of ${commentId}`;
    const postId = deletionInfo.value._id.toString();

    return comments;
  },

  async updateComments(commentId, content) {
    commentId = validation.checkId(commentId);
    content = validation.checkString(content, "Content");
    const comments = this.getCommentsByCommentId(commentId);
    const referralCollection = await referral();
    const updateInfo = await referralCollection.findOneAndUpdate(
      { "comments._id": new ObjectId(commentId) },
      { $set: { "comments.$.comments": content } },
      { returnDocument: "after" }
    );
    if (updateInfo.lastErrorObject.n === 0)
      throw `Error: Update failed! Could not update post with id ${commentId}`;

    return updateInfo.value;
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
    const referralCollection = await referral();
    let duplicateUser = await referralCollection.findOne(
      { _id: new ObjectId(postId), likes: { $in: [userId] } },
      { projection: { _id: 0 } }
    );
    if (duplicateUser !== null) {
      const userName = (await userData.getUserById(userId)).fname;
      throw `Error: ${userName} can not press likes more than twice!!`;
    }

    let newreferrals = await referralCollection.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $addToSet: { likes: userId } },
      { returnDocument: "after" }
    );
    //user liked posts stored in user history
    let usersCollection = await users();

    let newPost = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $addToSet: { likedPost: postId } },
      { returnDocument: "after" }
    );
    if (newPost.lastErrorObject.n === 0)
      throw [404, `Could not update the post with id ${postId}`];

    const returnValue = newreferrals.value;
    returnValue._id = returnValue._id.toString();
    console.log(returnValue.likes);
    if (returnValue.comments.length > 0) {
      for (let ele of returnValue.comments) {
        ele._id = ele._id.toString();
      }
    }
    return returnValue;
  },

  async removeLikes(postId, userId) {
    postId = validation.checkId(postId);
    userId = validation.checkId(userId);
    const posts = this.getPostById(postId);
    const referralPostCollection = await referral();
    const deletionInfo = await referralPostCollection.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $pull: { likes: userId } },
      { new: true },
      { returnDocument: "after" }
    );
    if (deletionInfo.lastErrorObject.n === 0)
      throw `Error: Could not delete post with id of ${postId}`;
    //user liked posts stored in user history
    let usersCollection = await users();
    let newPost = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $pull: { likedPost: postId } },
      { returnDocument: "after" }
    );
    if (newPost.lastErrorObject.n === 0)
      throw [404, `Could not delete the post with id ${postId}`];

    deletionInfo.value._id = deletionInfo.value._id.toString();

    return deletionInfo.value;
  },
};
export default exportedMethods;
