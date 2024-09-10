// This file has been created related to a FAQ in readme.md
// Please note I only recommend running this file locally
// It'll convert all PNG/JPEG/JPG files in the "images" directory to WebP format with 90% quality
// You can change the script as needed
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputDir = "images";
const outputDir = "images-optimised";

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to process files recursively
const processDirectory = (dir) => {
  fs.readdir(dir, { withFileTypes: true }, (err, entries) => {
    if (err) {
      console.error("Error reading directory:", dir, err);
      return;
    }

    entries.forEach((entry) => {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(inputDir, fullPath);
      const outputFilePath = path.join(outputDir, relativePath);

      if (entry.isDirectory()) {
        // Ensure the output directory exists
        if (!fs.existsSync(outputFilePath)) {
          fs.mkdirSync(outputFilePath, { recursive: true });
        }
        // Recurse into the directory
        processDirectory(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (ext === ".png" || ext === ".jpeg" || ext === ".jpg") {
          // Convert PNG/JPEG/JPG file to WebP format with 90% quality
          sharp(fullPath)
            .webp({ quality: 90 })
            .toFile(
              outputFilePath.replace(/\.(png|jpeg|jpg)$/, ".webp"),
              (err, info) => {
                if (err) {
                  console.error("Error converting file:", fullPath, err);
                } else {
                  console.log(
                    "Converted:",
                    fullPath,
                    "to",
                    outputFilePath.replace(/\.(png|jpeg|jpg)$/, ".webp")
                  );
                }
              }
            );
        } else {
          // Copy non-PNG/JPEG/JPG files as they are
          fs.copyFile(fullPath, outputFilePath, (err) => {
            if (err) {
              console.error("Error copying file:", fullPath, err);
            } else {
              console.log("Copied:", fullPath, "to", outputFilePath);
            }
          });
        }
      }
    });
  });
};

// Start processing from the input directory
processDirectory(inputDir);
