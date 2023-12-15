import { omit } from "lodash";
import UserModel, { UserDocument } from "../models/user.model";
import { UserInput } from "../models/user.model";
import { log } from "console";
import { FilterQuery } from "mongoose";

export async function createUser(input: UserInput) {
  try {
    const user = await UserModel.create(input);
    log("This is the user");
    log(user);
    return omit(user.toJSON(), "password");
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  log("This is the password from the validatePassword function");
  log(password);
  const user = await UserModel.findOne({ email });
  log("This is the user");
  log(user);
  if (!user) return false;

  const isValid = await user.comparePassword(password);
  log("This is the isValid variable");
  log(isValid);
  if (!isValid) return false;
  return omit(user.toJSON(), "password");
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}
