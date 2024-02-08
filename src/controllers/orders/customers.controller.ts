import { CustomerRepository } from "../../repository/customer.repository";
import { Controller } from "../controller";

export class CustomersController implements Controller {
  path = "/customers";

  repository = new CustomerRepository();

  configueRoutes(app: any) {
    app.get(this.path, async (req: any, res: any) => {
      res.json(await this.findAll());
    });

    app.post(this.path, async (req: any, res: any) => {
      const body = req.body;
      res.json(await this.add(body));
    });

    app.put(`${this.path}/:id`, async (req: any, res: any) => {
      const id = req.params.id;
      const body = req.body;
      res.json(await this.edit(id, body));
    });

    app.delete(`${this.path}/:id`, async (req: any, res: any) => {
      const id = req.params.id;
      res.json(await this.remove(id));
    });
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async add(body: any) {
    return await this.repository.add(body);
  }

  async edit(id: any, body: any) {
    return await this.repository.edit(id, body);
  }

  async remove(id: any) {
    return await this.repository.remove(id);
  }
}
