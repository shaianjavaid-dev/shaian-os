// Prints a SITE_PASSWORD_HASH for server.mjs. Prompts so the password never
// lands in shell history. Usage: npm run hash-password
import crypto from "node:crypto";
import readline from "node:readline";

const N = 1 << 15; // scrypt cost (~50ms on a laptop; brute force is bounded by the network anyway)

function prompt(q) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    const orig = rl._writeToOutput;
    rl.question(q, (a) => {
      rl._writeToOutput = orig;
      process.stdout.write("\n");
      rl.close();
      resolve(a);
    });
    rl._writeToOutput = () => {}; // mute echo
  });
}

const fromEnv = process.env.PASSWORD; // non-interactive use (tests)
const pw = fromEnv ?? (await prompt("password: "));
if (!fromEnv) {
  const again = await prompt("again:    ");
  if (again !== pw) {
    console.error("passwords do not match");
    process.exit(1);
  }
}
if (pw.length < 12) {
  console.error("use at least 12 characters");
  process.exit(1);
}
const salt = crypto.randomBytes(16);
const key = crypto.scryptSync(pw, salt, 64, { N, r: 8, p: 1, maxmem: 256 * 1024 * 1024 });
console.log(`scrypt$${N}$${salt.toString("hex")}$${key.toString("hex")}`);
