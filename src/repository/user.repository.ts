import bcrypt from "bcrypt";
import { User, UserModel } from "./../models/user.model";

export class UserRepository {
  async add(user: User) {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 12);
    }

    return await UserModel.create(user);
  }

  async findAll() {
    return await UserModel.find({}).lean();
  }
}
