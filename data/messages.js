import { MongoUnexpectedServerResponseError, ObjectId, Binary } from "mongodb";
import { messages, users } from "../config/mongoCollections.js";

export const create = async (
  originUserId,
  targetUserId,
  message,
  senderFullName
) => {
  if (!originUserId || !targetUserId || !message) {
    throw new Error("Please ensure amounts have been populated");
  }

  if (!ObjectId.isValid(originUserId)) {
    throw new Error("Sender is not a valid object ID");
  }
  if (!ObjectId.isValid(targetUserId)) {
    throw new Error("Recipient is not a valid object ID");
  }
  if (typeof message !== "string") {
    throw new Error("Message must be of type string");
  }

  const userCollection = await users();
  const originUser = await userCollection.findOne({
    _id: new ObjectId(originUserId),
  });
  if (originUser === null) {
    throw new Error("Origin user id does not exist");
  }

  const targetUser = await userCollection.findOne({
    _id: new ObjectId(targetUserId),
  });
  if (targetUser === null) {
    throw new Error("Target user id does not exist");
  }
  let createdAt = Date.now();
  let newMessage = {
    originUserId: new ObjectId(originUserId),
    targetUserId: new ObjectId(targetUserId),
    message: message,
    createdAt: createdAt,
    senderFullName: senderFullName,
  };

  const messageCollection = await messages();
  const insertedMessage = await messageCollection.insertOne(newMessage);
  if (!insertedMessage.acknowledged || !insertedMessage.insertedId) {
    throw new Error("This message was not successfully added");
  }

  const newId = insertedMessage.insertedId.toString();
  const foundMessage = await get(newId);
  return foundMessage;
};

export const get = async (id) => {
  // Error Testing Section
  // if no id is provided, the method should throw
  if (!id) {
    throw new Error("the id parameter does not exist");
  }
  // if the id provided is not a string, or is an empty string, the method should throw
  if (typeof id !== "string" || id.trim().length === 0) {
    throw new Error("id input is not of type string or is an empty string");
  }
  // if the id provided is not a valid ObjectId, the method should throw
  id = id.trim();
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid object id");
  }
  const messageCollection = await messages();
  const message = await messageCollection.findOne({ _id: new ObjectId(id) });
  if (message === null) {
    throw new Error("There is message with that id");
  }
  message._id = message._id.toString();
  return message;
};

export const getAll = async (originUserId) => {
  if (!originUserId) {
    throw new Error("Must provide an id");
  }
  // if the id provided is not a string, or is an empty string, the method should throw
  if (typeof originUserId !== "string" || originUserId.trim().length === 0) {
    throw new Error("id input is not of type string or is an empty string");
  }
  // if the id provided is not a valid ObjectId, the method should throw
  originUserId = originUserId.trim();
  if (!ObjectId.isValid(originUserId)) {
    throw new Error("Invalid object id");
  }
  const messageCollection = await messages();
  const allMessages = await messageCollection
    .find({ originUserId: new ObjectId(originUserId) })
    .toArray();

  if (allMessages === null) {
    throw new Error("There are no messages with that id");
  }
  return allMessages;
};

export const getConversation = async (originUserId, targetUserId) => {
  const messagesCollection = await messages();
  const conversation = await messagesCollection
    .find({
      $or: [
        {
          originUserId: new ObjectId(originUserId),
          targetUserId: new ObjectId(targetUserId),
        },
        {
          originUserId: new ObjectId(targetUserId),
          targetUserId: new ObjectId(originUserId),
        },
      ],
    })
    .toArray();

  return conversation;
};

export const getUniqueConversationUserIds = async (userId) => {
  let allConversationUserIds = [];
  const messageCollection = await messages();
  const ObjectUserId = new ObjectId(userId);

  const receivedMessages = await messageCollection
    .find({ targetUserId: ObjectUserId })
    .toArray();
  const sentMessages = await messageCollection
    .find({ originUserId: ObjectUserId })
    .toArray();
  for (const message of receivedMessages) {
    const userId = message.originUserId;
    if (!allConversationUserIds.includes(userId)) {
      allConversationUserIds.push(userId);
    }
  }

  for (const message of sentMessages) {
    const userId = message.targetUserId;
    if (!allConversationUserIds.includes(userId)) {
      allConversationUserIds.push(userId);
    }
  }
  let uniqueValues = [];

  for (const item of allConversationUserIds) {
    const itemString = item.toString();

    if (!uniqueValues.some((value) => value.toString() === itemString)) {
      uniqueValues.push(item);
    }
  }

  return uniqueValues;
};
