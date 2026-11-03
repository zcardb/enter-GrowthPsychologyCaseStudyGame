# 学习报告与徽章系统（纯前端）

## Context

当前《空间的理由》只有首页一条「已通关 N / 50」进度条，玩家看不到章节完成情况、自己在哪些关反复试错、一次就过的比例，也没有任何阶段性成就反馈。进度数据已经存在 localStorage 里（`Progress`：`cleared` / `attempts` / `seenPrinciples`），只是没有被组织成"报告"。

这次新增一个 **`/progress` 学习报告页 + 11 枚由进度推导的徽章**，不引入后端，不改玩法、关卡内容、既有路由语义和视觉语言。徽章不单独存"已解锁"状态，全部由存档纯函数推导，避免存档漂移。

## 设计要点

- 统计与徽章判定集中在 `src/game/`（无 React 依赖），页面只负责渲染。
- `src/hooks/use-game-progress.ts` 仍然是唯一读写入口，页面不直接碰 `progressStore`。
- 视觉全部复用现有马卡龙涂鸦令牌：`.doodle-card` / `.sticker` / `.tape` / `.tilt-*` / `ProgressBar` / `chapterBg`·`chapterTint`·`chapterText` / `Doodle` 装饰，不新增一次性内联样式。
- 所有新增文案走 i18n 扁平点号 key，只维护 `public/locales/zh-CN.json`。

## 数据模型

### `src/game/progress-store.ts`

```ts
export interface Progress {
  version: 2;
  cleared: string[];
  attempts: Record<string, number>;
  seenPrinciples: string[];
  firstTry: string[];                  // 首次选择就通过的关卡
  mistakes: Record<string, string[]>;  // 每关选错过的 optionId
  clearedAt: Record<string, number>;   // 首次通关时间戳
}
```

- 存储 key 继续用 `space-reasons:progress:v1`，`read()` 兼容旧 v1 存档（补默认空值），结构损坏仍回退空档。
- 新增 `recordChoice(levelId, optionId, passes)`：`attempts + 1`，`passes === false` 时把 `optionId` 去重追加到 `mistakes[levelId]`。
- 用 `recordChoice` 取代 `recordAttempt`（唯一调用点是 `src/pages/play/LevelPlayer.tsx`）。
- `completeLevel(levelId, principleIds)`：写入 `cleared` / `seenPrinciples` / `clearedAt`；仅当此前未通关且 `attempts[levelId] === 1` 时写入 `firstTry`；**返回本次新解锁的徽章数组**（更新前后各算一次差集），供复盘页提示。

## 纯函数与内容

### 新增 `src/game/progress-summary.ts`

`summarizeProgress(progress): ProgressSummary`，复用 `CHAPTERS`、`LEVELS`、`levelsOfChapter`、`PRINCIPLES`：

- 计数：`clearedCount` / `total` / `firstTryCount` / `totalAttempts` / `mistakeCount` / `seenCount` / `principleTotal`
- `chapters: { chapter, done, total, complete, unlocked }[]`
- `reviewLevels`：`attempts >= 2` 或本关有过错选的关卡，按尝试次数降序（页面取前 5 条）

### 新增 `src/game/achievements.ts`

| id | 条件 | tone |
| --- | --- | --- |
| `first-clear` | cleared ≥ 1 | primary |
| `chapter-c1` … `chapter-c5` | 该章 10 关全清 | chapter 1–5 |
| `first-try-5` / `first-try-15` | firstTry ≥ 5 / ≥ 15 | accent |
| `principles-10` / `principles-all` | seen ≥ 10 / 全部 24 | secondary |
| `all-clear` | cleared = 50 | success |

每枚形如 `{ id, icon: "flag" | "compass" | ..., tone, target, value(summary) }`，导出 `evaluateAchievements(progress)` 返回解锁状态 + 当前进度值。`src/game/` 保持无 UI 依赖，lucide 图标在页面组件里按 icon 字符串映射（`Flag / Compass / Boxes / Sun / Layers / Wallet / Zap / Eye / Lightbulb / BookOpenCheck / Trophy`）。

## 页面 `/progress`

- `src/pages/progress/index.tsx`：返回按钮、标题（`doodle-underline`）、统计分区、"值得回看"列表（最多 5 条 `Link`：关卡号 · 标题 · 尝试 N 次 · 错选 M 次）、完成度 100% 时隐藏该分区；`clearedCount === 0` 时显示空状态卡片 + 去第 1 关的 CTA，徽章墙仍完整展示（全锁定）。
- `src/pages/progress/StatTiles.tsx`：4 张贴纸统计卡（通关 X/50、一次通过、累计尝试、遇见法则 N/24），`grid-cols-2 sm:grid-cols-4`，交替 `tilt-*`。
- `src/pages/progress/ChapterReport.tsx`：每章一张卡片（`chapterTint` 底 + 章序号 `sticker`），`ProgressBar` + `done / 10`，全清时显示该章徽章小贴纸。
- `src/pages/progress/AchievementCard.tsx`：解锁 = 彩色贴纸 + 图标 + 标题 + 描述；未解锁 = 虚线灰卡 + 淡化图标 + `value / target`。
- 路由：`src/router.tsx` 在 `*` 之前新增 `{ path: "/progress", name: "progress", element: <Progress /> }`。
- 入口：`src/pages/home/HeroSection.tsx` 在进度条下方加右对齐文字链接「查看学习报告」→ `/progress`（`data-testid="home-progress"`），不新增按钮行以免移动端拥挤。

## 新徽章反馈

`src/pages/play/ReviewStage.tsx` 承接 `completeLevel` 的返回值，在现有「章节完成」贴纸旁渲染一条 `sticker` 提示（`Sparkles` + 徽章名）。用局部 state 承接，StrictMode 下第二次 effect 返回空数组，不会重复渲染。

## i18n

`public/locales/zh-CN.json` 追加：

- `progress.title` / `progress.subtitle` / `progress.back`
- `progress.stats.cleared` / `firstTry` / `attempts` / `principles`
- `progress.chapters` / `progress.chapterDone` / `progress.review.title` / `progress.review.attempts` / `progress.review.mistakes` / `progress.review.empty`
- `progress.empty.title` / `progress.empty.desc` / `progress.empty.cta`
- `achievements.<id>.title` / `achievements.<id>.desc`
- `play.review.newBadge`

保持扁平 key 与 `{{n}}` 占位符风格一致。

## 内容校验

`src/game/validate-content.ts` 的 `validateContent()` 增加：徽章 id 唯一、`chapter-*` 徽章引用的章节真实存在、`target > 0`，沿用 dev 启动时的日志输出。

## 关键文件

- 新增：`src/game/progress-summary.ts`、`src/game/achievements.ts`
- 新增：`src/pages/progress/{index,StatTiles,ChapterReport,AchievementCard}.tsx`
- 修改：`src/game/progress-store.ts`、`src/hooks/use-game-progress.ts`
- 修改：`src/pages/play/LevelPlayer.tsx`、`src/pages/play/ReviewStage.tsx`
- 修改：`src/pages/home/HeroSection.tsx`、`src/router.tsx`
- 修改：`public/locales/zh-CN.json`、`src/game/validate-content.ts`

## 实施步骤

1. 存档层：`Progress` 升到 v2 + v1 迁移 + `recordChoice` + `completeLevel` 返回新解锁徽章。
2. 统计层：`summarizeProgress` 与 `evaluateAchievements` 纯函数。
3. 报告页组件 + 路由 + 首页入口。
4. 复盘页新徽章提示。
5. i18n 文案 + `validate-content` 徽章校验。
6. 全量校验与移动端/桌面截图。

## 验证

1. `pnpm run check`（eslint + tsc）与 `pnpm run build` 通过；dev 启动日志为 `[content] 50 关内容校验通过`，无徽章相关报错。
2. `/progress` 空档：四项统计为 0、11 枚徽章全部锁定并显示 `0 / target`、出现空状态 CTA。
3. 通关第 1 关后：首页数字、`/progress` 统计、`first-clear` 解锁、`chapter-c1` 显示 `1 / 10` 全部一致。
4. 同一关先选错一次再通过：`mistakes` 记录该 optionId、`firstTry` **不**包含该关；首页/报告页尝试数为 2。
5. 迁移：把 v1 存档写回 localStorage 后刷新，`cleared` / `attempts` / `seenPrinciples` 保留，新字段为空，页面不崩。
6. `/play/c1-l10` 过关后复盘页出现「第 1 章完成」+ 新徽章贴纸；重复点「重玩」再过关不重复弹出已解锁徽章。
7. `mobile_390` 与 `desktop_1280` 截图 `/progress`：无横向溢出、统计卡不重叠、徽章墙正常换行。
8. 首页清空进度后回到 `/progress`：统计归零、徽章全部重新锁定。

## Implementation checklist

- [x] `src/game/progress-store.ts` 的 `Progress` 升级为 v2，`read()` 能把 v1 存档补全为 v2 且保留 `cleared` / `attempts` / `seenPrinciples`
- [x] `progress-store.ts` 新增 `recordChoice(levelId, optionId, passes)`：每次选择 `attempts + 1`，失败 optionId 去重写入 `mistakes`
- [x] `completeLevel` 在新通关且 `attempts === 1` 时写入 `firstTry`，并写入 `clearedAt`，同时返回本次新解锁的徽章数组
- [x] `src/hooks/use-game-progress.ts` 暴露 `recordChoice`、返回新徽章的 `completeLevel`，移除不再使用的 `recordAttempt`
- [x] `src/pages/play/LevelPlayer.tsx` 的 `choose` 改为调用 `recordChoice(level.id, id, option.passes)`
- [x] 新增 `src/game/progress-summary.ts`，导出 `summarizeProgress`（计数、章节、`reviewLevels`）且不引入 React
- [x] 新增 `src/game/achievements.ts`，包含 11 枚徽章定义、icon 字符串枚举与 `evaluateAchievements`
- [x] 新增 `src/pages/progress/AchievementCard.tsx`，区分解锁/未解锁两种渲染并显示 `value / target`
- [x] 新增 `src/pages/progress/StatTiles.tsx` 与 `ChapterReport.tsx`，复用 `ProgressBar` 与 `chapterTint`/`chapterBg`
- [x] 新增 `src/pages/progress/index.tsx`：统计、章节、徽章墙、「值得回看」列表、空状态、返回按钮
- [x] `src/router.tsx` 注册 `/progress` 路由（在 `*` 之前）
- [x] `src/pages/home/HeroSection.tsx` 增加 `/progress` 文字链接（`data-testid="home-progress"`）
- [x] `src/pages/play/ReviewStage.tsx` 渲染本次新解锁徽章贴纸，重玩不重复提示
- [x] `public/locales/zh-CN.json` 补齐 `progress.*`、`achievements.<id>.*`、`play.review.newBadge` 全部 key
- [x] `src/game/validate-content.ts` 校验徽章 id 唯一、章节引用存在、`target > 0`

## Verification checklist

- [x] `pnpm run lint` 无报错
- [x] `pnpm exec tsc --noEmit` 无类型错误
- [x] `pnpm run build` 成功
- [x] dev 启动日志显示 50 关内容校验通过，且无徽章校验错误
- [x] 空存档下 `/progress` 四项统计为 0、11 枚徽章全部锁定、空状态 CTA 指向 `/play/c1-l01`
- [ ] 通关第 1 关后 `/progress` 显示 `1 / 50`、`1 / 10`（第 1 章），`first-clear` 已解锁
- [ ] 先错后对的关卡落在「值得回看」列表，且不计入一次通过数
- [x] v1 存档迁移后刷新页面不丢失已通关记录、控制台无报错
- [ ] `/play/c1-l10` 复盘页出现章节完成贴纸与新徽章贴纸，重玩后不重复弹出
- [x] `mobile_390` 与 `desktop_1280` 的 `/progress` 截图无横向溢出、统计卡与徽章卡片不重叠
- [ ] 首页清空进度后 `/progress` 统计归零、徽章全部锁定、首页入口仍可正常跳转
