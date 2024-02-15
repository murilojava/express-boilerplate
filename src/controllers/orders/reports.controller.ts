import * as fs from "fs";
import { BadRequestError } from "../../core/erros/bad-request-error";
import { rabbitMQServiceInstance } from "../../queues/rabbitmq";
import { Controller } from "../controller";

export class ReportsController implements Controller {
  path = "/reports";

  configueRoutes(app: any) {
    app.get(this.path, async (req: any, res: any, next: any) => {
      try {
        const fileName = await this.getReport(req.query);
        res.download(fileName);
      } catch (e) {
        next(e);
      }
    });

    app.post(this.path, async (req: any, res: any, next: any) => {
      try {
        const body = req.body;
        res.json(await this.generateReport(body));
      } catch (e) {
        next(e);
      }
    });
  }

  async getReport(query: any) {
    const { key } = query;
    if (!key) throw new BadRequestError("key is required");

    const file = `./reports/${key}.pdf`;

    if (!fs.existsSync(file)) throw new BadRequestError("Report not found");

    return file;
  }

  async generateReport(body: any) {
    const { clientId } = body;

    if (!clientId) throw new BadRequestError("clientId is required");

    rabbitMQServiceInstance.publish("", "jobs", new Buffer(`${clientId}`));

    return clientId;
  }
}
