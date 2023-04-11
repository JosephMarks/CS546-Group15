import { Router } from "express";
const router = Router();
import { teamData } from "../data/index.js";
import { ObjectId } from "mongodb";
import { team } from "../config/mongoCollections.js";

router.route("/").get(async (req, res) => {
  try {
    let theName;
    console.log("hello");
    let theTeam = await teamData.getAll();
    for (let i = 0; i < theTeam.length; i++) {
      theName = theTeam[i]["name"];
    }
    //   console.log("hello");
    //   let teamList = await teamData.getAll();
    //   let displayArray = [];
    //   for (let i = 0; i < groupList.length; i++) {
    //     let { name } = groupList[i];
    //     let { _id } = groupList[i];
    //     let groupObject = { _id: _id, name: name };
    //     displayArray.push(groupObject);
    //   }
    let image = "/public/static/images/joe2.png";
    res.render("./teaminfo", {
      image: image,
      team: theName,
    });
  } catch (e) {
    res.sendStatus(500);
  }
});
export default router;
