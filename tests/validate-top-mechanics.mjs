import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const [html, config] = await Promise.all([
  readFile(new URL("index.html", root), "utf8"),
  readFile(new URL("physics-audit.json", root), "utf8").then(JSON.parse)
]);

let checks = 0;
const assert = (condition, label) => {
  if (!condition) throw new Error(`陀螺力學驗證失敗：${label}`);
  checks += 1;
};

const { tiltDeg, torqueDirection } = config.diagram;
const { massKg: m, centerToContactM: r, angularSpeedRadS: omega, momentOfInertiaKgM2: inertia, gravityMS2: g } = config.sample;
const theta = tiltDeg * Math.PI / 180;

// Physics coordinates: x right, y up, z out of the page. The top leans left.
const lever = { x: -r * Math.sin(theta), y: r * Math.cos(theta) };
const gravity = { x: 0, y: -m * g };
const torqueZ = lever.x * gravity.y - lever.y * gravity.x;
const torqueMagnitude = m * g * r * Math.sin(theta);
const angularMomentum = inertia * omega;
const steadyPrecessionEstimate = torqueMagnitude / angularMomentum;

assert(config.system === "tilted-axis spinning top", "系統類型正確");
assert(html.includes('id="top-mechanics-diagram"'), "SVG 力學圖存在");
assert(html.includes(`data-tilt-deg="${tiltDeg}"`), "SVG 傾角與稽核設定一致");
assert(torqueDirection === "out-of-page" && torqueZ > 0, "左傾且重力向下時，對接觸點的力矩指向紙面外");
assert(Math.abs(torqueZ - torqueMagnitude) < 1e-12, "向量叉積與 mgr sinθ 的力矩量值一致");
assert(Math.abs(m * g * r * Math.sin(0)) < 1e-12, "完全直立時重力力矩為零");
assert(angularMomentum > 0 && Number.isFinite(angularMomentum), "L≈Iω 的樣本值有效");
assert(steadyPrecessionEstimate > 0 && Number.isFinite(steadyPrecessionEstimate), "Ω≈τ/L 的快速穩定進動估計有效");
assert(html.includes("L ≈ Iω") && html.includes("τ = r × mg") && html.includes("dL／dt = τ"), "三項核心關係式均顯示於教材");
assert(html.includes("方向反抗接觸點的相對滑動，不一定固定向左或向右"), "摩擦方向說明避免固定方向迷思");

console.log(`通過 ${checks} 項陀螺力學定量與方向驗證；樣本 τ=${torqueMagnitude.toFixed(4)} N·m、L=${angularMomentum.toFixed(4)} kg·m²/s、Ω≈${steadyPrecessionEstimate.toFixed(3)} rad/s。`);
