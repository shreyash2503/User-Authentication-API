import { Request, Response } from "express";
import { validatePassword } from "../service/user.service";
import {
  createSession,
  findSession,
  updateSession,
} from "../service/session.service";
import { signJwt } from "../utils/jwt.utils";
import config from "config";
import { log } from "console";

export async function createUserSessionHandler(req: Request, res: Response) {
  // validate the password
  log(req.body);
  const user = await validatePassword(req.body);
  log(user);

  if (!user) {
    return res.status(401).send("Invalid username or password");
  }

  // create a session
  const session = await createSession(user._id, req.get("user-agent") || "");
  // create access token

  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get<string>("expiresIn") }
  );

  log(accessToken);

  // create a refresh token

  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get<string>("refreshTokenExpiresIn") }
  );
  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;
  console.log(userId);
  const sessions = await findSession({ user: userId, valid: true });
  return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;
  await updateSession({ _id: sessionId }, { valid: false });
  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}
