import crypto from "crypto";

// Simple password hashing using Node's crypto (for demonstration)
// In production, use bcryptjs: npm install bcryptjs
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(
  password: string,
  hashedPassword: string,
): boolean {
  const [salt, hash] = hashedPassword.split(":");
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}
