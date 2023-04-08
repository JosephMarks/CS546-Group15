import { ObjectId } from "mongodb";
import { users, network } from "../config/mongoCollections.js";
import validations from "../helpers.js";
import usersData from "./user.js"

const userCollection = await users();

const exportedMethods = {
    async getAllPost ()
    {
        const networkCollection = await network();
        return await networkCollection.find({}).toArray();
    },

    async getPostByUserId (userId)
    {
        userId = validations.checkId(userId)
        const networkCollection = await network();
        const userPost = await networkCollection.find({ userId: new ObjectId(userId) });

        if(!userPost) throw 'Error: Post not found';
        return userPost;
    },

    async getPostById (postId)
    {
        postId = validations.checkId(postId)
        const networkCollection = await network();
        const networkPost = await networkCollection.findOne({ _id: new ObjectId(postId) });

        if(!networkPost) throw 'Error: Post not found';
        return networkPost;
    },

    async addPost (userId, content)
    {
        userId = validations.checkId(userId);
        content = validations.checkString(content);
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

        return await updateInfo.value;
    },

    async getComments (postId)
    {

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
        return newNetworks.value
    },

    async removeComments ()
    {

    },

    async updateComments ()
    {

    },

    async getLikes (postId)
    {

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
        return newNetworks.value
    },

    async removeLikes (postId, userId)
    {

    },

    async addConnections () // follow
    {

    },

}
export default exportedMethods;
