import { Request, Response } from "express";
import log from "../utils/logger";
import { createUser } from "../service/user.service";
import { CreateUserInput } from "../schema/user.schema";
import { omit } from "lodash";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    console.log(req.body);
    const user = await createUser(req.body);
    // return res.send(omit(user.toJSON(), "password"));
    return res.send(user);
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message); //! 409 is conflict
  }
}
