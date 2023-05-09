import { Router } from "express";
// import team from "../data/home.js";
const router = Router();

router.route("/").get((req, res) => {
  if (!req.session.user) {
    return res.render("homepage", {
      title: "Better Interview Book",
      userName: "Sign In First",
      status: false,
    });
  } else {
    console.log(req.session.user);
    return res.render("homepage", {
      title: "Better Interview Book",
      userName: req.session.user.email,
      status: true,
      userId: req.session.user.userId,
    });
  }
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
