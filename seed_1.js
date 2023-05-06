import validations from "./helpers.js"
import * as collection from "./config/mongoCollections.js";
import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import usersData from "./data/user.js";
import networkData from "./data/network.js";

// this file only put the "!!![valid data]!!!" any validate checking should go into seed.js file.
export const pseudoData = async () =>
{
    const joe = await usersData.createUser("Joeseph", "Marks", 20, "jmarks@ggg.edu", "Test1234$", "Student");
    const pundir = await usersData.createUser("Pradyumn", "Pundir", 20, "ppd@ggg.edu", "Test1234$", "Student");
    const ruobing = await usersData.createUser("Ruobing", "Liu", 20, "rubinliu@ggg.edu", "Test1234$", "Student");
    const ming = await usersData.createUser("Tzu Ming", "Lu", 20, "tlu14@ggg.edu", "Test1234$", "Student");

    const mingPost = await networkData.addPost(ming._id, "This is Tzu Ming's first content.");
    await networkData.addComments(mingPost._id, joe._id, "Congrats to finsih this semester");
    await networkData.addComments(mingPost._id, pundir._id, "Yes, team work makes dream work.");
    await networkData.addComments(mingPost._id, ruobing._id, "Hope we all can get good grades.");
    await networkData.addConnections(ming._id, joe._id);
};

