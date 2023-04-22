import { Router } from "express";
const router = Router();
import { teamData } from "../data/index.js";
import { ObjectId } from "mongodb";
import { team } from "../config/mongoCollections.js";

router.route("/").get(async (req, res) => {
  try {
    const team = [
      { name: "Pradyumn Pundir", image: "/public/static/images/joe2.png" },
      { name: "Ruobing Liu", image: "/public/static/images/joe2.png" },
      { name: "Tzu-Ming Lu", image: "/public/static/images/ming.png" },
      { name: "Joe Marks", image: "/public/static/images/joe2.png" },
    ];

    res.render("./teaminfo", { team });
  } catch (e) {
    res.sendStatus(500);
  }
});
export default router;
