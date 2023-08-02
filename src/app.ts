require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import config from "config";
import cors from "cors";
import morgan from "morgan";
import { connect } from "./utils/database";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";
import blogRouter from "./routes/blog.route";

const app = express();

// Middleware

// 1. Body Parser
app.use(express.json({ limit: "10kb" }));

// 2. Cookie Parser
app.use(cookieParser());

// 3. Logger
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// 4. Cors
app.use(
  cors({
    origin: config.get<string>("origin"),
    credentials: true,
  }),
);

// 5. Routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/blogs", blogRouter);

// Testing
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to Technical Test Folkatech 🔥",
  });
});

// UnKnown Routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

const port = config.get<number>("port");
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);

  connect();
});
