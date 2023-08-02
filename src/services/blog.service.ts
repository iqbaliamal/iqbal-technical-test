import { omit, get } from "lodash";
import { FilterQuery, QueryOptions } from "mongoose";
import config from "config";
import blogModel, { Blog } from "../models/blog.model";
import redisClient from "../utils/redis";
import { DocumentType } from "@typegoose/typegoose";

// CreateBlog service
export const createBlog = async (input: Partial<Blog>) => {
  const slug = input.title?.toLowerCase().split(" ").join("-");

  const blog = await blogModel.create({
    ...input,
    slug,
  });

  if (!blog) {
    return null;
  }

  // Sync blog with redis
  syncBlog(blog.slug);

  return omit(blog.toJSON());
};

// Find Blog by slug
export const findBlogBySlug = async (slug: string) => {
  // Check if blog exist in redis
  const blog = await redisClient.get(slug);

  if (blog !== null) {
    return JSON.parse(blog);
  }

  // If blog doesn't exist in redis, check in database
  const data = await blogModel.findOne({ slug }).lean();

  if (!data) {
    return null;
  }

  // Sync blog with redis
  syncBlog(slug);

  return omit(data, ["_id", "__v"]);
};

// Find All blogs
export const findAllBlogs = async () => {
  // Check if blogs exist in redis
  const blogs = await redisClient.get("blogs");

  if (blogs) {
    return JSON.parse(blogs);
  }

  // If blogs doesn't exist in redis, check in database
  const data = await blogModel.find().lean();

  if (!data) {
    return null;
  }

  // Sync blogs with redis
  redisClient.set("blogs", JSON.stringify(data));

  return data;
};

export const updateBlog = async (slug: string, input: Partial<Blog>) => {
  if (input.title) {
    input.slug = input.title.toLowerCase().split(" ").join("-");
  }

  const data = blogModel.findOneAndUpdate({ slug }, input, {
    new: true,
  });

  if (!data) {
    return null;
  }

  // Delete blog from redis
  redisClient.del(slug);

  // Delete blog from redis
  redisClient.del("blogs");

  // Sync blog with redis
  syncBlog(slug);

  return data;
};

export const deleteBlog = async (slug: string) => {
  const blog = await blogModel.findOneAndDelete({ slug });

  // Delete blog from redis
  redisClient.del(slug);

  // Delete blog from redis
  redisClient.del("blogs");

  // Sync blog with redis
  syncBlog();

  return blog;
};

// Find one blog by any fields
export const findBlog = async (
  query: FilterQuery<DocumentType<Blog>>,
  options?: QueryOptions,
) => {
  // Check if blog exist in redis
  const blog = await redisClient.get(JSON.stringify(query));

  if (blog) {
    return JSON.parse(blog);
  }

  // If blog doesn't exist in redis, check in database
  const data = await blogModel.findOne(query, {}, options);

  if (!data) {
    return null;
  }

  // Sync blog with redis
  redisClient.set(JSON.stringify(query), JSON.stringify(data));

  return data;
};

// sync blog with redis
export const syncBlog = async (slug?: string) => {
  redisClient.set("blogs", JSON.stringify(await blogModel.find().lean()));

  if (slug) {
    const blog = await blogModel.find({ slug }).lean();

    if (!blog) {
      return null;
    }

    return redisClient.set(slug, JSON.stringify(blog));
  }
};
