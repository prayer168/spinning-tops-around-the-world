import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const read = name => readFile(new URL(name, root), "utf8");
const checks = [];
const assert = (condition, label) => {
  if (!condition) throw new Error(`驗證失敗：${label}`);
  checks.push(label);
};

const [html, content, quiz, resources, config] = await Promise.all([
  read("index.html"),
  read("data/content.json").then(JSON.parse),
  read("data/quiz.json").then(JSON.parse),
  read("data/resources.json").then(JSON.parse),
  read("project.config.json").then(JSON.parse)
]);

assert(config.language === "zh-TW", "教材語言設定為 zh-TW");
assert(config.version === "1.0.2", "專案版本為 1.0.2");

const tabs = html.match(/role="tab"/g) ?? [];
const panels = html.match(/role="tabpanel"/g) ?? [];
assert(tabs.length === 7, "共有 7 個無障礙頁籤");
assert(panels.length === 7, "共有 7 個對應頁籤面板");
assert((html.match(/<img\b/g) ?? []).length === 14, "教材頁面直接放置 14 張教學圖片");
assert(!/<img\b(?![^>]*\balt=)[^>]*>/i.test(html), "每張頁面圖片都有 alt 文字");

assert(content.scienceConcepts.length === 6, "旋轉科學包含 6 個核心概念");
assert(content.taiwanTops.length === 4, "臺灣陀螺包含 4 種類型");
assert(content.taiwanTops.every(item => item.image && item.alt && item.visualCaption), "四種臺灣陀螺各有獨立圖像、alt 與圖說");
assert(content.worldTops.length === 8, "世界圖鑑包含 8 個國家或地區條目");
assert(content.worldTops.every(item => /^https:\/\//.test(item.source)), "世界圖鑑各條目都有 HTTPS 機構來源");

assert(quiz.length === 8, "圖像判讀挑戰包含 8 題");
assert(quiz.every(item => item.options.length === 4), "每題包含 4 個選項");
assert(quiz.every(item => Number.isInteger(item.answer) && item.answer >= 0 && item.answer < item.options.length), "每題答案索引有效");
assert(quiz.every(item => item.explanation && item.reviewTab), "每題包含解析與回看頁籤");

assert(resources.length === 8, "自主學習包含 8 筆資源");
assert(resources.every(item => /^https:\/\//.test(item.url) && item.checkedAt === "2026-07-29"), "自主學習資源均有 HTTPS 網址與查核日期");

const expectedImages = [
  "atlas-china-diabolo.webp", "atlas-europe.webp", "atlas-india-seasia.webp",
  "atlas-japan-korea.webp", "atlas-mexico.webp", "hero-world-tops.webp",
  "safety-do-dont.webp", "science-anatomy.webp", "science-forces-overview.webp", "science-stages.webp",
  "science-variables.webp", "social-preview.png", "taiwan-games.webp",
  "taiwan-throw-steps.webp", "taiwan-top-battle.webp", "taiwan-top-finger.webp",
  "taiwan-top-rope.webp", "taiwan-top-whip.webp", "taiwan-wood-top.webp"
];
const imageDir = new URL("assets/images/", root);
const actualImages = (await readdir(imageDir)).sort();
assert(JSON.stringify(actualImages) === JSON.stringify(expectedImages), "Image 2.0 最終資產共 19 張且檔名正確");
for (const file of actualImages) {
  const info = await stat(join(fileURLToPath(imageDir), file));
  assert(info.size > 10_000, `${file} 不是空白或占位檔`);
}

assert(!/[A-Z]:\\|file:\/\//i.test(html), "HTML 不含本機絕對路徑");
assert(html.includes('id="sim-play"') && html.includes('id="sim-pause"') && html.includes('id="sim-reset"'), "模擬器具有播放、暫停與重設控制");
assert(html.includes('id="sequence-bank"') && html.includes('id="quiz-card"'), "排序活動與測驗容器存在");

console.log(`通過 ${checks.length} 項結構與資料驗證。`);
