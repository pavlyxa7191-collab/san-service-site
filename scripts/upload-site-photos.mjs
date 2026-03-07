/**
 * Upload site photos to project S3 storage for permanent CDN URLs
 * Uses same method as server/storage.ts storagePut
 * Run: node scripts/upload-site-photos.mjs
 */
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import FormData from "form-data";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

// Load env
dotenv.config({ path: join(rootDir, ".env") });

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;

if (!FORGE_API_URL || !FORGE_API_KEY) {
  console.error("Missing BUILT_IN_FORGE_API_URL or BUILT_IN_FORGE_API_KEY");
  process.exit(1);
}

console.log("Using API URL:", FORGE_API_URL);

const baseUrl = FORGE_API_URL.replace(/\/+$/, "");

function normalizeKey(key) {
  return key.replace(/^\/+/, "");
}

async function uploadPhoto(localPath, storageKey) {
  if (!existsSync(localPath)) {
    console.warn(`File not found: ${localPath}`);
    return null;
  }
  
  const fileBuffer = readFileSync(localPath);
  const key = normalizeKey(storageKey);
  const filename = key.split("/").pop() ?? key;
  
  const uploadUrl = new URL(`v1/storage/upload`, baseUrl + "/");
  uploadUrl.searchParams.set("path", key);
  
  const formData = new FormData();
  formData.append("file", fileBuffer, {
    filename,
    contentType: "image/jpeg",
  });
  
  const response = await fetch(uploadUrl.toString(), {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${FORGE_API_KEY}`,
      ...formData.getHeaders(),
    },
    body: formData.getBuffer(),
  });
  
  if (!response.ok) {
    const text = await response.text();
    console.error(`Upload failed for ${storageKey}: ${response.status} ${text}`);
    return null;
  }
  
  const result = await response.json();
  console.log(`✓ Uploaded ${storageKey}: ${result.url}`);
  return result.url;
}

const assetsDir = join(rootDir, "..", "webdev-static-assets");

const photoMap = [
  { local: join(assetsDir, "photo-hero.jpg"),       key: "site-photos/hero.jpg" },
  { local: join(assetsDir, "photo-specialist.jpg"), key: "site-photos/specialist.jpg" },
  { local: join(assetsDir, "photo-kitchen.jpg"),    key: "site-photos/kitchen.jpg" },
  { local: join(assetsDir, "photo-room.jpg"),       key: "site-photos/room.jpg" },
  { local: join(assetsDir, "photo-products.jpg"),   key: "site-photos/products.jpg" },
  { local: join(assetsDir, "photo-process.jpg"),    key: "site-photos/process.jpg" },
  { local: join(assetsDir, "photo-work.jpg"),       key: "site-photos/work.jpg" },
  { local: join(assetsDir, "photo-team.jpg"),       key: "site-photos/team.jpg" },
  { local: join(assetsDir, "photo-equipment.jpg"),  key: "site-photos/equipment.jpg" },
  { local: join(assetsDir, "photo-spray.jpg"),      key: "site-photos/spray.jpg" },
];

console.log("Uploading photos to project S3 storage...\n");

const results = {};
for (const { local, key } of photoMap) {
  const url = await uploadPhoto(local, key);
  if (url) {
    const shortKey = key.replace("site-photos/", "").replace(".jpg", "");
    results[shortKey] = url;
  }
}

console.log("\n=== CDN URLs ===");
console.log(JSON.stringify(results, null, 2));
