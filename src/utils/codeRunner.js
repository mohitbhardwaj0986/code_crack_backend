import { exec } from "child_process";
import fs from "fs";
import { v4 as uuid } from "uuid";

export const runUserCode = (code) => {
  return new Promise((resolve, reject) => {
    const filename = `./public/temp/${uuid()}.js`;
    fs.writeFileSync(filename, code);

    const process = exec(`node ${filename}`, { timeout: 5000 }, (err, stdout, stderr) => {
      fs.unlinkSync(filename);

      if (err || stderr) {
        return reject(new Error(stderr || err.message));
      }

      const output = stdout.trim().split("\n");
      const passed = output.every((line) => line.includes("✅"));

      resolve({ passed, details: output });
    });

    // Handle unresponsive or malicious code
    process.on("error", (error) => {
      reject(new Error("Execution error: " + error.message));
    });
  });
};
