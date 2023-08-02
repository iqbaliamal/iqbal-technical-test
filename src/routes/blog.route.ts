import express from "express";
import {
  createBlogHandler,
  deleteBlogHandler,
  findAllBlogsHandler,
  findBlogHandler,
  updateBlogHandler,
} from "../controllers/blog.controller";
import {
  createBlogSchema,
  findBlogSchema,
  updateBlogSchema,
} from "../schema/blog.schema";
import { restrictTo } from "../middleware/restrictTo";
import { validate } from "../middleware/validate";
import { deserializeUser } from "../middleware/deserializeUser";

const router = express.Router();

// Create blog route
router.post(
  "/",
  deserializeUser,
  validate(createBlogSchema),
  restrictTo("admin"),
  createBlogHandler,
);

// Get all blogs route
router.get("/", findAllBlogsHandler);

// Get blog route
router.get("/:slug", validate(findBlogSchema), findBlogHandler);

// Update blog route
router.patch(
  "/:slug",
  deserializeUser,
  validate(updateBlogSchema),
  restrictTo("admin"),
  updateBlogHandler,
);

// Delete blog route
router.delete(
  "/:slug",
  deserializeUser,
  validate(findBlogSchema),
  restrictTo("admin"),
  deleteBlogHandler,
);

export default router;
