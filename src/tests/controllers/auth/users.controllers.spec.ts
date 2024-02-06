import { beforeEach, describe, expect, it } from "vitest";
import { UsersController } from "../../../controllers/auth/users.controller";

describe("Users Controller", () => {
  let usersController: UsersController;
  let users: any[] = [];

  beforeEach(() => {
    usersController = new UsersController();
    usersController.userRepository = {
      findAll: async () => {
        return users;
      },
      add: async (user: any) => {
        users.push(user);
        return user;
      },
    };
  });

  it("should return a empty array of users", async () => {
    const res = await usersController.findAll();
    expect(res).length(0);
  });

  it("should add a user", async () => {
    const newUser = {
      /* your user data here */
      name: "John Doe",
      email: "teste@teste.com",
      password: "123456",
    };

    const res = await usersController.add(newUser);
    expect(res).toEqual(newUser);
  });

  it("should return one user from find all", async () => {
    const res = await usersController.findAll();
    expect(res).length(1);
  });
});
