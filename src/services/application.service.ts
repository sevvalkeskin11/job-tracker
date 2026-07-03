import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import { CreateApplicationInput, UpdateApplicationInput } from "../schemas/application.schema";

export async function listApplications(userId: string) {
  return prisma.application.findMany({
    where: { userId },
    orderBy: { appliedDate: "desc" },
  });
}

export async function getApplication(userId: string, id: string) {
  const application = await prisma.application.findFirst({ where: { id, userId } });
  if (!application) {
    throw new AppError(404, "Application not found");
  }
  return application;
}

export async function createApplication(userId: string, input: CreateApplicationInput) {
  return prisma.application.create({
    data: { ...input, userId },
  });
}

export async function updateApplication(
  userId: string,
  id: string,
  input: UpdateApplicationInput
) {
  await getApplication(userId, id);
  return prisma.application.update({
    where: { id },
    data: input,
  });
}

export async function deleteApplication(userId: string, id: string) {
  await getApplication(userId, id);
  await prisma.application.delete({ where: { id } });
}
