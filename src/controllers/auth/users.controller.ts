import { UserRepository } from "../../repository/user.repository";
import { Controller } from "./../controller";

export class UsersController implements Controller {
  path = "/users";

  userRepository = new UserRepository();

  configueRoutes(app: any) {
    app.get(this.path, async (req: any, res: any) => {
      res.json(await this.findAll());
    });

    app.post(this.path, async (req: any, res: any) => {
      const body = req.body;

      res.json(await this.add(body));
    });
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async add(user: any) {
    return await this.userRepository.add(user);
  }
}
