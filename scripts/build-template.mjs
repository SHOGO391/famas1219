// Next.js gives a top-level app/ precedence over src/app/. The reservation
// application lives in app/, so build the preserved root template in isolation.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "famas-template-"));
try {
  for (const name of ["src", "public", "package.json", "tsconfig.json", "next.config.ts", "postcss.config.mjs"]) {
    fs.cpSync(path.join(root, name), path.join(temporary, name), { recursive: true });
  }
  // Reuse the checked-in root lockfile's installed dependencies without scripts,
  // an extra network install, or copying the nested application into the build.
  fs.symlinkSync(path.join(root, "node_modules"), path.join(temporary, "node_modules"),
    process.platform === "win32" ? "junction" : "dir");
  execFileSync(process.execPath, [path.join(root, "node_modules/next/dist/bin/next"), "build", "--webpack"], {
    cwd: temporary, stdio: "inherit", env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
  });
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
