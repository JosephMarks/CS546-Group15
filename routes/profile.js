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
    let userInfo = await userData.getUserById(id);
    console.log(userInfo);
    let image = userInfo.base64Image;
    // Pass our data over to the template to be rendered
    // let eventsArray = [];
    // for (let i = 0; i < groupInfo.groups.length; i++) {
    //   eventsArray.push(roupInfo.groups[i]);
    // }
    // console.log(eventsArray);

    res.render("./profile/profile", {
      _id: id,
      name: userInfo.name,
      description: userInfo.aboutMe,
      image: image,
      gitHubUserName: userInfo.gitHubUserName,
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

export default router;
