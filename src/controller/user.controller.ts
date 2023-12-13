import { Request, Response } from "express";
import log from "../utils/logger";
import { createUser } from "../service/user.service";
import { CreateUserInput } from "../schema/user.schema";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    console.log(req.body);
    const user = await createUser(req.body);
    return res.send(user);
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message); //! 409 is conflict
  }
}
