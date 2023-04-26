import { ObjectId } from "mongodb";
import { users, socialPost } from "../config/mongoCollections.js";
import validation from "../helpers.js";
import userData from "./user.js";

const exportedMethods = {
  async getAllPosts() {
    const postCollection = await socialPost();
    return await postCollection.find({}).toArray();
  },

  async getPostById(id) {
    id = validation.checkId(id);
    const postCollection = await socialPost();
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

  async getPostsByAllTag(fields, company, category) {
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
    const postCollection = await socialPost();
    return await postCollection
      .find({
        fields: { $in: fields },
        company: { $in: company },
        category: { $in: category },
      })
      .toArray();
  },

  async getPostsByFieldsCompanyTag(fields, company) {
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
    const postCollection = await socialPost();
    return await postCollection
      .find({ fields: { $in: fields }, company: { $in: company } })
      .toArray();
  },

  async getPostsByFieldsCategoryTag(fields, category) {
    if (!Array.isArray(fields)) {
      fields = [];
    } else {
      fields = validation.checkStringArray(fields, "fields");
    }
    if (!Array.isArray(category)) {
      category = [];
    } else {
      category = validation.checkStringArray(category, "category");
    }
    const postCollection = await socialPost();
    return await postCollection
      .find({ fields: { $in: fields }, category: { $in: category } })
      .toArray();
  },

  async getPostsByCompanyCategoryTag(company, category) {
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
    const postCollection = await socialPost();
    return await postCollection
      .find({ company: { $in: company }, category: { $in: category } })
      .toArray();
  },

  async getPostsByCompanyTag(company) {
    if (!Array.isArray(company)) {
      company = [];
    } else {
      company = validation.checkStringArray(company, "company");
    }
    const postCollection = await socialPost();
    return await postCollection.find({ company: { $in: company } }).toArray();
  },

  async getPostsByCategoryTag(category) {
    if (!Array.isArray(category)) {
      category = [];
    } else {
      category = validation.checkStringArray(category, "category");
    }
    const postCollection = await socialPost();
    return await postCollection.find({ category: { $in: category } }).toArray();
  },

  async getPostsByFieldsTag(fields) {
    if (!Array.isArray(fields)) {
      fields = [];
    } else {
      fields = validation.checkStringArray(fields, "fields");
    }
    const postCollection = await socialPost();
    return await postCollection.find({ fields: { $in: fields } }).toArray();
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
    let postdate = new Date().toUTCString();
    const newPost = {
      title: title,
      body: body,
      poster: {
        id: new ObjectId(posterId),
        name: `${userThatPosted.fname} ${userThatPosted.lname}`,
      },
      eventdate: eventdate,
      fields: fields,
      category: category,
      company: company,
      likes: [],
      comments: [],
      postdate: postdate,
    };
    const postCollection = await socialPost();
    const newInsertInformation = await postCollection.insertOne(newPost);
    const newId = newInsertInformation.insertedId;

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
    const postCollection = await socialPost();
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
      { _id: new ObjectId(id) },
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
      updatedPostData["poster.firstName"] = userThatPosted.fname;
      updatedPostData["poster.lastName"] = userThatPosted.lname;
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
      { _id: new ObjectId(id) },
      { $set: updatedPostData },
      { returnDocument: "after" }
    );
    if (newPost.lastErrorObject.n === 0)
      throw [404, `Could not update the post with id ${id}`];

    return newPost.value;
  },

  //  Comments
  async getCommentsByUserId(userId) {
    userId = validation.checkId(userId);
    const socialPostCollection = await socialPost();
    const userComment = await socialPostCollection
      .aggregate([
        { $unwind: "$comments" },
        { $match: { "comments.userId": new ObjectId(userId) } },
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
    const socialPostCollection = await socialPost();
    const userComment = await socialPostCollection
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

    const socialPostCollection = await socialPost();
    let newsocialPosts = await networkCollection.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $addToSet: { comments: newComments } },
      { returnDocument: "after" }
    );
    const returnValue = newsocialPosts.value;
    returnValue._id = returnValue._id.toString();
    for (let ele of returnValue.comments) {
      ele._id = ele._id.toString();
    }
    return returnValue;
  },

  async removeComments(commentId) {
    commentId = validation.checkId(commentId);
    const comments = this.getCommentsByCommentId(commentId);
    const socialPostCollection = await socialPost();
    const deletionInfo = await socialPostCollection.findOneAndUpdate(
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
    const socialPostCollection = await socialPost();
    const updateInfo = await socialPostCollection.findOneAndUpdate(
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
    const socialPostCollection = await socialPost();
    let duplicateUser = await socialPostCollection.findOne(
      { _id: new ObjectId(postId), likes: { $in: [new ObjectId(userId)] } },
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
    console.log(returnValue.likes);
    if (returnValue.comments.length > 0) {
      for (let ele of returnValue.comments) {
        ele._id = ele._id.toString();
      }
    }

    //user liked posts stored in user history
    let usersCollection = await users();

    let newPost = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $addToSet: { likedPost: postId } },
      { returnDocument: "after" }
    );
    if (newPost.lastErrorObject.n === 0)
      throw [404, `Could not update the post with id ${postId}`];
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
