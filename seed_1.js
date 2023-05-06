import validations from "./helpers.js"
import * as collection from "./config/mongoCollections.js";
import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import usersData from "./data/user.js";
import networkData from "./data/network.js";

// this file only put the "!!![valid data]!!!" any validate checking should go into seed.js file.
export const pseudoData = async()=>{
    await usersData.createUser("Joeseph", "Marks", 20, "jmarks@ggg.edu", "Test1234$", "Student");
    await usersData.createUser("Pradyumn", "Pundir", 20, "ppd@ggg.edu", "Test1234$", "Student");
    await usersData.createUser("Ruobing", "Liu", 20, "rubinliu@ggg.edu", "Test1234$", "Student");
    await usersData.createUser("Tzu Ming", "Lu", 20, "tlu14@ggg.edu", "Test1234$", "Student");

    
};

