import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const workspace = readFileSync(new URL("../app/workspace/page.tsx", import.meta.url), "utf8");
const layout = readFileSync(new URL("../app/workspace/layout.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

const required = [
  ["simulator disclosure", "Anda sedang melihat lingkungan simulasi"],
  ["no-real-send disclosure", "Tidak ada pesan nyata yang dikirim"],
  ["unread filter", '<option>Belum dibaca</option>'],
  ["unread reset on selection", "unread:0"],
  ["status transition handler", "function updateStatus(status:string)"],
  ["status control label", 'aria-label="Ubah status percakapan"'],
  ["mobile navigation control", 'aria-label={mobileNavOpen?"Tutup menu":"Buka menu"}'],
  ["mobile navigation close backdrop", 'aria-label="Tutup menu navigasi"'],
  ["search accessible label", 'placeholder="Cari pelanggan atau pesan..."'],
  ["reply accessible label", 'aria-label="Tulis balasan simulasi"'],
  ["empty state", "Tidak ada percakapan"],
  ["toast status announcement", 'role="status"'],
];
for (const [name, snippet] of required) {
  assert.ok(workspace.includes(snippet), `Workspace safety/UX check failed: ${name}`);
}

assert.match(layout, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/, "Simulator workspace must remain noindex until real customer access is secured.");
assert.ok(!/\b(fetch|axios)\s*\(/.test(workspace), "Simulator must not make real outbound requests or imply messages are sent.");
assert.ok(css.includes(".sidebar.mobileopen") && css.includes(".navscrim"), "Mobile navigation styles and dismissible backdrop must exist.");
assert.ok(workspace.includes("Balasan simulasi ditambahkan"), "Reply action must be explicitly simulator-only.");

console.log(`Workspace safety checks passed (${required.length + 3} assertions).`);
