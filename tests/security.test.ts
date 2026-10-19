import { signStaffToken, verifyStaffToken } from "../lib/jwt";

/** Dashboard session token checks (run: npx tsc -p . && node on the output, or via any TS runner). */
function runSecurityTests() {
  const secret = "s".repeat(48);
  const token = signStaffToken({ sub: "owner", email: "", name: "Nirmal" }, secret, 60);

  if (!verifyStaffToken(token, secret)) throw new Error("valid token rejected");
  if (verifyStaffToken(token, "x".repeat(48))) throw new Error("token accepted with wrong secret");

  const [h, , s] = token.split(".");
  const forgedBody = Buffer.from(JSON.stringify({ sub: "owner", email: "", name: "x", exp: 9999999999 })).toString("base64url");
  if (verifyStaffToken(`${h}.${forgedBody}.${s}`, secret)) throw new Error("tampered token accepted");

  const expired = signStaffToken({ sub: "owner", email: "", name: "Nirmal" }, secret, -10);
  if (verifyStaffToken(expired, secret)) throw new Error("expired token accepted");

  console.log("✓ dashboard session token: valid / wrong secret / tampered / expired");
}

runSecurityTests();
