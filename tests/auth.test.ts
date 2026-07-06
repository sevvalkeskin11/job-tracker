import request from "supertest";
import { app } from "./testApp";
import { prisma } from "../src/config/prisma";

function uniqueEmail() {
  return `jest-${Date.now()}-${Math.random().toString(36).slice(2)}@test.local`;
}

describe("Auth endpoints", () => {
  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { endsWith: "@test.local" } } });
    await prisma.$disconnect();
  });

  it("registers a new user and returns a token", async () => {
    const email = uniqueEmail();
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email, password: "password123" });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it("rejects duplicate email registration", async () => {
    const email = uniqueEmail();
    await request(app).post("/api/auth/register").send({ email, password: "password123" });

    const res = await request(app)
      .post("/api/auth/register")
      .send({ email, password: "password123" });

    expect(res.status).toBe(409);
  });

  it("logs in with correct credentials", async () => {
    const email = uniqueEmail();
    await request(app).post("/api/auth/register").send({ email, password: "password123" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("rejects login with wrong password", async () => {
    const email = uniqueEmail();
    await request(app).post("/api/auth/register").send({ email, password: "password123" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password: "wrongpassword" });

    expect(res.status).toBe(401);
  });
});