import express from "express";
import * as dotenv from 'dotenv';
import { App } from "./app";
import { AppDataSource } from "./config/sql/datasource";

dotenv.config()

/*
    created by @marifsulaksono
*/

const StartServer = async () => {
    try {
        const server = express();
        const app = new App();
        const PORT = 3000;

        app.SetupMiddleware(server);
        app.SetupRoutes(server);
        app.SetupErrorHandling(server);

        AppDataSource.initialize().then(async () => {
            server.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}...`);
            });
            console.log('Success connect to database...');
        })
    } catch (error) {
        console.error('Error starting the server:', error);
    }
}

StartServer();