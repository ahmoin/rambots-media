import satori from "satori";
import sharp from "sharp";
import fs from "fs";
import readline from "readline";

const MCSM_BLUE = "#2e3192";
const colors = [MCSM_BLUE, "#ffffff"];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const validFormats = ["png", "jpg", "svg"];

const format = await new Promise((resolve) => {
  rl.question(
    `What format would you like? (${validFormats.join(", ")}): `,
    (answer) => {
      const selectedFormat = answer.toLowerCase();
      if (validFormats.includes(selectedFormat)) {
        resolve(selectedFormat);
      } else {
        console.log("Invalid format, defaulting to PNG");
        resolve("png");
      }
    }
  );
});

rl.close();

let ramHeadSvg = fs.readFileSync("./ram-head.svg", "utf-8");
ramHeadSvg = ramHeadSvg.replace(/<path/g, `<path fill="${MCSM_BLUE}"`);
const ramHeadSvgBuffer = Buffer.from(ramHeadSvg);
const ramHeadSvgBase64 = `data:image/svg+xml;base64,${ramHeadSvgBuffer.toString(
  "base64"
)}`;

const fontBuffer = fs.readFileSync("./Geist-Medium.otf");

const colorSquares = colors.map((color) => ({
  type: "div",
  props: {
    style: {
      width: `${100 / colors.length}%`,
      height: "100%",
      backgroundColor: color,
    },
  },
}));

const mainSvgBuffer = await satori(
  {
    type: "div",
    props: {
      style: {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        fontSize: 384,
        fontWeight: 600,
        fontFamily: "Geist",
      },
      children: [
        {
          type: "img",
          props: {
            src: ramHeadSvgBase64,
            width: 2000,
            height: 1255,
          },
        },
        {
          type: "div",
          props: {
            style: { marginTop: 40, color: MCSM_BLUE },
            children: "Rambots",
          },
        },
        {
          type: "div",
          props: {
            style: {
              width: "100%",
              height: 100,
              display: "flex",
              flexDirection: "row",
              marginTop: "auto",
            },
            children: colorSquares,
          },
        },
      ],
    },
  },
  {
    width: 2000,
    height: 2000,
    fonts: [
      {
        name: "Geist",
        data: fontBuffer,
        weight: 600,
        style: "normal",
      },
    ],
    debug: false,
  }
);

if (format === "svg") {
  fs.writeFileSync("output.svg", mainSvgBuffer);
} else {
  const sharpInstance = sharp(Buffer.from(mainSvgBuffer));
  if (format === "jpg") {
    await sharpInstance.jpeg().toFile("output.jpg");
  } else {
    await sharpInstance.png().toFile("output.png");
  }
}

console.log(`Generated output.${format}`);
