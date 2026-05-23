import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET!;

export type TokenPayload = {
  email: string;
  role: string;
};

export function signJwt(payload: TokenPayload) {
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}

export function verifyJwt(token: string) {
  return jwt.verify(token, secret) as TokenPayload;
}