import fs from "fs";
import { storagePut } from "../server/storage";

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

async function main() {
  for (const photo of photos) {
    try {
      const buffer = fs.readFileSync(photo.file);
      const { url } = await storagePut(photo.key, buffer, "image/jpeg");
      console.log(`${photo.key}: ${url}`);
    } catch (e: any) {
      console.error(`Failed ${photo.key}: ${e.message}`);
    }
  }
}

main();
