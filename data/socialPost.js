import { ObjectId } from "mongodb";
import { users, socialPost } from "../config/mongoCollections.js";
import validation from "../helpers.js";
import userData from "./user.js";

const exportedMethods = {
  async getAllPosts() {
    const postCollection = await socialPost();
    return await postCollection.find({}).sort({ eventdate: -1 }).toArray();
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
          const postCollection = await socialPost();
          const post = await postCollection.findOne({ _id: new ObjectId(id) });
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
          const postCollection = await socialPost();
          const post = await postCollection.findOne({ _id: new ObjectId(id) });
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
      fields = validation.checkFieldsTags(fields);
    }
    if (!Array.isArray(company)) {
      company = [];
    } else {
      company = await validation.checkCompanyTags(company);
    }
    if (!Array.isArray(category)) {
      category = [];
    } else {
      category = validation.checkCategoryTags(category);
    }
    const postCollection = await socialPost();
    return await postCollection
      .find({
        fields: { $in: fields },
        company: { $in: company },
        category: { $in: category },
      })
      .sort({ eventdate: -1 })
      .toArray();
  },

  async getPostsByFieldsCompanyTag(fields, company) {
    if (!Array.isArray(fields)) {
      fields = [];
    } else {
      fields = validation.checkFieldsTags(fields);
    }
    if (!Array.isArray(company)) {
      company = [];
    } else {
      company = await validation.checkCompanyTags(company);
    }
    const postCollection = await socialPost();
    return await postCollection
      .find({ fields: { $in: fields }, company: { $in: company } })
      .sort({ eventdate: -1 })
      .toArray();
  },

  async getPostsByFieldsCategoryTag(fields, category) {
    if (!Array.isArray(fields)) {
      fields = [];
    } else {
      fields = validation.checkFieldsTags(fields);
    }
    if (!Array.isArray(category)) {
      category = [];
    } else {
      category = validation.checkCategoryTags(category);
    }
    const postCollection = await socialPost();
    return await postCollection
      .find({ fields: { $in: fields }, category: { $in: category } })
      .sort({ eventdate: -1 })
      .toArray();
  },

  async getPostsByCompanyCategoryTag(company, category) {
    if (!Array.isArray(company)) {
      company = [];
    } else {
      company = await validation.checkCompanyTags(company);
    }
    if (!Array.isArray(category)) {
      category = [];
    } else {
      category = validation.checkCategoryTags(category);
    }
    const postCollection = await socialPost();
    return await postCollection
      .find({ company: { $in: company }, category: { $in: category } })
      .sort({ eventdate: -1 })
      .toArray();
  },

  async getPostsByCompanyTag(company) {
    if (!Array.isArray(company)) {
      company = [];
    } else {
      company = await validation.checkCompanyTags(company);
    }
    const postCollection = await socialPost();
    return await postCollection
      .find({ company: { $in: company } })
      .sort({ eventdate: -1 })
      .toArray();
  },

  async getPostsByCategoryTag(category) {
    if (!Array.isArray(category)) {
      category = [];
    } else {
      category = validation.checkCategoryTags(category);
    }
    const postCollection = await socialPost();
    return await postCollection
      .find({ category: { $in: category } })
      .sort({ eventdate: -1 })
      .toArray();
  },

  async getPostsByFieldsTag(fields) {
    if (!Array.isArray(fields)) {
      fields = [];
    } else {
      fields = validation.checkFieldsTags(fields);
    }
    const postCollection = await socialPost();
    return await postCollection
      .find({ fields: { $in: fields } })
      .sort({ eventdate: -1 })
      .toArray();
  },

  async addPost(title, body, posterId, eventdate, fields, company, category) {
    title = validation.checkString(title, "Title");
    body = validation.checkString(body, "Body");
    posterId = validation.checkId(posterId, "Poster ID");
    eventdate = validation.checkDate(eventdate);

    if (!Array.isArray(fields)) {
      fields = [];
    } else {
      fields = validation.checkFieldsTags(fields);
    }
    if (!Array.isArray(company)) {
      company = [];
    } else {
      company = await validation.checkCompanyTags(company);
    }
    if (!Array.isArray(category)) {
      category = [];
    } else {
      category = validation.checkCategoryTags(category);
    }
    const userThatPosted = await userData.getUserById(posterId);
    let postdate = new Date().toUTCString();
    let newPostId = new ObjectId();

    const newPost = {
      _id: newPostId,
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
      link: `/socialmediaposts/post/${posterId}/postId/${newPostId}`,
    };
    const postCollection = await socialPost();
    const newInsertInformation = await postCollection.insertOne(newPost);

    //user post in user database
    let usersCollection = await users();
    let newuserPost = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(posterId) },
      { $push: { socialPost: newPostId.toString() } },
      { returnDocument: "after" }
    );
    if (newuserPost.lastErrorObject.n === 0)
      throw [404, `Could not update the post with id ${id}`];

    return await this.getPostById(newPostId.toString());
  },

  async removePost(id, userId) {
    id = validation.checkId(id);

    const postCollection = await socialPost();
    const deletionInfo = await postCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });

    if (deletionInfo.lastErrorObject.n === 0)
      throw [404, `Could not delete post with id of ${id}`];

    //user posted posts stored in user history
    let usersCollection = await users();

    let newPost = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $pull: { socialPost: id } },
      { returnDocument: "after" }
    );

    if (newPost.lastErrorObject.n === 0)
      throw [404, `Could not delete the poster with id ${id}`];
    return { ...deletionInfo.value, deleted: true };
  },

  async updatePost(id, updatedPost) {
    const updatedPostData = {};
    if (updatedPost.posterId) {
      updatedPostData["poster.id"] = validation.checkId(
        updatedPost.posterId,
        "Poster ID"
      );

      const userThatPosted = await userData.getUserById(updatedPost.posterId);
      updatedPostData["poster.name"] =
        userThatPosted.fname + " " + userThatPosted.lname;
    }
    if (updatedPost.fields) {
      updatedPostData.fields = validation.checkFieldsTags(updatedPost.fields);
    }
    if (updatedPost.category) {
      updatedPostData.category = validation.checkCategoryTags(
        updatedPost.category
      );
    }
    if (updatedPost.company) {
      updatedPostData.company = await validation.checkCompanyTags(
        updatedPost.company
      );
    }

    if (updatedPost.title) {
      updatedPostData.title = validation.checkString(
        updatedPost.title,
        "title"
      );
    }
    if (updatedPost.eventdate) {
      updatedPostData.eventdate = validation.checkDate(updatedPost.eventdate);
    }
    if (updatedPost.body) {
      updatedPostData.body = validation.checkString(updatedPost.body, "Body");
    }
    updatedPostData.modifieddate = new Date().toUTCString();
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
    let newsocialPosts = await socialPostCollection.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $push: { comments: newComments } },
      { returnDocument: "after" }
    );
    const returnValue = newsocialPosts.value;
    returnValue._id = returnValue._id.toString();
    for (let ele of returnValue.comments) {
      ele._id = ele._id.toString();
    }
    return returnValue;
  },

  //  Likes
  async getLikes(postId) {
    postId = validation.checkId(postId);
    const post = await this.getPostById(postId);
    const likesList = post.likes;
    return likesList;
  },
  async checkLikes(postId, userId) {
    postId = validation.checkId(postId);
    userId = validation.checkId(userId);
    const checkDuplicated = await this.getLikes(postId);
    if (!checkDuplicated.includes(userId)) return true;
    else return false;
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
