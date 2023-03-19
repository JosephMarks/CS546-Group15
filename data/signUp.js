import {ObjectId} from 'mongodb';
import {signUp} from '../config/mongoCollections.js';

const userCollection = await signUp();

const signUpFunctions = {

    async create(fname, lname, age, email, password) {
        const finalPush = await userCollection.insertOne({fname, lname, age, email, password, profile:[]})
        return (await userCollection.findOne({_id: finalPush.insertedId}))
    }

}

export default signUpFunctions
