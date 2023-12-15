import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import { log } from "console";

export interface UserInput {
  email: string;
  name: string;
  password: string;
}

export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  let user = this as UserDocument;
  if (!user.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.hash(
    this.password,
    config.get<number>("saltWorkFactor")
  );
  this.password = salt;
  return next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;
  log("This is the user password");
  log(user.password);
  log("This is the candidate Password");
  log(candidatePassword);
  return await bcrypt.compare(candidatePassword, user.password);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
