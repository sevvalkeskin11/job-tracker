import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import { signToken } from "../utils/jwt";
import { LoginInput, RegisterInput } from "../schemas/auth.schema";

const SALT_ROUNDS = 10;

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AppError(409, "Email is already registered");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { email: input.email, passwordHash },
  });

  const token = signToken({ userId: user.id });
  return { token, user: { id: user.id, email: user.email } };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const isValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isValid) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = signToken({ userId: user.id });
  return { token, user: { id: user.id, email: user.email } };
}
