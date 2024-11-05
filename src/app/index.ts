import express from "express";
import cors from 'cors';
import { UserService } from "./module/users/users.service";
import { AppDataSource } from "../config/sql/datasource";
import { User } from "./module/users/users.model";
import { UserController } from "./module/users/users.controller";
import ErrorHandler from "./middleware/errorHandling";
import { VerifyJwtToken } from "./middleware/auth";
import { AuthService } from "./module/auth/auth.service";
import { TokenAuth } from "./module/auth/auth.model";
import { AuthController } from "./module/auth/auth.controller";

// set origin cors options
const listOrigin = process.env.SAHABAT_CORS_ORIGIN?.split(",");
const corsOptions = {
  origin: listOrigin || ["*"],
  method: ['GET', 'POST', 'PUT', 'DELETE'],
  optionsSuccessStatus: 200,
  credentials: true
}

const prefixV1 = '/api/v1';
export class App {
    public SetupMiddleware(app: express.Application): void {
        app.use(cors(corsOptions));
        app.use(express.json());
        app.use(express.urlencoded({extended: true}))
        app.use(VerifyJwtToken(prefixV1));
      }

    public SetupRoutes(app: express.Application): void {
        // service dependency injection
        const userService = new UserService(AppDataSource.getRepository(User));
        const authService = new AuthService(AppDataSource.getRepository(TokenAuth));

        // controller dependency injection
        const userController = new UserController(userService);
        const authController = new AuthController(authService, userService);

        // routes register
        app.use(`${prefixV1}/users`, userController.router);
        app.use(`${prefixV1}/auth`, authController.router);
    }

    public SetupErrorHandling(app: express.Application): void {
      app.use(ErrorHandler);
    }
}