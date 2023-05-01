import { Router } from "express";
const router = Router();
import userData from "../data/user.js";
import { ObjectId } from "mongodb";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
import fs from "fs";
import network from "../data/network.js";
import * as messageData from "../data/messages.js";
import * as jobHistoryData from "../data/userJobHistory.js";

import { messages } from "../config/mongoCollections.js";

router.post("/:id/updateimage", upload.single("image"), async (req, res) => {
  const id = req.params.id;

  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }

  try {
    // Convert the image to base64
    const imgBuffer = fs.readFileSync(req.file.path);
    const imgBase64 = imgBuffer.toString("base64");

    // Update the group data with the new image
    await userData.updateImage(id, imgBase64);

    // Remove the temporary file
    fs.unlinkSync(req.file.path);

    // Redirect to the group page
    res.redirect(`/profile/${id}`);
  } catch (e) {
    console.error(e); // Log the error to console
    res.status(500).send("Error uploading image.");
  }
});

router.route("/:id").get(async (req, res) => {
  // Need to do my error checking here!np

  const id = req.params.id;

  try {
    let userInfo = await userData.getUserById(id);
    console.log(userInfo);
    let image = await userInfo.base64Image;
    console.log(image);
    let jobHistory = await jobHistoryData.getAll(id);
    let connections = await network.getConnections(id);
    console.log(connections);
    connections = connections.slice(0, 5); // Show only the first 5 connections

    res.render("./profile/profile", {
      title: "Profile Page",
      _id: id,
      name: userInfo.name,
      description: userInfo.aboutMe,
      image: image,
      gitHubUserName: userInfo.gitHubUserName,
      jobHistory: jobHistory,
      connections: connections,
    });
  } catch (e) {
    res.status(404).render("./error", {
      class: "error",
      title: "Error Page",
      errorMessage: `We're sorry, a venue with that id does not exist.`,
    });
  }
});

router.get("/:id/edit", async (req, res) => {
  const id = req.params.id;

  try {
    let userInfo = await userData.getUserById(id);

    res.render("./profile/profileEdit", {
      _id: id,
      name: userInfo.name,
      aboutMe: userInfo.aboutMe,
      image: userInfo.base64Image,
    });
  } catch (e) {
    console.error(e);
    res.status(404).render("./error", {
      class: "error",
      title: "Error Page",
      errorMessage: `We're sorry, a user with that id does not exist.`,
    });
  }
});

router.post("/:id/updatename", async (req, res) => {
  const id = req.params.id;
  const newName = req.body.name;

  try {
    await userData.updateName(id, newName);
    res.redirect(`/profile/${id}`);
  } catch (e) {
    console.error(e);
    res.status(500).send("Not able to update name");
  }
});

router.post("/:id/updategithubusername", async (req, res) => {
  const id = req.params.id;
  const newGitHubUserName = req.body.gitHubUserName;

  try {
    await userData.updateGitHubUserName(id, newGitHubUserName);
    res.redirect(`/profile/${id}`);
  } catch (e) {
    console.error(e);
    res.status(500).send("Not able to update GitHub username");
  }
});

router
  .route("/:id/messaging")
  .get(async (req, res) => {
    let id = req.params.id;
    try {
      const uniqueConversationUserIds =
        await messageData.getUniqueConversationUserIds(id);
      const conversations = [];
      const userFullNames = []; // Initialize the userFullNames array

      for (const id of uniqueConversationUserIds) {
        const userFullName = await userData.getUserFullNameById(id);
        conversations.push({
          id: id,
          fullName: `${userFullName.firstName} ${userFullName.lastName}`,
        });

        // Populate the userFullNames array with user IDs and names
        userFullNames.push({
          id: id,
          fullName: `${userFullName.firstName} ${userFullName.lastName}`,
        });
      }

      res.render("./profile/profileMessage", {
        _id: id,
        conversations: conversations,
        userFullNames: userFullNames, // Pass the userFullNames array to the template
      });
    } catch (e) {
      console.error(e);
      res.status(500).send("Error retrieving conversations.");
    }
  })
  .post(async (req, res) => {
    const receivedInput = req.body;
    const id = req.params.id;
    try {
      let newMessage = await messageData.create(
        id,
        receivedInput.connection,
        receivedInput.subjectInput,
        receivedInput.messageInput
      );
      let allMessages = await messageData.getAll(id);

      res.render("./profile/profileMessage", {
        _id: id,
        messages: allMessages, // Pass all messages to the template
      });
    } catch (e) {
      console.error(e); // Log the error to console
      res.status(500).send("Error sending message.");
    }
  });

router.get("/:originUserId/messaging/:targetUserId", async (req, res) => {
  const originUserId = req.params.originUserId;
  const targetUserId = req.params.targetUserId;

  try {
    // Fetch the conversation between the current user and the friend
    const messages = await messageData.getConversation(
      new ObjectId(originUserId),
      new ObjectId(targetUserId)
    );
    console.log(messages);
    res.json(messages);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error retrieving conversation.");
  }
});

export default router;
