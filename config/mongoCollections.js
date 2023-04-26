import { dbConnection } from "./mongoConnection.js";

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

// NOTE: YOU WILL NEED TO CHANGE THE CODE BELOW TO HAVE THE COLLECTION(S) REQUIRED BY THE ASSIGNMENT

export const team = getCollectionFn("team");
export const users = getCollectionFn("users");
export const company = getCollectionFn("company");
export const groups = getCollectionFn("groups");
export const network = getCollectionFn("network");
export const skills = getCollectionFn("skills");
export const socialPost = getCollectionFn("socialPost");
export const referral = getCollectionFn("referral");
