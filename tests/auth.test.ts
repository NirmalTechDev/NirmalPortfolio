import { formatCurrency, formatNumber, timeAgo } from "../lib/utils";
import { MOCK_ADMIN_USER } from "../lib/constants";

function runTests() {
  console.log("▶ Running Command Center Core Tests...");

  // Test 1: Currency Formatter
  const formattedCurrency = formatCurrency(250000);
  if (!formattedCurrency.includes("2,50,000")) {
    throw new Error(`Test 1 Failed: formatCurrency(250000) returned ${formattedCurrency}`);
  }
  console.log("  ✓ Test 1 Passed: formatCurrency");

  // Test 2: Number Scaler
  const scaledK = formatNumber(42800);
  if (scaledK !== "42.8k") {
    throw new Error(`Test 2 Failed: formatNumber(42800) returned ${scaledK}`);
  }
  console.log("  ✓ Test 2 Passed: formatNumber");

  // Test 3: Admin Mock Data
  if (!MOCK_ADMIN_USER.email || !MOCK_ADMIN_USER.role) {
    throw new Error("Test 3 Failed: MOCK_ADMIN_USER missing critical staff fields");
  }
  console.log("  ✓ Test 3 Passed: Admin Mock user schema");

  console.log("🎉 All 3 Core Unit Tests Passed Successfully!");
}

runTests();
