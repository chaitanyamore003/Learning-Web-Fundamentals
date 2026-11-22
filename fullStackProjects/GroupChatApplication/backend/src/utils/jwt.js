// src/utils/jwt.js
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  throw new Error("JWT_SECRET is missing from .env");
}

const EXPIRES_IN = "7d";

/**
 * Sign a JWT. Payload should be minimal — only { id } in our case.
 * JWT is signed, not encrypted — anyone can read the payload.
 */
export const signToken = (payload) =>
  jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });

/**
 * Verify a JWT. Throws if missing / expired / bad signature.
 * Shared by the HTTP middleware and (later) the Socket.IO handshake.
 */
export const verifyToken = (token) => jwt.verify(token, SECRET);
