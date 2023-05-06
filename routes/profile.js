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
// import { checkProfileAccess } from "../app.js";
import validation from "../helpers.js";

import { messages } from "../config/mongoCollections.js";
// import { de } from "date-fns/locale";

router.post("/:id/editProfilePic", upload.single("image"), async (req, res) => {
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

router.get("/:id/editProfilePic", async (req, res) => {
  const id = req.params.id;

  try {
    let userInfo = await userData.getUserById(id);

    res.render("./profile/profileEditPhoto", userInfo);
  } catch (e) {
    console.error(e);
    res.status(404).render("./error", {
      class: "error",
      title: "Error Page",
      errorMessage: `We're sorry, a user with that id does not exist.`,
    });
  }
});

router.route("/:id").get(async (req, res) => {
  // Need to do my error checking here!np

  const id = req.params.id;

  try {
    let userInfo = await userData.getUserById(id);
    let university = userInfo.university;
    let collegeMajor = userInfo.collegeMajor;
    let locationState = userInfo.locationState;
    let image = await userInfo.base64Image;
    let jobHistory = await jobHistoryData.getAll(id);
    let connections = await network.getConnections(id);
    connections = connections.slice(0, 5);
    let connectionsObj = [];
    for (const connection of connections) {
      const { firstName, lastName } = await userData.getUserFullNameById(
        connection
      );
      let userObj = {};
      userObj.firstName = firstName;
      userObj.lastName = lastName;
      userObj.id = connection;
      connectionsObj.push(userObj);
    }

    console.log(connectionsObj);

    res.render("./profile/profile", {
      title: "Profile Page",
      _id: id,
      isMyProfile: id === req.session.user.userId,
      fname: userInfo.fname,
      lname: userInfo.lname,
      description: userInfo.aboutMe,
      image: image,
      gitHubUserName: userInfo.gitHubUserName,
      jobHistory: jobHistory,
      connections: connectionsObj,
      university: university,
      locationState: locationState,
      collegeMajor: collegeMajor,
    });
  } catch (e) {
    console.error(e);
    res.status(404).render("./error", {
      class: "error",
      title: "Error Page",
      errorMessage: `We're sorry, a venue with that id does not exist.`,
    });
  }
});

router.get("/:id/edit", async (req, res) => {
  const id = req.params.id;
  const userId = req.session.user.userId;

  try {
    validation.checkParamsAndSessionId(id, userId);
  } catch (error) {
    return res.status(401).render("./profile/error", {
      title: "Error",
      errorMessage: "You don't belong here",
    });
  }

  try {
    let userInfo = await userData.getUserById(id);

    res.render("./profile/profileEdit", userInfo);
  } catch (e) {
    console.error(e);
    res.status(404).render("./error", {
      class: "error",
      title: "Error Page",
      errorMessage: `We're sorry, a user with that id does not exist.`,
    });
  }
});
// need to change to patch

router.get("/:id/addJobHistory", async (req, res) => {
  const id = req.params.id;
  const userId = req.session.user.userId;

  try {
    validation.checkParamsAndSessionId(id, userId);
  } catch (error) {
    return res.status(401).render("./profile/error", {
      title: "Error",
      errorMessage: "You don't belong here",
    });
  }

  try {
    let userInfo = await userData.getUserById(id);

    res.render("./profile/profileAddJobHistory", {
      ...userInfo,
      title: "Add Job History",
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

router.get("/:id/updateJobHistory", async (req, res) => {
  const id = req.params.id;
  const userId = req.session.user.userId;

  try {
    validation.checkParamsAndSessionId(id, userId);
  } catch (error) {
    return res.status(401).render("./profile/error", {
      title: "Error",
      errorMessage: "You don't belong here",
    });
  }

  try {
    let userInfo = await userData.getUserById(id);

    res.render("./profile/profileUpdateJobHistory", userInfo);
  } catch (e) {
    console.error(e);
    res.status(404).render("./error", {
      class: "error",
      title: "Error Page",
      errorMessage: `We're sorry, a user with that id does not exist.`,
    });
  }
});

router.post("/:id/addJobHistory", async (req, res) => {
  const id = req.params.id;
  const userId = req.session.user.userId;

  try {
    validation.checkParamsAndSessionId(id, userId);
  } catch (error) {
    return res.status(401).render("./profile/error", {
      title: "Error",
      errorMessage: "You don't belong here",
    });
  }

  let { role, organization, startDate, endDate, description } = req.body;

  if (!role || !organization || !startDate || !endDate || !description) {
    res.status(400).render("./profile/error", {
      class: "error",
      title: "Error Page",
      errorMessage: "Parameters are required",
    });
  }
  if (
    typeof role !== "string" ||
    typeof organization !== "string" ||
    typeof startDate !== "string" ||
    typeof endDate !== "string" ||
    typeof description !== "string"
  ) {
    res.status(400).render("/profile.error", {
      class: "error",
      title: "Error Page",
      errorMessage: "Need strings",
    });
  }

  role = role.trim();
  organization = organization.trim();
  startDate = startDate.trim();
  endDate = endDate.trim();
  description = description.trim();

  if (
    role.length === 0 ||
    organization.length === 0 ||
    startDate.length === 0 ||
    endDate.length === 0 ||
    description.length === 0
  ) {
    res.status(400).render("/profile.error", {
      class: "error",
      title: "Error Page",
      errorMessage: "Need strings",
    });
  }
  try {
    const newJob = await jobHistoryData.create(
      id,
      role,
      organization,
      startDate,
      endDate,
      description
    );

    res.redirect(`/profile/${id}`);
  } catch (error) {
    console.error(error);
    res.status(400).render("./profile/error", {
      class: "error",
      title: "Error Page",
      errorMessage: `Error adding job history: ${error.message}`,
    });
  }
});

router.post("/:id/updateprofile", upload.single("image"), async (req, res) => {
  const id = req.params.id;
  const userId = req.session.user.userId;

  try {
    validation.checkParamsAndSessionId(id, userId);
  } catch (error) {
    return res.status(401).render("./profile/error", {
      title: "Error",
      errorMessage: "You don't belong here",
    });
  }

  const fname = req.body.fname;
  const lname = req.body.lname;
  const gender = req.body.gender;
  const headerDescription = req.body.headerDescription;
  const aboutMe = req.body.aboutMe;
  const locationState = req.body.locationState;
  const university = req.body.university;
  const collegeMajor = req.body.collegeMajor;
  const gitHubUserName = req.body.gitHubUserName;
  const skills = req.body.skills;

  console.log({ fname, lname, gitHubUserName });

  let imgBase64 = null;

  if (req.file) {
    // Convert the image to base64
    const imgBuffer = req.file.buffer;
    const imgBase64 = imgBuffer.toString("base64");

    // Remove the temporary file
    // fs.unlinkSync(req.file.path);
  }

  let userObject = await userData.getUserById(id);
  userObject.fname = fname;
  userObject.lname = lname;
  userObject.gitHubUserName = gitHubUserName;
  userObject.image = imgBase64;
  userObject.gender = gender;
  userObject.headerDescription = headerDescription;
  userObject.aboutMe = aboutMe;
  userObject.locationState = locationState;
  userObject.university = university;
  userObject.collegeMajor = collegeMajor;
  userObject.skills = skills; // Add the skills to the user object

  try {
    await userData.updateUsers(id, userObject);
    res.redirect(`/profile/${id}`);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error updating profile.");
  }
});

router.post("/:userId/updateJobHistory", async (req, res) => {
  const userId = req.params.userId;
  const jobs = await jobHistoryData.getAll(userId);
  try {
    for (let i = 0; i < jobs.length; i++) {
      let { _id, role, organization, startDate, endDate, description } =
        jobs[i];
      _id = _id.toString();
      await jobHistoryData.update(
        userId,
        _id,
        req.body[`role${_id}`],
        req.body[`organization${_id}`],
        req.body[`startDate${_id}`],
        req.body[`endDate${_id}`],
        req.body[`description${_id}`]
      );
    }

    res.redirect(`/profile/${userId}`);
  } catch (e) {
    console.error(e);
    res.status(400).render("./profile/error", {
      class: "error",
      title: "Error Page",
      errorMessage: `Failed to update the job history: ${e.message}`,
    });
  }
});

// router.post("/:id/updatename", async (req, res) => {
//   const id = req.params.id;
//   const newName = req.body.name;

//   try {
//     await userData.updateName(id, newName);
//     res.redirect(`/profile/${id}`);
//   } catch (e) {
//     console.error(e);
//     res.status(500).send("Not able to update name");
//   }
// });

// router.post("/:id/updategithubusername", async (req, res) => {
//   const id = req.params.id;
//   const newGitHubUserName = req.body.gitHubUserName;

//   try {
//     await userData.updateGitHubUserName(id, newGitHubUserName);
//     res.redirect(`/profile/${id}`);
//   } catch (e) {
//     console.error(e);
//     res.status(500).send("Not able to update GitHub username");
//   }
// });

router
  .route("/:id/messaging")
  .get(async (req, res) => {
    let id = req.params.id;
    try {
      let allConnectionsFullNamesArray = [];
      let allConnections = await network.getConnections(id);
      for (const id of allConnections) {
        let allConnectionsFullNames = await userData.getUserFullNameById(
          id.toString()
        );
        allConnectionsFullNamesArray.push({
          id: id,
          fullName: `${allConnectionsFullNames.firstName} ${allConnectionsFullNames.lastName}`,
        });
      }

      const uniqueConversationUserIds =
        await messageData.getUniqueConversationUserIds(id);
      const conversations = [];
      const userFullNames = [];

      for (const id of uniqueConversationUserIds) {
        const userFullName = await userData.getUserFullNameById(id.toString());
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
      let sortedConversations = conversations.sort((a, b) => {
        console.log(a);
        console.log(b);
        let latestMessageA = a[a.length - 1];
        let latestMessageB = b[b.length - 1];
        if (!latestMessageA || !latestMessageB) {
          return 0;
        }
        if ((latestMessageA.createdAt || 0) < (latestMessageB.createdAt || 0)) {
          return -1;
        }
        if (
          (latestMessageA.createdAt || 0) === (latestMessageB.createdAt || 0)
        ) {
          return 0;
        }
        return 1;
      });

      res.render("./profile/profileMessage", {
        _id: id,
        connections: allConnections,
        conversations: sortedConversations,
        userFullNames: allConnectionsFullNamesArray,
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
      let allConnectionsFullNamesArray = [];
      let allConnections = await network.getConnections(id);
      for (const id of allConnections) {
        let allConnectionsFullNames = await userData.getUserFullNameById(
          id.toString()
        );
        allConnectionsFullNamesArray.push({
          id: id,
          fullName: `${allConnectionsFullNames.firstName} ${allConnectionsFullNames.lastName}`,
        });
      }

      const uniqueConversationUserIds =
        await messageData.getUniqueConversationUserIds(id);
      const conversations = [];
      const userFullNames = [];

      for (const id of uniqueConversationUserIds) {
        const userFullName = await userData.getUserFullNameById(id.toString());
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
      let newMessage = await messageData.create(
        id,
        receivedInput.connection,
        receivedInput.messageInput
      );
      let allMessages = await messageData.getAll(id);
      console.log(uniqueConversationUserIds);
      console.log(conversations);
      res.render("./profile/profileMessage", {
        _id: id,
        messages: allMessages,
        connections: allConnections,
        conversations: conversations,
        userFullNames: allConnectionsFullNamesArray,
      });
    } catch (e) {
      console.error(e);
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

router.get("/:id/connect", async (req, res) => {
  const userId = req.session.user.userId;
  const followerId = req.params.id;

  try {
    const newConnection = await network.addConnections(userId, followerId);
    const newConnection2 = await network.addConnections(followerId, userId);

    res.render("./profile/profile", {
      connectionMessage: "Congratulations, you are now connected!",
      _id: followerId,
    });
  } catch (e) {
    console.error(e); // Log the error to console
    res.render("./error", {
      message: e,
    });
  }
});

export default router;
