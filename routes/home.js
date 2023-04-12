import { Router } from "express";
// import team from "../data/home.js";
const router = Router();

router.route("/").get((req, res) => {
  return res.render("homepage", { title: "Web Development I Group 15" });
});

// router.route('/team').get(async (req, res) => {
//   try {
//       const data = await team.getAllTeamMates();
//       res.json({data})
//   } catch (e) {
//       res.status(404).json(e);
//   }
// })

export default router;
