import { env } from "../config/env";
import { prisma } from "../config/prisma";
import { redis } from "../config/redis";
import { AppError } from "../utils/AppError";
import { CreateApplicationInput, UpdateApplicationInput } from "../schemas/application.schema";

const CACHE_TTL_SECONDS = 60;

function applicationsCacheKey(userId: string): string {
  return `applications:user:${userId}`;
}

async function invalidateApplicationsCache(userId: string): Promise<void> {
  if (!env.cacheEnabled) return;
  const pattern = `${applicationsCacheKey(userId)}:page:*`;
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
export async function listApplications(userId: string, page: number, limit: number) {
  const cacheKey = `${applicationsCacheKey(userId)}:page:${page}:limit:${limit}`;

  if (env.cacheEnabled) {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  }

  const skip = (page - 1) * limit;

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where: { userId },
      orderBy: { appliedDate: "desc" },
      skip,
      take: limit,
    }),
    prisma.application.count({ where: { userId } }),
  ]);

  const result = {
    data: applications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  if (env.cacheEnabled) {
    await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL_SECONDS);
  }

  return result;
}

export async function getApplication(userId: string, id: string) {
  const application = await prisma.application.findFirst({ where: { id, userId } });
  if (!application) {
    throw new AppError(404, "Application not found");
  }
  return application;
}

export async function createApplication(userId: string, input: CreateApplicationInput) {
  const application = await prisma.application.create({
    data: { ...input, userId },
  });
  await invalidateApplicationsCache(userId);
  return application;
}

export async function updateApplication(
  userId: string,
  id: string,
  input: UpdateApplicationInput
) {
  await getApplication(userId, id);
  const application = await prisma.application.update({
    where: { id },
    data: input,
  });
  await invalidateApplicationsCache(userId);
  return application;
}

export async function deleteApplication(userId: string, id: string) {
  await getApplication(userId, id);
  await prisma.application.delete({ where: { id } });
  await invalidateApplicationsCache(userId);
}
