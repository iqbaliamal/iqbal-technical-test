import { NextFunction, Request, Response } from "express";
import {
  findAllUsers,
  findUserById,
  findUserByQuery,
  updateUser,
} from "../services/user.service";
import AppError from "../utils/appError";
import { ParsedUrlQuery } from "querystring";

interface QueryOptions extends ParsedUrlQuery {
  accountNumber: string;
  identityNumber: string;
}

export const getMeHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = res.locals.user;
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getAllUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.query.accountNumber) {
      const { accountNumber } = req.query as QueryOptions;

      const user = await getByQuery(accountNumber);

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    } else if (req.query.identityNumber) {
      const user = await getByQuery(req.query.identityNumber as string);

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    } else {
      const users = await findAllUsers();
      res.status(200).json({
        status: "success",
        result: users.length,
        data: {
          users,
        },
      });
    }
  } catch (err: any) {
    next(err);
  }
};

export const getUserHandler = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await findUserById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateMeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await updateUser(res.locals.user._id, req.body);

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateUserHandler = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await updateUser(req.params.id, req.body);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

const getByQuery = async (query: string) => {
  return await findUserByQuery(query);
};
