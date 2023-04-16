import { Router } from "express";
const router = Router();
import { userData } from "../data/index.js";
import { ObjectId } from "mongodb";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
import fs from "fs";

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
  // Need to do my error checking here!

  const id = req.params.id;

  try {
    let userInfo = await userData.get(id);
    let image = userInfo.base64Image;
    // Pass our data over to the template to be rendered
    // let eventsArray = [];
    // for (let i = 0; i < groupInfo.groups.length; i++) {
    //   eventsArray.push(roupInfo.groups[i]);
    // }
    // console.log(eventsArray);

    res.render("./profile", {
      _id: id,
      name: userInfo.userInfo,
      description: userInfo.aboutMe,
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
