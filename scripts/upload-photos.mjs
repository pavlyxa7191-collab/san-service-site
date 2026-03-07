import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Use the same S3 setup as the project storage
const s3 = new S3Client({
  region: process.env.S3_REGION || "us-east-1",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: true,
});

const BUCKET = process.env.S3_BUCKET || "";
const BASE_URL = process.env.S3_BASE_URL || "";

const photos = [
  { file: "/home/ubuntu/upload/DSC04052.JPG", key: "site-photos/hero.jpg" },
  { file: "/home/ubuntu/upload/DSC04109.JPG", key: "site-photos/specialist.jpg" },
  { file: "/home/ubuntu/upload/DSC04163.JPG", key: "site-photos/kitchen.jpg" },
  { file: "/home/ubuntu/upload/DSC04222.JPG", key: "site-photos/room.jpg" },
  { file: "/home/ubuntu/upload/DSC04285.JPG", key: "site-photos/products.jpg" },
  { file: "/home/ubuntu/upload/DSC04179.JPG", key: "site-photos/process.jpg" },
  { file: "/home/ubuntu/upload/DSC04260.JPG", key: "site-photos/work.jpg" },
  { file: "/home/ubuntu/upload/DSC04201.JPG", key: "site-photos/team.jpg" },
  { file: "/home/ubuntu/upload/IMG_4618.jpeg", key: "site-photos/equipment.jpg" },
  { file: "/home/ubuntu/upload/IMG_4695.jpeg", key: "site-photos/spray.jpg" },
];

console.log("Uploading photos to S3...");
console.log("Bucket:", BUCKET);
console.log("Base URL:", BASE_URL);

for (const photo of photos) {
  try {
    const buffer = fs.readFileSync(photo.file);
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: photo.key,
      Body: buffer,
      ContentType: "image/jpeg",
    }));
    const url = `${BASE_URL}/${photo.key}`;
    console.log(`✓ ${path.basename(photo.file)} → ${url}`);
  } catch (e) {
    console.error(`✗ ${photo.file}: ${e.message}`);
  }
}
