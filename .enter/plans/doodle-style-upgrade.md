# 涂鸦风格强化：手绘线条 + 贴纸拼贴（全站）

## Context

上一轮已经把配色、字体、圆角换成了马卡龙涂鸦底子，但实际观感更接近“粉彩圆角卡片”：所有容器都是同一种描边、同一种圆角、同一种阴影，缺少真正的手绘线条、胶带、马克笔涂抹和贴纸层次，页面显得平、重复、缺少涂鸦的调皮感。

用户确认方向：**强化手绘线条 + 贴纸拼贴**，范围**全站**（首页、关卡内页、法则图鉴、锁定页 / 404）。玩法、数据、文案、路由、存档逻辑全部不动，只改视觉层。

现有的语义令牌（`bg-card`、`border-ink`、`shadow-comic`、`bg-chapter-*`、`fill-mat-*`）和工具类（`.doodle-card`、`.sticker`、`.tape`、`.tilt-*`、`.doodle-underline`）继续复用，在它们之上补一套“手绘细节”系统，而不是重写页面结构。

## 设计方向

1. **双层铅笔描边**：主边框保留 2px 墨线，再叠一层轻微错位、低透明度的第二道线（`.ink-frame`），像用铅笔画了两遍。
2. **真正会“抖”的边框**：新建 `RoughFrame` SVG 组件，用手写抖动路径给大卡片（Hero、章节卡、场景图、锁定页）镶边，替代纯 CSS 直边。
3. **手写数字**：新增 `Caveat` 字体作为 `font-marker`，用在关卡编号、章节序号、进度数字、关卡阶段、404 上；中文手写标题继续用 `ZCOOL KuaiLe`。
4. **马克笔高光**：`.marker` 系工具类给标题、关键词加一条歪斜的半透明色块，像用荧光笔划过去。
5. **贴纸层次**：胶带增加薄荷 / 薰衣草 / 樱花三种，卡片加折角（`.fold-corner`）、便签横线（`.note-lined`）、缝线分隔（`.sketch-seam`）、橡皮图章（`.stamp`）。
6. **降低噪点**：锁定格与未解锁法则不再用密集虚线 + 斜纹，改成淡纸底 + 单一锁标 + 问号涂鸦，页面干净但仍有涂鸦味道。
7. 配色令牌不变（草莓 / 薄荷 / 柠檬 / 薰衣草 / 葡萄 + 深梅墨），只调整阴影方向与背景纹理，保证既有对比度不回退。

## 实施步骤

### 1. 设计系统底座 —— `src/index.css`

- 在现有工具类后追加（继续放在 `@layer` 之外，保证压过 Tailwind 的圆角 / 背景类）：
  - `.ink-frame` / `.ink-frame-loose`：`::after` 绝对定位，`inset: -4px`，`border: 1.5px solid hsl(var(--ink)/0.32)`，异形圆角，`rotate(.35deg)`，`pointer-events:none`。只用 `::after`，避免和 `.tape::before` 冲突（仓库内没有在涂鸦卡片上使用 `after:` 的工具类）。
  - `.marker` / `.marker-mint` / `.marker-lav`：用 `linear-gradient` 在文字下半部分铺一条歪斜色带，`box-decoration-break: clone` 支持换行。
  - `.fold-corner`：右上角折角三角（`clip-path`），颜色取纸底更深一档。
  - `.note-lined`：便签横线（复用现有 `.note` 的写法，改 1.9em 行距）。
  - `.sketch-seam`：手绘虚线分隔线（2px dashed，`border-ink/25`）。
  - `.stamp`：橡皮图章外框（3px 双线 + 内阴影 + `-3deg` 旋转）。
  - `.tape-lav` / `.tape-pink` / `.tape-wide`：胶带配色与加宽变体。
  - `.paper-tab`：分组标题纸条，左侧折角 + 细墨线。
  - `.grid-note`：淡格纹便签底。
- `body` 背景：保留 `--gradient-paper`，再叠一层极淡点阵（`background-size: 22px 22px`，`--ink/0.05`），让纸感更明确。
- `--shadow-sticker` 调成 `3px 4px 0 0 ink, 6px 7px 0 0 primary-soft`，方向略歪，更像手贴上去。
- 末尾加 `@media (prefers-reduced-motion: reduce)`，关掉 wiggle / float / pulse。

### 2. 字体与 Tailwind —— `index.html`、`tailwind.config.ts`

- Google Fonts 追加 `Caveat:wght@400;600;700`。
- `fontFamily` 增加 `marker: ['Caveat', '"ZCOOL KuaiLe"', 'cursive']`。
- `boxShadow` 增加 `sketch: '2px 3px 0 0 hsl(var(--ink)/0.18)'`。
- `keyframes/animation` 增加 `sway`（贴纸轻微摆动），保留现有 `wiggle` / `float` / `shake`。

### 3. 手绘框架与涂鸦零件

- 新增 `src/components/comic/RoughFrame.tsx`：`preserveAspectRatio="none"` + `vector-effect="non-scaling-stroke"` 的自绘抖动圆角矩形（内置 1 道主线 + 1 道淡线，`radius` / `strokeWidth` / `className` 可调，`aria-hidden`）。用于 Hero、章节卡、关卡场景卡、锁定页卡。
- `src/components/comic/Doodle.tsx` 追加：
  - `ScribbleCircle`：手绘圈，用来圈住章节序号 / 通关勾。
  - `ArrowCurve`：带弧度的箭头（指向 CTA）。
  - `Confetti`：三笔小彩带，用于章节完成横幅。
  - `AlongDashed`：手绘虚线连接线（首页四步流程、关卡阶段条）。

### 4. 基础组件

- `src/components/ui/button.tsx`：`comic` 系加 `crayon-stripes` 马克笔纹理；圆角统一走 `.doodle-pill`；hover 位移保持，新增 `focus-visible` 时 `ink-frame` 不参与（避免焦点框抖动）。新增 `stickerMint` 变体备用。
- `src/components/ui/badge.tsx`：`accent` / `ink` 贴纸加 `shadow-sticker`，`pastel` 改为 `paper-tab` 纸条造型。
- `src/components/game/ProgressBar.tsx`：轨道内加一道淡虚线刻度，填充条保留斜纹，末端加一个小圆点“笔尖”。
- `src/components/game/PrincipleCard.tsx`：`RoughFrame` + 交替 `tilt` + 左上角胶带；`dt` 前加手写小圆点；底部 footer 分隔线换 `.sketch-seam`。

### 5. 首页

- `HeroSection.tsx`：外层换 `RoughFrame`；眉标贴纸加胶带；主标题用 `.marker`（保留 `doodle-underline` 只在一处，避免双重装饰）；四步流程改为手绘虚线串联 + 贴纸胶囊；进度区做成一张“便签卡”（`.note-lined` + 小胶带）+ `font-marker` 数字；CTA 旁加 `ArrowCurve`；角色头像改宝丽来相框（白边 + 底部手写名“你 / 设计师”，复用 `DESIGNER`）；四角补充 `Sparkle` / `Swirl` / `StarDoodle`，颜色分开。
- `ChapterSection.tsx`：整块换 `RoughFrame` + 胶带；序号用 `ScribbleCircle` 圈住；标题加 `.marker`；章节进度数字用 `font-marker`；关卡网格间距微调，保证移动端两列不拥挤。
- `LevelNode.tsx`：重做格子层次——编号 `font-marker text-2xl`，标题 12px；已通关 = 薄荷底 + 勾贴纸 + 折角；当前关 = 章节色 + `ScribbleCircle` + 脉冲点；可玩 = 白纸 + 硬阴影；锁定 = 淡纸底 + 虚线弱化 + 锁标（去掉斜纹铺满），三档交替微小旋转只在 hover 回正。

### 6. 关卡内页

- `LevelPlayer.tsx`：场景卡换 `RoughFrame` + 右上角胶带 + 淡点阵；文本列与场景列间距按桌面 / 移动微调，不改变 `100dvh` 结构。
- `LevelTopBar.tsx`：阶段胶囊用 `AlongDashed` 连接，当前阶段用柠檬贴纸 + `-rotate-2`，已完成阶段用墨底纸字；关卡编号用 `font-marker`。
- `StoryStage.tsx`：brief 改柠檬便签（`.note-lined` + 胶带 + 折角）；分页点改手绘短横线（当前为长条）。
- `ChoiceStage.tsx`：约束卡改薄荷便签字条；问题加 `.marker`；选项卡加大 A/B/C 贴纸、hover 抬起、已试过的选项加红色手写叉与删除线；底部“重读”保留波浪下划线。
- `OutcomeStage.tsx`：结论区改成纸卡 + 右上角 `.stamp`（通过=薄荷、失败=樱花），图标与标题字号加大；失败保留 `animate-shake`。
- `ReviewStage.tsx`：章节完成横幅改“撕纸彩带”（`.paper-tab` + `Confetti`）；取舍说明改柠檬便签；约束清单的勾改成手绘勾；法则卡片沿用新版 `PrincipleCard`。
- `SpeechBubble.tsx`：气泡加第二道错位描边（`.ink-frame` 轻量版），气泡尾改手绘三角；旁白改成带胶带的便签条；头像加 `ScribbleCircle` 边。

### 7. 其他页面

- `src/pages/principles/index.tsx`：页头加胶带与涂鸦装饰，计数改贴纸；分组标题用 `.paper-tab` + 色块；未解锁卡去掉模糊文字，改为“淡纸底 + 大问号涂鸦 + 锁标 + 弱化标题”，视觉更干净；已解锁卡加章节色左条与折角。
- `src/pages/play/index.tsx`、`src/pages/NotFound.tsx`：外层 `RoughFrame` + 胶带 + 涂鸦，标题用 `.marker`，404 数字用 `font-marker`。

文案：不新增 i18n key，全部复用 `common` / `home` / `play` / `principles` / `notFound` 现有文案。

## 关键文件

- `src/index.css`、`tailwind.config.ts`、`index.html`
- 新增 `src/components/comic/RoughFrame.tsx`；扩展 `src/components/comic/Doodle.tsx`
- `src/components/ui/button.tsx`、`src/components/ui/badge.tsx`
- `src/components/game/{ProgressBar,PrincipleCard}.tsx`
- `src/pages/home/{HeroSection,ChapterSection,LevelNode}.tsx`
- `src/pages/play/{LevelTopBar,StoryStage,ChoiceStage,OutcomeStage,ReviewStage,LevelPlayer}.tsx`
- `src/pages/principles/index.tsx`、`src/pages/play/index.tsx`、`src/pages/NotFound.tsx`
- `src/components/comic/SpeechBubble.tsx`

## 验证

1. `pnpm run lint`、`pnpm exec tsc --noEmit`、`pnpm run build` 全部通过。
2. `website_screenshot` 在 `desktop_1280` 与 `mobile_390` 截取 `/`、`/principles`、`/play/c1-l01`、`/nope`：
   - 首页无横向溢出，章节卡胶带 / 涂鸦不压住标题，关卡编号在移动端两列下不换行。
   - 法则图鉴未解锁卡不再是模糊文字，分组纸条不溢出。
   - 关卡页竖屏场景区与文本区不重叠，底部操作栏不被裁切。
3. 预览中走一遍 `/play/c1-l01` 的故事 → 选择 → 结果 → 复盘，确认选错触发 shake + 重试、选对进入复盘并写入进度；阶段胶囊与按钮新样式下仍可点击。
4. 对比度抽查：`text-primary-ink` / 墨色正文在草莓、薄荷、柠檬、薰衣草底上清晰；马克笔高光不覆盖文字主体。

## Implementation checklist

- [ ] `src/index.css` 追加 `.ink-frame` / `.marker*` / `.fold-corner` / `.note-lined` / `.sketch-seam` / `.stamp` / `.paper-tab` / `.grid-note` / 胶带变体
- [ ] `body` 背景叠点点阵，`--shadow-sticker` 调成微歪双层，加入 `prefers-reduced-motion` 降级
- [ ] `index.html` 引入 Caveat；`tailwind.config.ts` 新增 `font-marker`、`shadow-sketch`、`sway`
- [ ] 新增 `RoughFrame.tsx` 并在 Hero / 章节卡 / 场景卡 / 锁定页 / 404 使用
- [ ] `Doodle.tsx` 追加 `ScribbleCircle`、`ArrowCurve`、`Confetti`、`AlongDashed`
- [ ] `button.tsx` comic 系加马克笔纹理与新变体，`badge.tsx` 贴纸 / 纸条造型
- [ ] `ProgressBar.tsx` 刻度与笔尖，`PrincipleCard.tsx` RoughFrame + 胶带 + 缝线
- [ ] `HeroSection.tsx` 宝丽来头像、便签进度、虚线流程、箭头涂鸦
- [ ] `ChapterSection.tsx` RoughFrame + 圈号 + 马克笔标题
- [ ] `LevelNode.tsx` 四种状态重做，锁定态去掉斜纹噪点
- [ ] `LevelPlayer.tsx` / `LevelTopBar.tsx` 场景框、阶段虚线连接
- [ ] `StoryStage.tsx` / `ChoiceStage.tsx` / `OutcomeStage.tsx` / `ReviewStage.tsx` 便签与图章换装
- [ ] `SpeechBubble.tsx` 双层气泡、手绘尾、旁白便签
- [ ] `principles/index.tsx` 未解锁卡去模糊改问号 + 锁标，分组纸条
- [ ] `play/index.tsx`、`NotFound.tsx` 换 RoughFrame + 马克笔标题
- [ ] 全站自查：无新增硬编码颜色（只用语义令牌与现有 HSL 变量）

## Verification checklist

- [ ] `pnpm run lint` 通过
- [ ] `pnpm exec tsc --noEmit` 通过
- [ ] `pnpm run build` 成功
- [ ] `/` 在 `desktop_1280` 截图：RoughFrame 边框完整不裁切，胶带不遮标题，50 个关卡格排列无错位
- [ ] `/` 在 `mobile_390` 截图：无横向滚动，关卡编号与标题不溢出，Hero 贴纸不重叠
- [ ] `/principles` 截图：未解锁卡为淡纸 + 问号 + 锁标，已解锁卡左侧色条与折角正常
- [ ] `/play/c1-l01` 截图：场景 RoughFrame 与点阵正常，右侧气泡双层线不遮挡文字
- [ ] 预览点击走完 story → choice → outcome → review 四阶段；选错出现 shake 与重试按钮，选对进入复盘
- [ ] `/play/c1-l50` 显示锁定页、`/nope` 显示 404，两页 RoughFrame 与马克笔标题正常
- [ ] 深色文字在四色马卡龙底上对比清晰，`.marker` 高光不压住文字笔画
