import express from "express";
import {
  getAllUsersHandler,
  getMeHandler,
  updateMeHandler,
  updateUserHandler,
} from "../controllers/user.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import { restrictTo } from "../middleware/restrictTo";
import { validate } from "../middleware/validate";
import { updateMeSchema, updateUserSchema } from "../schema/user.schema";

const router = express.Router();
router.use(deserializeUser, requireUser);

// Admin Get Users route
router.get("/", restrictTo("admin"), getAllUsersHandler);

// Get my info route
router.get("/me", getMeHandler);

// Update my info route
router.patch("/me", validate(updateMeSchema), updateMeHandler);

// Admin Update User route
router.patch(
  "/:id",
  validate(updateUserSchema),
  restrictTo("admin"),
  updateUserHandler,
);

export default router;
