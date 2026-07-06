import request from "supertest";
import { app } from "./testApp";
import { prisma } from "../src/config/prisma";

function uniqueEmail() {
  return `jest-${Date.now()}-${Math.random().toString(36).slice(2)}@test.local`;
}

async function registerAndLogin() {
  const email = uniqueEmail();
  const res = await request(app)
    .post("/api/auth/register")
    .send({ email, password: "password123" });
  return res.body.token as string;
}

describe("Application endpoints", () => {
  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { endsWith: "@test.local" } } });
    await prisma.$disconnect();
  });

  it("rejects unauthenticated requests", async () => {
    const res = await request(app).get("/api/applications");
    expect(res.status).toBe(401);
  });

  it("creates and lists an application for the authenticated user", async () => {
    const token = await registerAndLogin();

    const createRes = await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${token}`)
      .send({
        company: "Acme Corp",
        position: "Backend Engineer",
        appliedDate: "2026-06-15",
        notes: "Test note",
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.company).toBe("Acme Corp");

    const listRes = await request(app)
      .get("/api/applications")
      .set("Authorization", `Bearer ${token}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body.data).toHaveLength(1);
    expect(listRes.body.pagination.total).toBe(1);
  });

  it("updates an application's status", async () => {
    const token = await registerAndLogin();
    const createRes = await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${token}`)
      .send({ company: "Globex", position: "Frontend Dev", appliedDate: "2026-06-01" });

    const id = createRes.body.id;

    const updateRes = await request(app)
      .patch(`/api/applications/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "INTERVIEW" });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.status).toBe("INTERVIEW");
  });

  it("deletes an application and returns 404 afterward", async () => {
    const token = await registerAndLogin();
    const createRes = await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${token}`)
      .send({ company: "Initech", position: "QA Engineer", appliedDate: "2026-05-01" });

    const id = createRes.body.id;

    const deleteRes = await request(app)
      .delete(`/api/applications/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(deleteRes.status).toBe(204);

    const getRes = await request(app)
      .get(`/api/applications/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(getRes.status).toBe(404);
  });

  it("does not allow one user to see another user's applications", async () => {
    const tokenA = await registerAndLogin();
    const tokenB = await registerAndLogin();

    await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ company: "UserA Co", position: "Engineer", appliedDate: "2026-06-01" });

    const listResB = await request(app)
      .get("/api/applications")
      .set("Authorization", `Bearer ${tokenB}`);

    expect(listResB.body.data).toHaveLength(0);
  });
});