import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { UsersController } from "./controllers/auth/users.controller";
import { Controller } from "./controllers/controller";
import { ItsAliveController } from "./controllers/its-alive.controller";
import { CustomersController } from "./controllers/orders/customers.controller";
import { ReportsController } from "./controllers/orders/reports.controller";
import { BadRequestError } from "./core/erros/bad-request-error";
import { rabbitMQServiceInstance } from "./queues/rabbitmq";

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
    this.initRabbitMQ();
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

  handleErrors() {
    console.log("Handling errors");
    this.app.use((err: any, req: any, res: any, next: any) => {
      console.error(`Error: ${err.message}`);
      if (err instanceof BadRequestError) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Something went wrong" });
      }
    });
  }

  private initializeControllers(controllers: Array<Controller>) {
    controllers.forEach((controller) => {
      controller.configueRoutes(this.app);
    });
  }

  public listen() {
    this.handleErrors();

    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  initRabbitMQ() {
    rabbitMQServiceInstance.init();
  }
}

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const serverApp = new App(port);
serverApp
  .init([
    new ItsAliveController(), //
    new UsersController(), //
    new CustomersController(), //
    new ReportsController(), //
  ])
  .then(() => {
    console.log("Server initialized!");
  });
