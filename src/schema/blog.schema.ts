import { object, string, TypeOf } from "zod";

export const createBlogSchema = object({
  body: object({
    title: string({ required_error: "Title is required" }),
    content: string({ required_error: "Content is required" }),
  }),
});

export const updateBlogSchema = object({
  body: object({
    title: string({ required_error: "Title is required" }).optional(),
    content: string({ required_error: "Content is required" }).optional(),
  }).nonstrict(),

  params: object({
    slug: string({ required_error: "Slug is required" }),
  }),
});

export const findBlogSchema = object({
  params: object({
    slug: string({ required_error: "Slug is required" }),
  }),

  query: object({
    lean: string().optional(),
  }).nonstrict(),
});

export type UpdateBlogInput = TypeOf<typeof updateBlogSchema>["body"];
export type CreateBlogInput = TypeOf<typeof createBlogSchema>["body"];
export type FindBlogInput = TypeOf<typeof findBlogSchema>["params"];
