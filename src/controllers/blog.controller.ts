import config from "config";
import { CookieOptions, NextFunction, Request, Response } from "express";
import {
  CreateBlogInput,
  FindBlogInput,
  UpdateBlogInput,
} from "../schema/blog.schema";
import {
  createBlog,
  deleteBlog,
  findAllBlogs,
  findBlog,
  findBlogBySlug,
  updateBlog,
} from "../services/blog.service";
import AppError from "../utils/appError";
import { type } from "os";
import { ParsedUrlQuery } from "querystring";

interface Params extends ParsedUrlQuery {
  slug: string;
}

// Cookie options
const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(
    Date.now() + config.get<number>("accessTokenExpiresIn") * 60 * 1000,
  ),
  maxAge: config.get<number>("accessTokenExpiresIn") * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

// Only set secure to true in production
if (process.env.NODE_ENV === "production")
  accessTokenCookieOptions.secure = true;

export const createBlogHandler = async (
  req: Request<{}, {}, CreateBlogInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const blog = await createBlog({
      title: req.body.title,
      content: req.body.content,
    });

    res.status(201).json({
      status: "success",
      data: {
        blog,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const findAllBlogsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const blogs = await findAllBlogs();

    res.status(200).json({
      status: "success",
      data: blogs,
    });
  } catch (err: any) {
    next(err);
  }
};

export const findBlogHandler = async (
  req: Request<{}, {}, FindBlogInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    // get slug from params
    const { slug } = req.params as Params;

    const blog = await findBlogBySlug(slug);

    console.log(blog);

    if (!blog || blog.length === 0) {
      return next(new AppError("Blog not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: blog,
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateBlogHandler = async (
  req: Request<{}, {}, UpdateBlogInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug } = req.params as Params;
    const blog = await updateBlog(slug, req.body);

    if (!blog) {
      return next(new AppError("Blog not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        blog,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const deleteBlogHandler = async (
  req: Request<{}, {}, FindBlogInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug } = req.params as Params;
    const blog = await deleteBlog(slug);

    if (!blog) {
      return next(new AppError("Blog not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: [],
    });
  } catch (err: any) {
    next(err);
  }
};
