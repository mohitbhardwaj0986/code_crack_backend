import { exec } from "child_process";
import fs from "fs";
import { v4 as uuid } from "uuid";
import path from "path";

export const runUserCode = (code, language = "javascript") => {
  return new Promise((resolve, reject) => {
    const id = uuid();
    let filename, command;

    const tempDir = "./public/temp";
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });


    switch (language) {
      case "javascript":
        filename = path.join(tempDir, `${id}.js`);
        command = `node ${filename}`;
        break;

      case "python":
        filename = path.join(tempDir, `${id}.py`);
        command = `python ${filename}`;
        break;

      case "cpp":
        filename = path.join(tempDir, `${id}.cpp`);
        const outFile = path.join(tempDir, `${id}.out`);
        command = `g++ ${filename} -o ${outFile} && ${outFile}`;
        break;

      case "java":
        filename = path.join(tempDir, `${id}.java`);
        const className = `Main${id.replace(/-/g, "")}`;
        code = code.replace(/class\s+\w+/, `class ${className}`);
        filename = path.join(tempDir, `${className}.java`);
        command = `javac ${filename} && java -cp ${tempDir} ${className}`;
        break;

      default:
        return reject(new Error("Unsupported language"));
    }

    fs.writeFileSync(filename, code);

    exec(command, { timeout: 5000 }, (err, stdout, stderr) => {
      try {
        fs.unlinkSync(filename);
        if (language === "cpp") fs.unlinkSync(`${tempDir}/${id}.out`);
        if (language === "java") {
          const className = `Main${id.replace(/-/g, "")}`;
          fs.unlinkSync(`${tempDir}/${className}.class`);
        }
      } catch {}

      if (err || stderr) {
        return reject(new Error(stderr || err.message));
      }

      const output = stdout.trim().split("\n");
      const passed = output.every((line) => line.includes("✅"));
      resolve({ passed, details: output });
    });
  });
};
