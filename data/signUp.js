import {ObjectId} from 'mongodb';
import {user} from '../config/mongoCollections.js';
import validations from '../helpers.js';
const userCollection = await user();

const signUpFunctions = {

    async create(fname, lname, age, email, password) {

        age = Number(age)

        if (!validations.isProperString([fname, lname, email, password])) throw "Error : FirstName, Last Name, Email, Password can only be string not just string with empty spaces"
        validations.isAge(age)

        const ifAlready = await userCollection.findOne({email: email})
        if (ifAlready) throw "Error: User Email is already registered"

        const finalPush = await userCollection.insertOne({fname, lname, email, password, profile:[{age}]})
        return (await userCollection.findOne({_id: finalPush.insertedId}))
    }

}

export default signUpFunctions