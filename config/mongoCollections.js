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

export const members = getCollectionFn("team");
export const users = getCollectionFn("users");
export const groups = getCollectionFn("groups");
export const network = getCollectionFn("network");
export const skills = getCollectionFn("skills");
