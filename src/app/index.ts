import express from "express";
import cors from 'cors';
import { UserService } from "./module/users/users.service";
import { AppDataSource } from "../config/database/datasource";
import { User } from "./module/users/users.model";
import { UserController } from "./module/users/users.controller";
import ErrorHandler from "./middleware/errorHandling";

// set origin cors options
const listOrigin = process.env.SAHABAT_CORS_ORIGIN?.split(",");
const corsOptions = {
  origin: listOrigin || ["*"],
  method: ['GET', 'POST', 'PUT', 'DELETE'],
  optionsSuccessStatus: 200,
  credentials: true
}

export class App {
    public SetupMiddleware(app: express.Application): void {
        app.use(cors(corsOptions));
        app.use(express.json());
        app.use(express.urlencoded({extended: true}))
      }

    public SetupRoutes(app: express.Application): void {
        // service dependency injection
        const userService = new UserService(AppDataSource.getRepository(User));

        // controller dependency injection
        const userController = new UserController(userService);

        // routes register
        app.use('/api/v1/users', userController.router);
    }

    public SetupErrorHandling(app: express.Application): void {
      app.use(ErrorHandler);
    }
}