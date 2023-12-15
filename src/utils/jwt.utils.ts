import jwt from "jsonwebtoken";
import config from "config";

const privateKey = config.get<string>("ACCESS_TOKEN_PRIVATE_KEY");
const publicKey = config.get<string>("ACCESS_TOKEN_PUBLIC_KEY");

export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJwt(token: string) {
  try {
    console.log("This is the verify token function");
    console.log(token);

    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    console.log(e);
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}
