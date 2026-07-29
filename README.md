# 旋轉世界：各國陀螺文化與科學

以陀螺為入口，連結旋轉科學、臺灣童玩與世界文化的繁體中文互動教材。

## 專案狀態

目前版本：`v1.0.2`

- [線上教材](https://prayer168.github.io/spinning-tops-around-the-world/)
- [GitHub Repository](https://github.com/prayer168/spinning-tops-around-the-world)

## 教材內容

- 學習任務與學習進度
- 角動量、力矩、進動、摩擦與穩定性的圖解及模擬
- 臺灣常見陀螺、玩法與安全操作
- 日本、韓國、中國、印度、東南亞、墨西哥及歐洲陀螺圖鑑
- 操作排序、圖像判讀挑戰及自主學習資源

## 特色

- 7 個符合 ARIA 頁籤模式的單一學習任務
- 可調轉速、摩擦力與重心位置的定性科學模擬
- 4 種臺灣常見陀螺、8 個國家或區域文化圖鑑
- 6 步安全操作排序與 8 題即時回饋素養挑戰
- 19 張由 Codex 內建 Image 2.0 分別生成並人工查核的原創圖像資產；包含六概念旋轉受力示意圖與四種臺灣陀螺獨立圖鑑圖
- 支援鍵盤、觸控、學習進度保存與 `prefers-reduced-motion`

完整資料依據見 [`docs/references.md`](docs/references.md)，課堂建議見 [`docs/teacher-guide.md`](docs/teacher-guide.md)，驗證結果見 [`docs/test-report.md`](docs/test-report.md)。

## 本機預覽

```powershell
npm run serve
```

開啟 `http://localhost:8080/`。

執行結構與資料驗證：

```powershell
npm test
```

## 授權

程式與原創教材文字採 MIT License。外部資料仍依各來源條款使用；生成圖片僅作本教材呈現。
