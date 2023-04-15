import { Router } from "express";
const router = Router();
import { groupData } from "../data/index.js";
import { ObjectId } from "mongodb";
import multer from "multer";

router.route("/").get(async (req, res) => {
  try {
    let groupList = await groupData.getAll();
    let displayArray = [];
    for (let i = 0; i < groupList.length; i++) {
      let { name } = groupList[i];
      let { _id } = groupList[i];
      let groupObject = { _id: _id, name: name };
      displayArray.push(groupObject);
      console.log(displayArray);
    }
    res.render("./groups", { groups: displayArray });
  } catch (e) {
    res.sendStatus(500);
  }
});

router.route("/:id/update").post(async (req, res) => {
  // Need to do my error checking here!

  const id = req.params.id;

  try {
    let groupInfo = await groupData.get(id);
    console.log(groupInfo);
    // Pass our data over to the template to be rendered
    // let eventsArray = [];
    // for (let i = 0; i < groupInfo.groups.length; i++) {
    //   eventsArray.push(roupInfo.groups[i]);
    // }
    // console.log(eventsArray);

    res.render("./groupById", {
      name: groupInfo.name,
      description: groupInfo.description,
      events: "the big event",
      image: "public/static/images/groupStock.png",
    });
  } catch (e) {
    res.status(404).render("./error", {
      class: "error",
      title: "Error Page",
      errorMessage: `We're sorry, a venue with that id does not exist .`,
    });
  }
});

router.route("/:id").get(async (req, res) => {
  // Need to do my error checking here!

  const id = req.params.id;

  try {
    let groupInfo = await groupData.get(id);
    console.log(groupInfo);
    // Pass our data over to the template to be rendered
    // let eventsArray = [];
    // for (let i = 0; i < groupInfo.groups.length; i++) {
    //   eventsArray.push(roupInfo.groups[i]);
    // }
    // console.log(eventsArray);

    res.render("./groupById", {
      name: groupInfo.name,
      description: groupInfo.description,
      events: "the big event",
      image: "public/static/images/groupStock.png",
    });
  } catch (e) {
    res.status(404).render("./error", {
      class: "error",
      title: "Error Page",
      errorMessage: `We're sorry, a venue with that id does not exist .`,
    });
  }
});

export default router;
