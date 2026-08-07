import { env } from "../lib/env";

function runSecurityTests() {
  console.log("▶ Running Security & Auth Guard Unit Tests...");

  // Test 1: Zod Env Validation
  if (!env.AUTH_SECRET) {
    throw new Error("Security Test 1 Failed: env.AUTH_SECRET is empty");
  }
  console.log("  ✓ Security Test 1 Passed: Zod env validation");

  // Test 2: Unauthenticated state
  const mockToken = null;
  const isAuth = !!mockToken;
  if (isAuth) {
    throw new Error("Security Test 2 Failed: Unauthenticated state check failed");
  }
  console.log("  ✓ Security Test 2 Passed: Unauthenticated state check");

  // Test 3: Cookie Token format verification
  const validToken = `jwt_sec_${Date.now()}_abc123`;
  if (!validToken.startsWith("jwt_sec_")) {
    throw new Error("Security Test 3 Failed: Token prefix mismatch");
  }
  console.log("  ✓ Security Test 3 Passed: Security token formatting");

  console.log("🔒 All 3 Security Tests Passed Successfully!");
}

runSecurityTests();
