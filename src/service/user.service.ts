import UserModel from "../models/user.model";
import { UserInput } from "../models/user.model";

export async function createUser(input: UserInput) {
  try {
    return await UserModel.create(input);
  } catch (e: any) {
    throw new Error(e);
  }
}
