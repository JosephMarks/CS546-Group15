import { Router } from "express";
const router = Router();
import { userData } from "../data/index.js";
import { ObjectId } from "mongodb";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
import fs from "fs";

router.route("/:id").get(async (req, res) => {
  // Need to do my error checking here!

  const id = req.params.id;

  try {
    let user = await userData.getUserById(id);
    let image = groupInfo.base64Image;
    // Pass our data over to the template to be rendered
    // let eventsArray = [];
    // for (let i = 0; i < groupInfo.groups.length; i++) {
    //   eventsArray.push(roupInfo.groups[i]);
    // }
    // console.log(eventsArray);

    res.render("./groupById", {
      _id: groupInfo._id,
      name: groupInfo.name,
      description: groupInfo.description,
      events: "the big event",
      image: image,
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
