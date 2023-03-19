import {ObjectId} from 'mongodb';
import {members} from '../config/mongoCollections.js';

const userCollection = await signUp();

const signUpFunctions = {

    async create(fname, lname, age, email, password) {
        const finalPush = await userCollection.insertOne({fname, lname, age, email, password})
        return ({_id: finalPush.insertedId.toString(), fname, lname, age, email, password})
    }

}

export default signUpFunctions
