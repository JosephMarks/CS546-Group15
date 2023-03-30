import { Router } from "express";
const router = Router();
import { userData } from "../data/index.js";
import { ObjectId } from "mongodb";

router.route("/:id").get(async (req, res) => {
  return res.json(req.params.id);
});

export { router as userRoutes };
