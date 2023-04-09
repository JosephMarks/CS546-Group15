import { ObjectId } from "mongodb";
import { users, network } from "../config/mongoCollections.js";
import validations from "../helpers.js";
import usersData from "./user.js";


const exportedMethods = {
  async getAllPost() {
    const networkCollection = await network();
    const postList = await networkCollection.find({}).toArray();
    for (let ele of postList) {
      ele._id = ele._id.toString();
    }
    return postList;
  },

  async getPostByUserId(userId) {
    userId = validations.checkId(userId);
    const networkCollection = await network();
    const userPost = await networkCollection.find({
      userId: new ObjectId(userId),
    });

    if (!userPost) throw "Error: Post not found";
    return userPost;
  },

  async getPostById(postId) {
    postId = validations.checkId(postId);
    const networkCollection = await network();
    const networkPost = await networkCollection.findOne({
      _id: new ObjectId(postId),
    });

    if (!networkPost) throw "Error: Post not found";
    return networkPost;
  },

  async addPost(userId, content) {
    userId = validations.checkId(userId);
    content = validations.checkString(content);
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

  async removePost(postId) {
    postId = validations.checkId(postId);
    const networkCollection = await network();
    const deletionInfo = await networkCollection.findOneAndDelete({
      _id: new ObjectId(postId),
    });
    if (deletionInfo.lastErrorObject.n === 0)
      throw `Error: Could not delete the post since the post does not exist.`;

    return { ...deletionInfo.value, deleted: true };
  },

  async updatePost(postId, content) {
    postId = validations.checkId(postId);
    content = validations.checkString(content, "Content");
    const networkCollection = await network();
    const updateInfo = await networkCollection.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $set: { content: content } },
      { returnDocument: "after" }
    );
    if (updateInfo.lastErrorObject.n === 0)
      throw [
        404,
        `Error: Update failed, could not find a user with id of ${id}`,
      ];

    return await updateInfo.value;
  },

  async getCommentsByUserId(userId) {
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

    if (!userComment) throw "Error: Post not found";
    return userComment;
  },

  async getCommentsByCommentId(commentId) {
    commentId = validations.checkId(commentId);
    const networkCollection = await network();
    const userComment = await networkCollection
      .aggregate([
        { $unwind: "$comments" },
        { $match: { "comments._id": new ObjectId(commentId) } },
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
    return userComment;
  },

  async addComments(postId, userId, comments) {
    postId = validations.checkId(postId);
    userId = validations.checkId(userId);
    comments = validations.checkString(comments, "Comments");

    const newComments = {
      _id: new ObjectId(),
      userId: userId,
      comments,
      comments,
    };

    const networkCollection = await network();
    let newNetworks = await networkCollection.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $addToSet: { comments: newComments } },
      { returnDocument: "after" }
    );
    return newNetworks.value;
  },

  async removeComments() {},

  async updateComments() {},

  async getLikes(postId) {},

  async addLikes(postId, userId) {
    postId = validations.checkId(postId);
    userId = validations.checkId(userId);

    //check is there is a duplicates user press like button
    const networkCollection = await network();
    let duplicateUser = await networkCollection.findOne(
      { likes: userId },
      { projection: { _id: 0 } }
    );
    if (duplicateUser !== null) {
      const userName = (await usersData.getUserById(userId)).fname;
      throw `Error: ${userName} can not press likes more than twice!!`;
    }

    let newNetworks = await networkCollection.findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $addToSet: { likes: userId } },
      { returnDocument: "after" }
    );
    return newNetworks.value;
  },

  async removeLikes(postId, userId) {},

  async addConnections() {}, // follow
    async getAllPost ()
    {
        //  Post
        const networkCollection = await network();
        const postList = await networkCollection.find({}).toArray()
        for(let ele of postList)
        {
            ele._id = ele._id.toString();
        }
        return postList;
    },

    async getPostByUserId (userId)
    {
        userId = validations.checkId(userId)
        const networkCollection = await network();
        const userPost = await networkCollection.find({ userId: new ObjectId(userId) });

        if(!userPost) throw 'Error: Post not found';
        for(let ele of userPost)
        {
            ele._id = ele._id.toString();
        }
        return userPost;
    },

    async getPostById (postId)
    {
        postId = validations.checkId(postId)
        const networkCollection = await network();
        const networkPost = await networkCollection.findOne({ _id: new ObjectId(postId) });

        if(!networkPost) throw 'Error: Post not found';
        networkPost._id = networkPost._id.toString();
        return networkPost;
    },

    async addPost (userId, content)
    {
        userId = validations.checkId(userId);
        content = validations.checkString(content, "post content");
        const newPost = {
            userId: userId,
            content: content,
            comments: [],
            likes: []
        }

        const networkCollection = await network();
        const newInsertInformation = await networkCollection.insertOne(newPost);
        const newId = newInsertInformation.insertedId;
        return await this.getPostById(newId.toString());
    },

    async removePost (postId)
    {
        postId = validations.checkId(postId);
        const networkCollection = await network();
        const deletionInfo = await networkCollection.findOneAndDelete({ _id: new ObjectId(postId) });
        if(deletionInfo.lastErrorObject.n === 0)
            throw `Error: Could not delete the post since the post does not exist.`;

        return { ...deletionInfo.value, deleted: true };
    },

    async updatePost (postId, content)
    {
        postId = validations.checkId(postId);
        content = validations.checkString(content, "Content");
        const networkCollection = await network();
        const updateInfo = await networkCollection.findOneAndUpdate(
            { _id: new ObjectId(postId) },
            { $set: { content: content } },
            { returnDocument: 'after' }
        );
        if(updateInfo.lastErrorObject.n === 0)
            throw [
                404,
                `Error: Update failed, could not find a user with id of ${id}`
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
        const userComment = await networkCollection.aggregate([
            { $unwind: "$comments" },
            { $match: { "comments.userId": userId } },
            {
                $project: {
                    _id: "$comments._id",
                    userId: "$comments.userId",
                    comments: "$comments.comments",
                }
            }
        ]).toArray();

        if(!userComment) throw 'Error: Post not found';
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
        const userComment = await networkCollection.aggregate([
            { $unwind: "$comments" },
            { $match: { "comments._id": new ObjectId(commentId) } },
            {
                $project: {
                    _id: "$comments._id",
                    userId: "$comments.userId",
                    comments: "$comments.comments",
                }
            }
        ]).toArray();
        if(!userComment) throw 'Error: Post not found';
        for(let ele of userComment)
        {
            ele._id = ele._id.toString()
        }
        return userComment;
    },

    async addComments (postId, userId, comments)
    {
        postId = validations.checkId(postId);
        userId = validations.checkId(userId);
        comments = validations.checkString(comments, "Comments");

        const newComments = {
            _id: new ObjectId(),
            userId: userId,
            comments, comments
        }

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
            { returnDocument: 'after' }
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
            { returnDocument: 'after' }
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

    async addLikes (postId, userId)
    {
        postId = validations.checkId(postId);
        userId = validations.checkId(userId);

        //check is there is a duplicates user press like button
        const networkCollection = await network();
        let duplicateUser = await networkCollection.findOne(
            { "likes": userId },
            { projection: { _id: 0 } }
        );
        if(duplicateUser !== null)
        {
            const userName = (await usersData.getUserById(userId)).fname;
            throw `Error: ${userName} can not press likes more than twice!!`;
        }

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
        
    },

    //  Connections
    async addConnections () // follow (need also add connections into user data)
    {

    },

    async removeConnections () // follow (in case this will be used)
    {

    },

}

export default exportedMethods;
