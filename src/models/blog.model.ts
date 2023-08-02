import {
  DocumentType,
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
} from "@typegoose/typegoose";
import redisClient from "../utils/redis";
import AppError from "../utils/appError";
import { syncBlog } from "../services/blog.service";

@index({ slug: 1 }, { unique: true })
@pre<Blog>("save", async function () {
  // slug from title if the slug is new or was updated
  if (!this.isModified("slug")) return;

  // slug from title
  this.slug = this.title.toLowerCase().split(" ").join("-");

  // Check if slug exist in database
  const slugExist = await blogModel.findOne({ slug: this.slug });

  if (slugExist) {
    throw new AppError("Slug already exist", 409);
  }

  // Sync blog with redis
  syncBlog(this.slug);

  return;
})
@modelOptions({
  schemaOptions: {
    // Add createdAt and updatedAt fields
    timestamps: true,
  },
})

// Export the Blog class to be used as TypeScript type
export class Blog {
  @prop({ required: true })
  title: string;

  @prop({ required: true, unique: true })
  slug: string;

  @prop({ required: true })
  content: string;
}

// Create the blog model from the Blog class
const blogModel = getModelForClass(Blog);

export default blogModel;
