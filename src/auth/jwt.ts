import { SignJWT, jwtVerify } from "jose";
import { Google } from "~/providers/google/types";

export async function encode(
  user: Google.UserResponse,
  secret: string,
  exp: number
) {
  if (!user) {
    throw new Error("Unauthorized, user not found!");
  }

  if (!secret) {
    throw new Error("Unauthorized, JWT secret not found!");
  }
  const secretKey = new TextEncoder().encode(secret);
  return await new SignJWT({
    id: user?.id,
    email: user?.email,
    name: user?.name,
    exp,
  })
    .setProtectedHeader({ alg: "HS256" })
    .sign(secretKey);
}

export async function decode(encodedToken: string, secret: string) {
  if (!encodedToken) {
    throw new Error("Unauthorized, no token provided!");
  }

  if (!secret) {
    throw new Error("Unauthorized, JWT secret not found!");
  }

  const secretKey = new TextEncoder().encode(secret);
  const { payload } = await jwtVerify(encodedToken, secretKey);
  console.log("[payload]", payload);
  return payload;
}
