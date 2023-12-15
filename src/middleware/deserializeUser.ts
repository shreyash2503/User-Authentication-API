import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt.utils";
import { reIssueAccessToken } from "../service/session.service";

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let accessToken = get(req, "headers.authorization", "").replace(
    "/^Bearer/",
    ""
  );
  const refreshToken = get(req, "headers.x-refresh") as string;
  console.log(req.headers);
  console.log("accessToken", accessToken);
  accessToken = accessToken.split(" ")[1];
  console.log("accessToken", accessToken);

  if (!accessToken) {
    return next();
  }
  const { decoded, expired } = verifyJwt(accessToken);
  console.log("This is decoded");
  console.log(decoded);
  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = (await reIssueAccessToken({
      refreshToken,
    })) as string;
    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
    }

    const result = verifyJwt(newAccessToken);
    res.locals.user = result.decoded;
    return next();
  }

  return next();
};
