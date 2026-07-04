import autocannon from "autocannon";

const BASE_URL = process.env.LOAD_TEST_BASE_URL ?? "http://localhost:3000";
const EMAIL = process.env.LOAD_TEST_EMAIL ?? "load-test@example.com";
const PASSWORD = process.env.LOAD_TEST_PASSWORD ?? "load-test-password";

async function getAuthToken(): Promise<string> {
  // Try to register the test user; ignore failure if it already exists.
  await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });

  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });

  if (!loginRes.ok) {
    throw new Error(`Login failed: ${loginRes.status} ${await loginRes.text()}`);
  }

  const { token } = (await loginRes.json()) as { token: string };
  return token;
}

async function main() {
  const token = await getAuthToken();

  const result = await autocannon({
    url: `${BASE_URL}/api/applications`,
    connections: 100,
    duration: 30,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(autocannon.printResult(result));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
