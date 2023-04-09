import { Router } from "express";
const router = Router();
import { groupData } from "../data/index.js";
import { ObjectId } from "mongodb";

router.route("/").get(async (req, res) => {
  try {
    let groupList = await groupData.getAll();
    let displayArray = [];
    for (let i = 0; i < groupList.length; i++) {
      let { name } = groupList[i];
      let { _id } = groupList[i];
      let groupObject = { _id: _id, name: name };
      displayArray.push(groupObject);
    }
    res.json(displayArray);
  } catch (e) {
    res.sendStatus(500);
  }
});
export default router;
