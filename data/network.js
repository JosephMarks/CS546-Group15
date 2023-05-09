import { ObjectId } from "mongodb";
import { users, network } from "../config/mongoCollections.js";
import validations from "../helpers.js";
import usersData from "./user.js";
import { check } from "link-check/lib/proto/hash.js";

const exportedMethods = {
  async getAllPost ()
  {
    const networkCollection = await network();
    const postList = await networkCollection.find({}).toArray();
    for(let ele of postList)
    {
      ele._id = ele._id.toString();
    }
    return postList;
  },

  async getPostByUserId (userId)
  {
    userId = validations.checkId(userId);
    const networkCollection = await network();
    const userPost = await networkCollection.find({ userId: userId }).toArray();

    if(!userPost) throw "Error: Post not found";
    for(let ele of userPost)
    {
      ele._id = ele._id.toString();
    }
    return userPost;
  },

  async getPostById (postId)
  {
    postId = validations.checkId(postId);
    const networkCollection = await network();
    const networkPost = await networkCollection.findOne({
      _id: new ObjectId(postId),
    });

    if(!networkPost) throw "Error: Post not found";
    networkPost._id = networkPost._id.toString();
    return networkPost;
  },

  async getPostByConnections (userId)
  {
    userId = validations.checkId(userId);
    const connections = await this.getConnections(userId);
    const followerPost = []
    for(let ele of connections)
    {
      let elePost = await this.getPostByUserId(ele)
      followerPost.push(...elePost);
    }
    return followerPost;
  },

  async addPost (userId, content)
  {
    userId = validations.checkId(userId);
    content = validations.checkPost(content, "post content");
    const newPost = {
      userId: userId,
      content: content,
      comments: [],
      likes: [],
    };

    const networkCollection = await network();
    const newInsertInformation = await networkCollection.insertOne(newPost);
    const newId = newInsertInformation.insertedId;
    return await this.getPostById(newId.toString());
  },

  async removePost (postId)
  {
    postId = validations.checkId(postId);
    const networkCollection = await network();
    const deletionInfo = await networkCollection.findOneAndDelete({
      _id: new ObjectId(postId),
    });
    if(deletionInfo.lastErrorObject.n === 0)
      throw `Error: Could not delete the post since the post does not exist.`;

    return { ...deletionInfo.value, deleted: true };
  },

  async updatePost (postId, content)
  {
    postId = validations.checkId(postId);
    content = validations.checkPost(content, "Content");
    const networkCollection = await network();
    const updateInfo = await networkCollection.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $set: { content: content } },
      { returnDocument: "after" }
    );
    if(updateInfo.lastErrorObject.n === 0)
      throw [
        404,
        `Error: Update failed, could not find a user with id of ${id}`,
      ];
    const returnValue = await updateInfo.value;
    returnValue._id = returnValue._id.toString();
    for(let ele of returnValue.comments)
    {
      ele._id = ele._id.toString();
    }
    return returnValue;
  },

  //  Comments
  async getCommentsByUserId (userId)
  {
    userId = validations.checkId(userId);
    const networkCollection = await network();
    const userComment = await networkCollection
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

    if(!userComment) throw "Error: Post not found";
    for(let ele of userComment)
    {
      ele._id = ele._id.toString();
    }
    return userComment;
  },

  async getCommentsByCommentId (commentId)
  {
    commentId = validations.checkId(commentId);
    const networkCollection = await network();
    const userComment = await networkCollection
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
    if(!userComment) throw "Error: Post not found";
    for(let ele of userComment)
    {
      ele._id = ele._id.toString();
    }
    return userComment;
  },

  async addComments (postId, userId, comments)
  {
    postId = validations.checkId(postId);
    userId = validations.checkId(userId);
    comments = validations.checkPost(comments, "Comments");
    const userName = await usersData.getUserById(userId);

    const newComments = {
      _id: new ObjectId(),
      userId: userId,
      fname: userName.fname,
      lname: userName.lname,
      comments,
    };

    const networkCollection = await network();
    let newNetworks = await networkCollection.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $addToSet: { comments: newComments } },
      { returnDocument: "after" }
    );
    const returnValue = newNetworks.value;
    returnValue._id = returnValue._id.toString();
    for(let ele of returnValue.comments)
    {
      ele._id = ele._id.toString();
    }
    return returnValue;
  },

  async removeComments (commentId)
  {
    commentId = validations.checkId(commentId);
    const comments = this.getCommentsByCommentId(commentId);
    const networkCollection = await network();
    const deletionInfo = await networkCollection.findOneAndUpdate(
      { "comments._id": new ObjectId(commentId) },
      { $pull: { comments: { _id: new ObjectId(commentId) } } },
      { new: true },
      { returnDocument: "after" }
    );
    if(deletionInfo.lastErrorObject.n === 0)
      throw `Error: Could not delete post with id of ${commentId}`;
    const postId = deletionInfo.value._id.toString();

    return comments;
  },

  async updateComments (commentId, content)
  {
    commentId = validations.checkId(commentId);
    content = validations.checkString(content, "Content");
    const comments = this.getCommentsByCommentId(commentId);
    const networkCollection = await network();
    const updateInfo = await networkCollection.findOneAndUpdate(
      { "comments._id": new ObjectId(commentId) },
      { $set: { "comments.$.comments": content } },
      { returnDocument: "after" }
    );
    if(updateInfo.lastErrorObject.n === 0)
      throw `Error: Update failed! Could not update post with id ${commentId}`;

    return updateInfo.value;
  },

  //  Likes
  async getLikes (postId)
  {
    postId = validations.checkId(postId);
    const post = await this.getPostById(postId);
    const likesList = post.likes;
    return likesList;
  },

  async checkLikes (postId, userId)
  {
    postId = validations.checkId(postId);
    userId = validations.checkId(userId);
    const checkDuplicated = await this.getLikes(postId);
    console.log(checkDuplicated);
    if(!checkDuplicated.includes(userId)) return true;
    else return false;
  },

  async addLikes (postId, userId)
  {
    postId = validations.checkId(postId);
    userId = validations.checkId(userId);
    const networkCollection = await network();
    let newNetworks = await networkCollection.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $addToSet: { likes: userId } },
      { returnDocument: "after" }
    );
    const returnValue = newNetworks.value;
    returnValue._id = returnValue._id.toString();
    for(let ele of returnValue.comments)
    {
      ele._id = ele._id.toString();
    }
    return returnValue;
  },

  async removeLikes (postId, userId)
  {
    postId = validations.checkId(postId);
    userId = validations.checkId(userId);
    const posts = this.getPostById(postId);
    const networkCollection = await network();
    const deletionInfo = await networkCollection.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $pull: { likes: userId } },
      { new: true },
      { returnDocument: "after" }
    );
    if(deletionInfo.lastErrorObject.n === 0)
      throw `Error: Could not delete post with id of ${commentId}`;
    deletionInfo.value._id = deletionInfo.value._id.toString();

    return deletionInfo.value;
  },

  //  Connection
  async getConnections (userId)
  {
    userId = validations.checkId(userId);
    const userCollection = await users();
    const connections = (await userCollection.findOne({ _id: new ObjectId(userId) })).connections
    return connections
  },

  async addConnections (
    userId,
    followerId // follow (need also add connections into user data)
  )
  {
    userId = validations.checkId(userId);
    followerId = validations.checkId(followerId);
    const networkCollection = await network();
    const userCollection = await users();
    //check is there is a duplicates user press like button

    let duplicateFollower = await userCollection.findOne({
      _id: new ObjectId(userId),
      connections: { $elemMatch: { $in: [followerId] } },
    });

    if(duplicateFollower !== null)
    {
      const userName = (await usersData.getUserById(userId)).fname;
      throw `Error: ${userName} has already follow this user!!`;
    }

    let userConnections = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $addToSet: { connections: followerId } },
      { returnDocument: "after" }
    );
    return userConnections.value;
  },

  async removeConnections (
    userId,
    followerId // follow (in case this will be used)
  )
  {
    followerId = validations.checkId(followerId);
    userId = validations.checkId(userId);
    const userCollection = await users();

    let existFollower = await userCollection.findOne({
      _id: new ObjectId(userId),
      connections: { $elemMatch: { $in: [followerId] } },
    });

    if(existFollower === null)
    {
      throw `Error: The user doesn't follow this user or the user doesn't exist!!`;
    }

    const deletionInfo = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $pull: { connections: followerId } },
      { new: true },
      { returnDocument: "after" }
    );
    if(deletionInfo.lastErrorObject.n === 0)
      throw `Error: Could not find the user with id of ${userId}`;
    deletionInfo.value._id = deletionInfo.value._id.toString();

    return deletionInfo.value;
  },
};

export default exportedMethods;
