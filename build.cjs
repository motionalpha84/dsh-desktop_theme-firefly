/**
 * 构建脚本（本地精简定制版）：把 assets/ 下的壁纸以 base64 data-URI 内嵌进
 * lib/client.js（DSH 只服务 client.js 一个文件）。本版不再打包开屏 GIF、
 * 背景音乐、默认封面与表情包 —— 相关功能已从 client.template.js 中移除。
 * 用法：node build.cjs [--clean]
 * 幂等：用注释标记包裹数据段，重复运行会替换掉上一次注入的内容。
 */
const fs = require("fs");
const path = require("path");

const root = __dirname;
const templatePath = path.join(root, "lib", "client.template.js");
const clientPath = path.join(root, "lib", "client.js");
const assetsDir = path.join(root, "assets");

function b64(file) {
  return fs.readFileSync(file).toString("base64");
}
function mimeOf(ext) {
  switch (ext.toLowerCase()) {
    case ".mp4": return "video/mp4";
    case ".jpg": case ".jpeg": return "image/jpeg";
    case ".png": return "image/png";
    case ".webp": return "image/webp";
    default: return "application/octet-stream";
  }
}

// ── 0) 干净模式：--clean 时只打包 build.include.txt 里列出的壁纸 ──
const CLEAN = process.argv.includes("--clean");
let includeSet = null;
if (CLEAN) {
  const incPath = path.join(root, "build.include.txt");
  if (!fs.existsSync(incPath)) {
    console.error("ERROR: --clean 需要 build.include.txt 清单文件");
    process.exit(1);
  }
  includeSet = new Set(
    fs.readFileSync(incPath, "utf8")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"))
  );
  console.log(`clean mode: 仅打包 build.include.txt 里的 ${includeSet.size} 个壁纸`);
}

// ── 1) 壁纸清单 ──
const mediaExts = [".mp4", ".jpg", ".jpeg", ".png", ".webp"];
let files = fs.readdirSync(assetsDir).filter((f) => mediaExts.includes(path.extname(f).toLowerCase()));
if (CLEAN) {
  files = files.filter((f) => includeSet.has("assets/" + f));
}
files.sort();
const manifest = files.map((f) => {
  const mime = mimeOf(path.extname(f));
  return { id: f, kind: /\.mp4$/i.test(f) ? "video" : "image", mime, data: `data:${mime};base64,${b64(path.join(assetsDir, f))}`, label: f };
});
console.log("wallpapers:");
manifest.forEach((m) => console.log(`  ${m.kind.padEnd(5)} ${m.label}  (b64 ${(m.data.length / 1048576).toFixed(1)} MB)`));

// ── 2) 注入 ──
let src = fs.readFileSync(templatePath, "utf8");
const manifestJson = JSON.stringify(manifest);
src = src.replace(
  /\/\*__FIREFLY_BG_MANIFEST_START__\*\/[\s\S]*?\/\*__FIREFLY_BG_MANIFEST_END__\*\//,
  `/*__FIREFLY_BG_MANIFEST_START__*/${manifestJson}/*__FIREFLY_BG_MANIFEST_END__*/`
);
fs.writeFileSync(clientPath, src);
console.log(`OK: built lib/client.js = ${(src.length / 1048576).toFixed(1)} MB`);
