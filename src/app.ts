import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { UsersController } from "./controllers/auth/users.controller";
import { Controller } from "./controllers/controller";
import { ItsAliveController } from "./controllers/its-alive.controller";

class App {
  public app: express.Application;
  public port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
  }

  public async init(controllers: Array<any>) {
    await this.initializeDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.listen();
  }

  async initializeDatabase() {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not set");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected!");
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
  }

  private initializeControllers(controllers: Array<Controller>) {
    controllers.forEach((controller) => {
      controller.configueRoutes(this.app);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const serverApp = new App(port);
serverApp.init([new ItsAliveController(), new UsersController()]).then(() => {
  console.log("Server initialized!");
});