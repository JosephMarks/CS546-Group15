import {ObjectId} from 'mongodb';
import {user} from '../config/mongoCollections.js';
import validations from '../helpers.js';
import bcrypt from 'bcrypt'

const userCollection = await user();

const logInFunctions = {

    async logIn(email, password) {

        if (!validations.isProperString([email, password])) throw "Error : Email and Password can only be string not just string with empty spaces"

        const ifAlready = await userCollection.findOne({email: email}, {projection: {email: 1, password: 1}})
        if (!ifAlready) throw "Error: User Email is not registered"

        if (!await (bcrypt.compare(password, ifAlready.password))) throw "Error : Wrong Password"

    }

}

export default logInFunctions