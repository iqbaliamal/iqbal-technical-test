import { omit, get } from "lodash";
import { FilterQuery, QueryOptions } from "mongoose";
import config from "config";
import userModel, { User } from "../models/user.model";
import { excludedFields } from "../controllers/auth.controller";
import { signJwt } from "../utils/jwt";
import redisClient from "../utils/redis";
import { DocumentType } from "@typegoose/typegoose";

// CreateUser service
export const createUser = async (input: Partial<User>) => {
  const user = await userModel.create(input);
  return omit(user.toJSON(), excludedFields);
};

// Find User by Id
export const findUserById = async (id: string) => {
  const user = await userModel.findById(id).lean();
  return omit(user, excludedFields);
};

// Find All users
export const findAllUsers = async () => {
  return await userModel.find();
};

// Find one user by any fields
export const findUser = async (
  query: FilterQuery<User>,
  options: QueryOptions = {},
) => {
  return await userModel.findOne(query, {}, options).select("+password");
};

export const findUserByQuery = async (query: string) => {
  // return userModel.where("accountNumber").equals(query) or userModel.where("identityNumber").equals(query)
  return userModel.findOne({
    $or: [{ accountNumber: query }, { identityNumber: query }],
  });
};

// Update User
export const updateUser = async (
  id: string,
  update: Partial<User>,
  options: QueryOptions = { new: true },
) => {
  return await userModel.findOneAndUpdate({ _id: id }, update, options);
};

// Delete User
export const deleteUser = async (id: string) => {
  return await userModel.deleteOne({ _id: id });
};

// Sign Token
export const signToken = async (user: DocumentType<User>) => {
  // Sign the access token
  const access_token = signJwt(
    { sub: user._id },
    {
      expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
    },
  );

  // Create a Session
  redisClient.set(user._id.toString(), JSON.stringify(user));

  // Return access token
  return { access_token };
};
