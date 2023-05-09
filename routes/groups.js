import { Router } from "express";
const router = Router();
import { groupData, groupActivityData } from "../data/index.js";
import { ObjectId } from "mongodb";
import multer from "multer";
const upload = multer();
import fs from "fs";
import * as groupActivityFn from "../data/groupActivity.js";
import * as groupEventData from "../data/groupEvents.js";
import userData from "../data/user.js";
import { users } from "../config/mongoCollections.js";

router.route("/").get(async (req, res) => {
  try {
    let groupList = await groupData.getAll();
    let displayArray = [];
    for (let i = 0; i < groupList.length; i++) {
      let { name } = groupList[i];
      let { _id } = groupList[i];
      let { description } = groupList[i];

      let numOfUsers = await groupData.numberOfUsers(_id);
      let groupObject = {
        _id: _id,
        name: name,
        numOfUsers: numOfUsers,
        description: description,
      };
      displayArray.push(groupObject);
    }
    res.render("./groups/groups", {
      groups: displayArray,
      title: "Groups Master Page",
    });
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// router.post("/:id/updateimage", upload.single("image"), async (req, res) => {
//   const id = req.params.id;

//   if (!req.file) {
//     res.status(400).send("No file uploaded.");
//     return;
//   }

//   try {
//     // Convert the image to base64
//     const imgBuffer = req.file.buffer;
//     // const imgBuffer = fs.readFileSync(req.file.path);

//     const imgBase64 = imgBuffer.toString("base64");

//     // Update the group data with the new image
//     await groupData.updateImage(id, imgBase64);

//     // // Remove the temporary file
//     // fs.unlinkSync(req.file.path);

//     // Redirect to the group page
//     res.redirect(`/groups/${id}`);
//   } catch (e) {
//     console.error(e); // Log the error to console
//     res.status(500).send("Error uploading image.");
//   }
// });

// router.post("/:id/updatename", async (req, res) => {
//   const id = req.params.id;
//   const newName = req.body.name;

//   try {
//     let updatedGroup = await groupData.get(id);
//     await groupData.updateName(id, newName);

//     res.redirect(`/groups/${id}`);
//   } catch (e) {
//     console.error(e); // Log the error to console
//     res.status(500).send("Not able to update name");
//   }
// });

router.get("/create", (req, res) => {
  res.render("./groups/createGroup", { title: "Create Group" });
});

router.post("/", async (req, res) => {
  const { name, description } = req.body;
  console.log(name);
  console.log(description);

  if (!name || !description) {
    res.status(400).render("./error", {
      message: "Parameters are required",
    });
  }
  try {
    const newGroup = await groupData.create(
      name,
      description,
      req.session.user.userId
    );
    res.redirect(`/groups/${newGroup._id}`);
  } catch (e) {
    res.status(400).render("./groups/error", {
      class: "error",
      title: "Error Page",
      errorMessage: `We're sorry, a venue with that id does not exist .`,
    });
  }
});

router.route("/:id").get(async (req, res) => {
  console.log("Accessing /groups/:id route with ID:", req.params.id);

  // Need to do my error checking here!

  const id = req.params.id;
  let userId = req.session.user.userId;
  userId = userId.toString();

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ObjectId");
  }
  let numOfUsers = await groupData.numberOfUsers(id);

  const group = await groupData.get(id);
  let users = group.users;
  let isMember = false;
  for (let i = 0; i < users.length; i++) {
    const member = users[i];
    if (member === userId) {
      isMember = true;
      break;
    }
  }
  try {
    let groupInfo = await groupData.get(id);
    let events = await groupEventData.getAll(id);
    let image = groupInfo.base64Image;
    // Pass our data over to the template to be rendered
    // let eventsArray = [];
    // for (let i = 0; i < groupInfo.groups.length; i++) {
    //   eventsArray.push(roupInfo.groups[i]);
    // }
    // console.log(eventsArray);

    // Get author names for each activity and update the author field
    for (let i = 0; i < groupInfo.activity.length; i++) {
      const authorId = groupInfo.activity[i].author;
      const authorName = await userData.getUserFullNameById(authorId);
      groupInfo.activity[
        i
      ].author = `${authorName.firstName} ${authorName.lastName}`;
    }

    res.render("./groups/groupById", {
      title: "Group Specific Page",
      _id: id,
      name: groupInfo.name,
      description: groupInfo.description,
      activity: groupInfo.activity,
      events: events,
      numOfUsers: numOfUsers,
      image: image,
      isMember: isMember,
    });
  } catch (e) {
    res.status(404).render("./error", {
      class: "error",
      title: "Error Page",
      errorMessage: `We're sorry, a venue with that id does not exist .`,
    });
  }
});

router.get("/:id/edit", async (req, res) => {
  const id = req.params.id;

  try {
    let groupInfo = await groupData.get(id);

    if (groupInfo.users.includes(req.session.user.userId)) {
      res.render("./groups/groupsEdit", {
        _id: id,
        name: groupInfo.name,
        description: groupInfo.description,
        image: groupInfo.base64Image,
        title: "Edit Group",
      });
    } else {
      res.redirect("/groups");
    }
  } catch (e) {
    res.status(404).render("./error", {
      class: "error",
      title: "Error Page",
      errorMessage: `We're sorry, a venue with that id does not exist .`,
    });
  }
});

router.post("/:id", upload.single("image"), async (req, res) => {
  const groupId = req.params.id;
  const { name, description } = req.body;
  const userId = req.session.user.userId;
  const group = await groupData.get(groupId);
  try {
    // Check if an image was uploaded
    if (req.file) {
      // Convert the image to base64
      const imgBuffer = req.file.buffer;
      const imgBase64 = imgBuffer.toString("base64");

      let updatedGroup = {
        name: name,
        description: description,
        image: imgBase64,
      };

      // Update the group data with the new image
      await groupData.updateGroup(groupId, updatedGroup);
    } else {
      let updatedGroup = {
        name: name,
        description: description,
      };
      // Update the group data without changing the image
      await groupData.updateGroup(groupId, updatedGroup);
    }

    // Redirect to the group's details page
    res.redirect(`/groups/${groupId}`);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error updating group.");
  }
});

router.get("/:id/join", async (req, res) => {
  const id = req.params.id;
  try {
    let joinedGroup = await groupData.addUser(id, req.session.user.userId);
    if (joinedGroup) {
      res.render("./groups/groupsJoin", {
        title: "Group Join",
        message: "You have successfully joined the group!",
        userId: req.session.user.userId,
      });
    } else {
      res.render("./groups/groupsJoin", {
        title: "Group Join",
        message: "You have successfully joined the group!",
        userId: req.session.user.userId,
      });
    }
  } catch (e) {
    console.error(e);
    res.status(400).render("./groups/groupsJoin", {
      error: e.message,
    });
  }
});

router.get("/:id/eventEdit", async (req, res) => {
  const id = req.params.id;
  // array of all events for this group
  const groupEvents = await groupEventData.getAll(id);
  console.log("what is groupEvevnts?", groupEvents);
  // const groupInfo = await groupData.get(id);

  try {
    res.render("./groups/eventEdit", {
      _id: id,
      title: "Events Edit",
      events: groupEvents,
    });
  } catch (e) {
    res.status(404).render("./error", {
      class: "error",
      title: "Error Page",
      errorMessage: `We're sorry, a venue with that id does not exist .`,
    });
  }
});

router.post("/:groupId/eventEdit/:eventId", async (req, res) => {
  const { groupId, eventId } = req.params;
  const { title, eventDate, description } = req.body;
  console.log({ title, eventDate, description });

  const updatedEvent = {
    title: title,
    eventDate: eventDate,
    description: description,
  };
  try {
    await groupEventData.update(groupId, eventId, updatedEvent);
    res.redirect(`/groups/${groupId}`);
  } catch (e) {
    res.status(400).render("./groups/error", {
      class: "error",
      title: "Error Page",
      errorMessage: `Error here: ${e.message}`,
    });
  }
});

router.get("/:id/eventAdd", async (req, res) => {
  const id = req.params.id;

  try {
    res.render("./groups/eventAdd", {
      _id: id,
      title: "Add Event",
    });
  } catch (e) {
    res.status(400).render("./groups/error", {
      class: "error",
      title: "Error Page",
      errorMessage: `Error here: ${e.message}`,
    });
  }
});

router.post("/:id/eventAdd", async (req, res) => {
  const groupId = req.params.id;
  const { title, description, eventDate } = req.body;
  const authorId = req.session.user.userId;
  try {
    let newEvent = await groupEventData.create(
      groupId,
      title,
      description,
      eventDate,
      authorId
    );
    res.redirect(`/groups/${groupId}`);
  } catch (e) {
    console.log(e);
    res.status(400).render("./groups/error", {
      class: "error",
      title: "Error Page",
      errorMessage: `Error adding the event: ${e.message}`,
    });
  }
});

router.get("/:id/activityAdd", async (req, res) => {
  const id = req.params.id;

  //get the group
  const fetdchedGroup = await groupData.get(id);
  if (fetdchedGroup.users.includes(req.session.user.userId)) {
    try {
      res.render("./groups/activityAdd", {
        _id: id,
        title: "Add Activity",
      });
    } catch (e) {
      res.status(404).render("./error", {
        class: "error",
        title: "Error Page",
        errorMessage: `We're sorry, a group with that id does not exist.`,
      });
    }
  } else {
    res.redirect("/groups");
  }
});

router.post("/:id/activityAdd", async (req, res) => {
  const groupId = req.params.id;
  const { title } = req.body;
  const { message } = req.body;
  const userId = req.session.user.userId;
  try {
    let newActivity = await groupActivityData.create(
      groupId,
      title,
      userId,
      message
    );
    res.redirect(`/groups/${groupId}`);
  } catch (e) {
    res.status(400).render("./groups/error", {
      class: "error",
      title: "Error Page",
      errorMessage: `Error adding the activity: ${e.message}`,
    });
  }
});

router.get("/:id/users", async (req, res) => {
  const groupId = req.params.id;
  const retrievedGroup = await groupData.get(groupId);
  const userNames = await Promise.all(
    retrievedGroup.users.map(async (userId) => {
      const name = await userData.getUserFullNameById(userId);
      return { id: userId, name: name };
    })
  );
  console.log(userNames);

  res.render("./groups/groupsUsers", {
    title: "Group Members",
    groupName: retrievedGroup.name,
    users: userNames,
    groupId,
  });
});

export default router;
