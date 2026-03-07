// Upload photos to project S3 storage for permanent CDN URLs
import { storagePut } from "./server/storage.js";
import fs from "fs";
import path from "path";

const photos = [
  { file: "/home/ubuntu/upload/DSC04052.JPG", key: "photos/photo-hero.jpg" },
  { file: "/home/ubuntu/upload/DSC04109.JPG", key: "photos/photo-specialist.jpg" },
  { file: "/home/ubuntu/upload/DSC04163.JPG", key: "photos/photo-kitchen.jpg" },
  { file: "/home/ubuntu/upload/DSC04222.JPG", key: "photos/photo-room.jpg" },
  { file: "/home/ubuntu/upload/DSC04285.JPG", key: "photos/photo-products.jpg" },
  { file: "/home/ubuntu/upload/DSC04179.JPG", key: "photos/photo-process.jpg" },
  { file: "/home/ubuntu/upload/DSC04260.JPG", key: "photos/photo-work.jpg" },
  { file: "/home/ubuntu/upload/DSC04201.JPG", key: "photos/photo-team.jpg" },
  { file: "/home/ubuntu/upload/IMG_4618.jpeg", key: "photos/photo-equipment.jpg" },
  { file: "/home/ubuntu/upload/IMG_4695.jpeg", key: "photos/photo-spray.jpg" },
];

for (const photo of photos) {
  try {
    const buffer = fs.readFileSync(photo.file);
    const { url } = await storagePut(photo.key, buffer, "image/jpeg");
    console.log(`${photo.key}: ${url}`);
  } catch (e) {
    console.error(`Failed ${photo.key}: ${e.message}`);
  }
}
