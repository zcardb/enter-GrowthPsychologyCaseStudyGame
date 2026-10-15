# 「空间心理学」室内设计案例抉择小游戏

## Context
用户想参考 growth.design 的 psychology 法则库和 case-studies 漫画案例的形式，做一个**室内设计主题**的小游戏，能力灵感来自所列 skill（户型识图、平面布局、保留结构/允许修改、风格迁移、材质替换、结构化数据生成 SVG 平面图）。
已确认：玩法 = 案例抉择分支（真实场景 A/B 二选一 → 立刻看后果 + 法则解析）；中文为主、保留 i18n 结构；进度用 localStorage，无需后端。

当前项目是空模板（React + Vite + shadcn + framer-motion + i18n 脚手架），首页为占位页。

## 游戏设计

**页面**
1. 首页 `/`：Hero（标题「空间心理学」、副标题、总进度/总分/已解锁法则数）+ 案例卡片网格（仿 case-studies：分类标签、预计时长、完成状态、得分）。
2. 案例页 `/case/:caseId`：顶部进度条；每一步 = 业主委托（漫画对话气泡）+ 现状平面图 → 两个方案卡 A/B（各带 SVG 示意）→ 选择后翻出结果面板：后果描述（「入住半年后…」）、得分、解锁的法则卡（名称 + 一句话定义 + 设计 tip）。最后一步后显示结算页：得分、满意度评级、本案法则回顾、下一个案例按钮。
3. 法则图鉴 `/laws`：按四类分组（仿 psychology 的 信息/意义/时间/记忆 → 改为 看见 / 理解 / 行动 / 记忆），已解锁显示详情，未解锁显示锁定态。

**内容（6 个案例 × 3 步 = 18 个抉择，全部中文，写在数据文件里）**
| 案例 | 分类 | 涉及法则 |
|---|---|---|
| 45㎡ 小客厅 | 平面布局 | 视觉焦点、通道宽度 ≥ 900mm、邻近原则 |
| 一字厨房改造 | 动线 | 厨房工作三角、费茨定律（常用物近手）、希克定律（收纳分区） |
| 主卧安放 | 布局 | 前景-庇护（床头靠实墙望门）、照明分层、峰终定律 |
| 玄关与回家动线 | 动线 | 峰终定律（第一印象）、洄游动线、默认偏好 |
| 客厅背景墙改造 | 风格 | 保留结构 vs 允许修改（承重墙）、60-30-10 配色、冯·雷斯托夫效应 |
| 预算与选材 | 沟通 | 锚定效应、损失厌恶、宜家效应 |

约 16 条法则，每条：id、名称、分类、一句话定义、室内应用 tip。每个选项：标签、描述、示意（visual）、得分（3/1/0）、后果文案、关联法则 id。

**示意图（无需生成图片）**
仿 plancraft 思路：用结构化数据渲染 SVG 平面图（房间轮廓、墙、门、窗、家具矩形+标签、可选动线虚线）。另有两种 visual：`palette`（配色比例条，用于 60-30-10/风格题）、`quote`（报价单卡片，用于预算题）。

**视觉风格**
仿 growth.design 漫画感：暖米白纸张底、深墨色粗描边、硬投影（offset shadow）；主色陶土橙、辅色鼠尾草绿、点缀芥末黄；平面图用独立 token（墙/地面/家具/动线）。所有颜色走 index.css HSL token + tailwind 映射，不写硬编码颜色。framer-motion 做选项翻牌、结果面板滑入、得分跳动。

## 文件改动
- `index.html`：标题、引入一款 Latin 展示字体（数字/英文用），中文走系统字体。
- `src/index.css`、`tailwind.config.ts`：新 token（paper/ink/primary/secondary/accent/plan-*、shadow-comic、gradient）、keyframes。
- `src/components/ui/button.tsx`：新增 `comic` / `choice` 变体；`badge.tsx` 新增分类变体。
- `src/types/game.ts`：Principle / Case / Step / Option / Visual 类型。
- `src/data/principles.ts`、`src/data/cases.ts`：全部中文内容。
- `src/hooks/use-game-progress.ts`：localStorage 读写（每案例的选择、最高分、已解锁法则），提供 `recordChoice`、`resetCase`、汇总统计。
- `src/components/plan/`：`FloorPlan.tsx`（SVG 渲染器）、`PaletteBar.tsx`、`QuoteCard.tsx`、`CaseVisual.tsx`（按 visual.kind 分发）。
- `src/components/game/`：`PrincipleCard.tsx`、`SpeechBubble.tsx`、`ScoreBadge.tsx`（跨页复用）。
- `src/pages/home/`：`index.tsx`、`HeroSection.tsx`、`CaseCard.tsx`（替换并删除 `src/pages/Index.tsx`）。
- `src/pages/case/`：`index.tsx`、`StepView.tsx`、`OptionCard.tsx`、`OutcomePanel.tsx`、`CaseSummary.tsx`。
- `src/pages/laws/index.tsx`。
- `src/router.tsx`：注册 `/`、`/case/:caseId`、`/laws`。
- `public/locales/zh-CN.json`、`en.json`：界面文案（导航、按钮、统计标签等）走 i18n；`i18n.config.json` 的 `fallbackLng` 改为 `zh-CN`。案例/法则正文只做中文，放数据文件。
- `src/pages/NotFound.tsx`：文案保持 i18n，换用新 token 样式。
- `CodeGuideline.md`：按其要求更新目录说明。

## Implementation checklist
- [ ] index.css / tailwind.config.ts 定义纸张、墨色、陶土、鼠尾草、芥末、plan-* 色与 shadow-comic，无硬编码颜色
- [ ] button `comic`/`choice` 变体、badge 分类变体
- [ ] `src/types/game.ts` 类型完整（visual 为 plan | palette | quote 联合类型）
- [ ] `principles.ts` ≥ 16 条、四类分组；`cases.ts` 6 案例 × 3 步，每步 A/B 各有得分、后果、法则 id
- [ ] 所有选项引用的 principle id 都存在于 principles.ts
- [ ] `FloorPlan` 能渲染墙、门、窗、家具、动线虚线，按容器自适应（viewBox）
- [ ] `use-game-progress` 持久化到 localStorage，刷新后进度/分数/解锁保留，可重玩单个案例
- [ ] 首页：Hero 统计 + 案例网格（完成态、得分）
- [ ] 案例页：步骤进度、选择后锁定、结果面板展示后果+法则卡、下一步、结算页
- [ ] 法则图鉴：已解锁/未解锁两种状态
- [ ] 路由注册三页，删除旧 `src/pages/Index.tsx`
- [ ] zh-CN / en 界面文案键一致，fallbackLng = zh-CN
- [ ] CodeGuideline.md 更新

## Verification checklist
- [ ] `pnpm lint` 与 `pnpm exec tsc --noEmit` 通过，`pnpm run build` 成功
- [ ] 正向：从首页进入案例，完成 3 步，结算页分数 = 所选得分之和，对应法则在图鉴解锁
- [ ] 默认态：清空 localStorage 后首页显示 0 进度，图鉴全部锁定
- [ ] 边界：访问不存在的 `/case/xxx` 显示未找到提示并可返回首页；已完成案例可「重玩」并覆盖最高分逻辑正确（保留最高分）
- [ ] 刷新页面后进度保留
- [ ] 截图验证 `/` 与 `/case/:id` 在 mobile_390 与 desktop_1280 下布局正常，平面图不溢出
