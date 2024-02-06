import { Controller } from "./controller";

export class ItsAliveController implements Controller {
  pathName() {
    return "/";
  }

  configueRoutes(app: any) {
    app.get("/", (req: any, res: any) => {
      res.json({ message: "It's alive!" });
    });
  }

  itsAlive(req: any, res: any) {
    res.json({ message: "It's alive!" });
  }
}
