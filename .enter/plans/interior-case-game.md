# 《空间的理由》50 关室内设计互动案例游戏

## Context
用户要做一款中文、手机竖屏优先的互动漫画小游戏：借鉴 Growth.Design 的分镜案例 + 法则讲解方式（原创人物、剧情、画面），玩家在客户故事的关键时刻选择设计方案，看到空间体验变化，再看法则复盘。借鉴所列 Skill 的「理解现状 → 保留条件 → 提出修改 → 比较效果」工作流，但首版是离线预制内容，不做识图、效果图生成或 CAD/3D 导出。

已确认的边界：
- 中文为主，保留现有 i18n 结构；进度存 localStorage，存储不可用时仍可玩（内存兜底），不需要后端。
- 首版不生成插画，人物、户型、空间变化全部用 DOM/SVG 原创绘制。
- 当前模板没有品牌片头、游戏测试契约、游戏就绪报告或 `build.sh`，不臆造；用 `pnpm lint` + `tsc` + `pnpm run build` 验证，「游戏就绪」以首关可玩为准。保留 `bootstrapGeneratedSiteAnalytics()`。

## 玩法
- 5 章 × 10 关 = 50 关，线性顺序解锁：户型与动线 / 收纳与日常 / 光线与感受 / 材质与风格 / 预算与取舍。
- 每关流程（状态机）：`story`（4–6 幕分镜）→ `choice`（2–3 个方案）→ `outcome`
  - 不符合约束：展示房间变化 + 客户反应 + 具体问题 →「回到选择点」重选（已试过的选项标记）。
  - 符合约束：展示前后对照 + 客户反应 → `review` 复盘 → 通关并解锁下一关。
- 复盘分三栏：**客户的明确约束**（本关列出的硬条件）／**设计取舍**（这个方案放弃了什么）／**法则启发**（关联 1–2 条法则，注明「启发，不是定论」）。不把审美偏好写成科学结论。
- 每关有独立客户、户型问题和取舍；约 20 条法则跨关复用。
- 首页：章节目录（每章 10 关节点、锁定/已通关状态）、总进度、「继续」入口、法则回顾入口。关卡内：返回、继续、重试。法则回顾页：已遇到的法则卡 + 在哪些关出现过。

## 内容数据模型（`src/game/types.ts`）
- `Principle`：id、名称、一句话、空间里的体现、使用边界（何时不适用）。
- `Chapter`：id、序号、标题、导语、主题色 token。
- `Level`：id（如 `c1-l03`）、chapterId、序号、标题、客户（名字 + 角色外观参数）、`constraints: string[]`、`baseScene`、`panels: Panel[]`(4–6)、`question`、`options: Option[]`(2–3)、`principleIds`。
- `Panel`：speaker（客户/设计师/旁白）、表情、台词、可选 `sceneFocus`（高亮户型某区域）。
- `Option`：id、标签、方案描述、`sceneDelta`（对 baseScene 的移动/增删家具、灯光层、材质、动线、预算条）、`passes: boolean`、客户反应台词 + 表情、`problem`（失败时的具体问题）或 `tradeoff`（通过时的取舍）。
- `Scene`：`kind: "plan" | "elevation" | "budget"`；plan = 房间轮廓/墙/门窗/家具/动线/区域；elevation = 立面墙面材质、色块比例、光源层与光斑；budget = 分项金额条。
- 房间预设（客厅、厨房、主卧、儿童房、玄关、卫生间、书房、小开间、阳台等）复用，每关用 delta 改出各自情况，保证画面可复用、故事独立。

## 文件结构
- `index.html`：标题「空间的理由」、viewport-fit=cover（安全区）、展示字体。
- `src/index.css`、`tailwind.config.ts`：温暖编辑风 token（纸张米白、墨色、陶土主色、鼠尾草、芥末点缀、5 个章节色、plan-wall/floor/furniture/flow/highlight、正确/错误反馈色、漫画描边与硬投影、安全区 padding 工具、入场/翻页/抖动 keyframes）。全部 HSL 语义 token。
- `src/components/ui/button.tsx`：新增 `comic`、`choice`、`ghostInk` 变体与 `xl` 尺寸；`badge.tsx` 章节变体。
- `src/game/`
  - `types.ts`、`principles.ts`（~20 条）、`chapters.ts`
  - `levels/chapter1.ts` … `chapter5.ts`（各 10 关）、`levels/index.ts`（有序扁平列表 + `getLevel`、`getNextLevelId`）
  - `scenes/rooms.ts`（房间预设）、`scenes/apply-delta.ts`（纯函数：baseScene + delta → 新 scene）
  - `validate-content.ts`（开发期校验，见验收）
  - `progress-store.ts`（localStorage 读写，try/catch，失败回落内存）
- `src/hooks/use-game-progress.ts`（已通关集合、当前进度、每关尝试次数、遇到的法则；`completeLevel`、`resetLevel`、`resetAll`）
- `src/hooks/use-level-flow.ts`（关卡状态机 reducer：next/prev panel、choose、retry、finish）
- `src/components/comic/`：`Character.tsx`（参数化 SVG 原创人物：发型、肤色、服装色、配饰、5 种表情）、`ComicPanel.tsx`、`SpeechBubble.tsx`
- `src/components/scene/`：`SceneView.tsx`（按 kind 分发）、`FloorPlanView.tsx`、`Furniture.tsx`、`ElevationView.tsx`、`BudgetView.tsx`、`BeforeAfter.tsx`（前/后切换对照，带变化高亮）
- `src/components/game/`：`PrincipleCard.tsx`、`ReviewSheet.tsx`、`ChapterProgress.tsx`
- `src/pages/home/`：`index.tsx`、`ChapterSection.tsx`、`LevelNode.tsx`（替换并删除 `src/pages/Index.tsx`）
- `src/pages/play/`：`index.tsx`（`/play/:levelId`）、`StoryStage.tsx`、`ChoiceStage.tsx`、`OutcomeStage.tsx`、`ReviewStage.tsx`、`LevelTopBar.tsx`
- `src/pages/principles/index.tsx`（`/principles`）
- `src/router.tsx`：注册三条路由；`NotFound.tsx` 换新 token 样式。
- `public/locales/zh-CN.json` / `en.json`：界面文案（按钮、标签、状态）键一致；`i18n.config.json` 的 `fallbackLng` 改为 `zh-CN`。关卡与法则正文仅中文，放在数据文件中。
- `CodeGuideline.md`：按其要求同步目录说明。

## 布局与交互
- 页面用 `100dvh` + 安全区 inset；关卡页为固定框架：竖屏 = 上方画面区 / 下方故事或选项区；横屏与 PC（宽 ≥ md 且横向）= 左画面、右文本两栏，按布局重排而非整体缩放。只在文本区内部必要时滚动，避免整页意外滚动。
- 所有关键操作是真实 `<button>`（onClick，触控与鼠标通用，最小触控 44px），加 `data-testid`（如 `story-next`、`option-{id}`、`retry`、`continue`、`level-node-{id}`）。
- 未解锁关卡访问 `/play/:id` → 提示并引导到当前可玩关；不存在的 id → 404 风格提示 + 回首页。
- 错误、重试、通关都走同一状态机，不另写分支流程。

## Implementation checklist
- [ ] 设计 token（index.css / tailwind.config.ts）与 button/badge 变体，无硬编码颜色
- [ ] `src/game/types.ts` 定义 Principle/Chapter/Level/Panel/Option/Scene/SceneDelta
- [ ] `principles.ts` 约 20 条，每条含「使用边界」
- [ ] `apply-delta.ts` 纯函数支持移动/增删家具、灯光层、材质、动线、预算项
- [ ] `rooms.ts` 房间预设；`FloorPlanView`/`ElevationView`/`BudgetView` 用 viewBox 自适应渲染
- [ ] `BeforeAfter` 对照与变化高亮
- [ ] `Character` 参数化人物 + 5 种表情；`ComicPanel`/`SpeechBubble`
- [ ] 第 1–5 章各 10 关内容：每关 4–6 幕、2–3 选项、≥1 通过且 ≥1 不通过、每个选项有反应与问题/取舍、principleIds 有效
- [ ] `validate-content.ts`：总数 = 50、ID 唯一、每章 10 关、幕数与选项数范围、通过/不通过各至少一个、法则 id 存在、文案非空；开发模式启动时运行并在控制台报错
- [ ] `progress-store.ts` localStorage 读写 + 不可用时内存兜底
- [ ] `use-game-progress` 顺序解锁、重玩、清空进度
- [ ] `use-level-flow` 状态机：story → choice → outcome（失败回到 choice / 通过进 review）→ 完成
- [ ] 首页章节目录、总进度、继续入口；法则回顾页
- [ ] 关卡页四个阶段组件、顶栏返回/进度、竖屏与横屏两种布局、安全区
- [ ] 路由三页注册，删除 `src/pages/Index.tsx`，未解锁/不存在关卡的处理
- [ ] i18n 界面文案 zh-CN/en 键一致，fallbackLng = zh-CN
- [ ] CodeGuideline.md 同步

## Verification checklist
- [ ] `pnpm lint`、`pnpm exec tsc --noEmit`、`pnpm run build` 全部通过
- [ ] 开发模式控制台无 `validate-content` 报错（50 关、ID 唯一、结构完整）
- [ ] 首关可玩：分镜翻页 → 选不通过选项看到具体问题 → 回到选择点重选 → 选通过选项 → 复盘三栏 → 解锁第 2 关
- [ ] 默认态：清空 localStorage 后只解锁第 1 关；直接访问第 2 关被引导回第 1 关
- [ ] 边界：不存在的 levelId 显示提示可回首页；第 10 关通关后进入第 2 章；第 50 关通关后显示全部完成
- [ ] 刷新后进度恢复；重玩已通关关卡不影响后续解锁
- [ ] localStorage 抛错（模拟）时仍可游玩
- [ ] 截图检查首页与关卡页：mobile_375、mobile_390 竖屏，一种横屏自定义尺寸（如 844×390），desktop_1280；按钮不被遮挡、文字可读、无整页意外滚动
- [ ] 抽查每章至少 2 关的故事、各选项结果、法则解释与通关条件
- [ ] 实施完成后按实际构建结果汇报，不预先声称已发布
