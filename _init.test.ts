import { App } from "./src/app";
import express from "express";
import * as dotenv from "dotenv";

dotenv.config();

function init(): void {
	const server = express();
	const initApp = new App();
	
	initApp.SetupMiddleware(server);
	initApp.SetupRoutes(server);
	initApp.SetupErrorHandling(server);

	global.expressApp = server;
}

init();