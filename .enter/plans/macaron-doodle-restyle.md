# 马卡龙涂鸦风格改造

## Context

当前《空间的理由》是「暖色编辑漫画风」：赤陶橘 + 鼠尾草绿 + 芥末黄，纸感底色、2px 墨线描边、硬阴影。用户希望整套视觉换成**马卡龙涂鸦风**，并确认：

- 覆盖全站：首页目录、关卡内页、法则图鉴（含 404 / 锁定页）。
- 强度为「明显手绘涂鸦」：歪斜卡片、胶带贴纸、手写标题、涂鸦装饰线。
- 关卡内的户型图 / 立面图 / 预算图也要改成柔和马卡龙配色，但保持可读性。
- 玩法、数据、文案、路由、存档逻辑全部不变，只改视觉层。

项目已把颜色集中在 `src/index.css` 的 HSL 令牌 + `tailwind.config.ts` 映射里，绝大多数组件只消费语义类名（`bg-card`、`border-ink`、`shadow-comic`、`bg-chapter-*`、`fill-mat-*`）。因此**令牌重写 + 少量涂鸦工具类 + 关键组件换装**即可覆盖全站，不需要逐个重写页面结构。

## 设计方向

**配色（马卡龙 + 深梅墨线）**：底色奶油粉、卡片近白、墨线改为深梅紫（比纯黑柔和），主色草莓粉、辅色薄荷、点缀柠檬、章节为草莓 / 薄荷 / 柠檬 / 薰衣草 / 葡萄五色，全部保持「浅底 + 深墨字」以通过对比度。

**字体**：标题 `ZCOOL KuaiLe`（站酷快乐体，手写涂鸦感，Google Fonts 提供），正文继续 `Noto Sans SC`。

**涂鸦语言**（全部做成可复用工具类 / 小组件，禁止在页面里写一次性内联样式）：

| 元素 | 做法 |
| --- | --- |
| 手绘边框 | 不规则圆角 `border-radius: 1.6rem 2.2rem 1.8rem 2.4rem / 2.2rem 1.6rem 2.4rem 1.8rem`，3 个变体交替使用 |
| 贴纸阴影 | 硬阴影叠加一层浅色投影：`4px 4px 0 ink, 8px 8px 0 accent-soft` |
| 胶带 | `.tape` 伪元素：半透明柠檬/薄荷条纹块，旋转 -8deg，压在卡片左上角 |
| 手写下划线 | `.doodle-underline` 伪元素，SVG 双波浪线（玫瑰色）压在标题文字下方 |
| 歪斜 | `.tilt-l/-1/-2` 三档 -1.5deg / -0.6deg / 1deg；hover 时回正 |
| 涂鸦装饰 | 新组件 `src/components/comic/Doodle.tsx`：`Squiggle`、`Sparkle`、`Sunburst`、`ArrowDoodle`、`StarDoodle`，统一 `stroke-ink`，可传 className |
| 背景 | `body` 改为奶油底 + 淡彩大色块（薄荷/粉/柠檬 radial-gradient）+ 细颗粒纸纹；`paper-dots` 改为淡紫点阵 |
| 动效 | 新增 `wiggle`（hover 微抖）、`float`（贴纸浮动）两个 keyframes；保留 `shake`、`dash-flow`、`pulse-ring` |

## 实施步骤

### 1. 设计令牌重写 — `src/index.css`

替换 `:root` 全部色值（保持变量名不变，避免组件改动）：

- 基础：`--background: 20 100% 97%`、`--foreground/--ink: 262 22% 22%`、`--card: 30 100% 99%`、`--muted: 300 24% 94%`、`--muted-foreground: 264 12% 42%`、`--border/--input: 268 26% 85%`、`--radius: 1rem`
- 主色：`--primary: 348 86% 76%`（草莓奶昔）、`--primary-foreground: 262 24% 20%`、`--primary-soft: 348 100% 93%`、新增 `--primary-ink: 348 62% 45%`（用于浅底上的正文/图标）
- 辅色/点缀：`--secondary: 158 55% 80%` + `--secondary-foreground: 165 40% 24%`；`--accent: 45 100% 74%`、`--accent-soft: 46 100% 90%`
- 状态：`--success: 158 46% 34%` + `--success-soft: 155 60% 91%`；`--destructive: 345 64% 48%` + `--destructive-soft: 348 100% 95%`
- 章节：1 `348 86% 78%`、2 `158 58% 76%`、3 `46 96% 74%`、4 `262 68% 82%`、5 `326 72% 81%`（全部配深墨字）
- 户型图：floor `32 70% 96%`、wall `264 20% 30%`、furniture `30 55% 91%`、line `264 14% 46%`、rug `155 45% 89%`、window `195 70% 84%`、flow-good `158 46% 40%`、flow-bad `345 68% 56%`、highlight `46 100% 70%`、zone `348 62% 64%`
- 材质 16 色全部改为低饱和马卡龙（oak 蜂蜜、walnut 仍深、sage 薄荷、terracotta 蜜桃、navy 蓝莓、mustard 柠檬、pink 樱花、charcoal 深梅…），`isDarkMat` 逻辑不变
- 光照 `--light-warm/neutral/cool` 提亮为奶油黄 / 香草 / 冰蓝；`--shade: 264 28% 16%`
- 阴影：`--shadow-comic: 4px 4px 0 0 hsl(var(--ink))`、`--shadow-comic-lg: 6px 6px 0 0 hsl(var(--ink)), 10px 10px 0 0 hsl(var(--accent-soft))`、`--shadow-soft` 改为梅紫柔光；`--gradient-paper` 换成粉/薄荷/柠檬三色柔光

新增 `@layer utilities`（都是全局复用，页面只调类名）：

`.doodle-card`、`.doodle-card-alt`、`.doodle-pill`、`.sticker`、`.tape`、`.tape-mint`、`.doodle-underline`、`.tilt-l`/`.tilt-1`/`.tilt-2`、`.crayon-stripes`（进度条斜纹）、`.paper-grain`、`.wobble-hover`。

### 2. Tailwind 与字体 — `tailwind.config.ts`、`index.html`

- `fontFamily.display` 改为 `['"ZCOOL KuaiLe"', '"Noto Sans SC"', ...]`，保留 `font-sans`
- `colors.primary` 增加 `ink: token('primary-ink')`
- `boxShadow` 增加 `sticker`
- `keyframes/animation` 增加 `wiggle`、`float`
- `index.html`：Google Fonts 改为 `Noto+Sans+SC:wght@400;500;700` + `ZCOOL+KuaiLe`；`theme-color` 改为 `#fff6f7`

### 3. 基础组件换装

- `src/components/ui/button.tsx`：`comic` / `comicLight` / `comicSuccess` 改用 `.doodle-pill` + 双层硬阴影 + `hover:wiggle`，激活态下压阴影；`link` 变体改用 `text-primary-ink`；新增 `sticker` 变体（浅粉底 + 墨线 + 微旋转）
- `src/components/ui/badge.tsx`：`ink` / `accent` 变体改为贴纸造型（不规则圆角、细墨线、`shadow-sticker`、默认 -1.5deg 旋转），新增 `pastel` 变体
- `src/components/game/ProgressBar.tsx`：轨道改 `.doodle-pill` + 细墨线，填充条叠加 `.crayon-stripes` 斜纹
- `src/components/game/PrincipleCard.tsx`：`.doodle-card` + 交替 `.tilt-*` + 右上角胶带，`dt` 用 `text-primary-ink`

### 4. 页面换装

- 首页 `HeroSection.tsx`：卡片改 `.doodle-card`，顶部压胶带，标题加 `.doodle-underline`，眉标改贴纸；四步流程胶囊改手绘圆角并交替轻微旋转；右侧角色相框改不规则圆形 blob；四角投放 `Doodle` 组件（`Sparkle` / `Squiggle` / `StarDoodle`）
- 首页 `ChapterSection.tsx` / `LevelNode.tsx`：章节卡改 `.doodle-card`，章节序号改旋转贴纸（`tilt-1`）；关卡格改贴纸质感，`open/cleared` 交替轻微旋转、hover 回正，`current` 用章节色的深一档描边；锁定格保持虚线但换成淡紫
- `src/pages/principles/index.tsx`：分组标题改贴纸，已解锁卡加胶带，未解锁卡改灰紫虚线 + 墨线锁形
- 关卡 `LevelTopBar.tsx`：阶段胶囊改 `.doodle-pill`，当前阶段用柠檬贴纸
- `StoryStage.tsx`：`brief` 从灰条改为「便签纸」样式（柠檬底 + 胶带）
- `ChoiceStage.tsx`：约束卡改薄荷便签；选项卡改 `.doodle-card`，A/B/C 字母改旋转贴纸，hover 回正
- `OutcomeStage.tsx` / `ReviewStage.tsx`：结果卡改马卡龙粉/薄荷底 + 贴纸边；章节完成横幅改贴纸；`tradeoff` 虚线框改手绘虚线
- `src/components/comic/SpeechBubble.tsx`：气泡改不规则圆角（大圆角 + 一个小尖角），气泡尾改为手绘三角；旁白标签改斜置胶带
- `src/components/comic/Character.tsx`：描边加粗到 2.6/3，腮红用 `fill-primary/40`，头发/服装走新章节色（填充类名不变，令牌生效）
- `src/pages/play/index.tsx`、`src/pages/NotFound.tsx`：卡片改 `.doodle-card` + 胶带 + 涂鸦装饰

### 5. 场景图柔和化（保持可读）

- `src/components/scene/SceneMark.tsx`：标签改手绘圆角（`rx` 保持胶囊即可，描边加到 1.8k）
- `FloorPlanView.tsx`：承重墙斜纹由 `stroke-accent` 改为淡柠檬 + 深梅描边；墙体外框加 1px 淡紫描边提升层次；流线/门窗沿用令牌
- `ElevationView.tsx`：房间外框描边保持 `stroke-ink`，地面线改 1.5；日照光束透明度略降
- `BudgetView.tsx`：`barTone` 改为马卡龙（fixed 薰衣草、flex 薄荷、cut 灰紫、highlight 柠檬、problem 树莓），合计卡改 `.doodle-card`
- `src/components/scene/Furniture.tsx`、`ElevGlyph.tsx`、`materials.ts`：不改逻辑，随 `--mat-*` 令牌自动变柔和；仅在有硬编码 `fill-primary/30` 处核对对比度

## 关键文件

- `src/index.css`（核心：令牌 + 涂鸦工具类）
- `tailwind.config.ts`、`index.html`（字体 / 阴影 / 动画）
- `src/components/ui/button.tsx`、`src/components/ui/badge.tsx`
- `src/components/game/ProgressBar.tsx`、`PrincipleCard.tsx`
- `src/pages/home/{HeroSection,ChapterSection,LevelNode}.tsx`
- `src/pages/play/{LevelTopBar,StoryStage,ChoiceStage,OutcomeStage,ReviewStage}.tsx`
- `src/pages/principles/index.tsx`
- `src/components/comic/{SpeechBubble,Character}.tsx`，新增 `src/components/comic/Doodle.tsx`
- `src/components/scene/{SceneMark,FloorPlanView,ElevationView,BudgetView}.tsx`

## 验证

1. `pnpm run check`（eslint + tsc）与 `pnpm run build` 全部通过。
2. `pnpm dev` 后按路由检查：
   - `/`：首页 hero、章节卡、50 个关卡格、清空进度弹窗
   - `/play/c1-l01`：故事 → 选择 → 结果 → 复盘四阶段；选错触发 shake，选对进入复盘
   - `/principles`：已解锁 / 未解锁卡片两种状态
   - `/play/c1-l50`（未解锁）：锁定页；`/nope`：404 页
3. `website_screenshot` 在 `mobile_390` 与 `desktop_1280` 两档宽度截取 `/`、`/play/c1-l01`、`/principles`，确认小屏不溢出、卡片不重叠、胶带不遮挡文字。
4. 移动端关卡页检查 `100dvh` 布局：场景区 + 文本区的两段布局在竖屏正常滚动，操作栏不被遮挡。
5. 对比度抽查：深墨字在草莓粉 / 薄荷 / 柠檬 / 薰衣草底色上、胶囊阶段标签、进度条数字需清晰可读；`text-primary-ink` 替换后无浅粉字压浅底的情况。

## Implementation checklist

- [ ] `src/index.css` 全量替换 `:root` 色值（基础 / 主色 / 状态 / 章节 / 户型 / 材质 / 光照 / 阴影）
- [ ] `src/index.css` 新增 `--primary-ink`，并在 `tailwind.config.ts` 映射为 `primary.ink`
- [ ] `src/index.css` 新增 `.doodle-card`、`.doodle-card-alt`、`.doodle-pill`、`.sticker`、`.tape`、`.tape-mint`、`.doodle-underline`、`.tilt-*`、`.crayon-stripes`、`.paper-grain`、`.wobble-hover`
- [ ] `body` 背景改为奶油底 + 三色柔光 + 纸纹，`paper-dots` 改为淡紫点阵
- [ ] `tailwind.config.ts` display 字体换 `ZCOOL KuaiLe`，新增 `shadow-sticker`、`wiggle`、`float`
- [ ] `index.html` 更新 Google Fonts 链接与 `theme-color`
- [ ] `button.tsx` 的 comic 系列改手绘圆角 + 双层阴影 + hover 微抖，`link` 用 `text-primary-ink`
- [ ] `badge.tsx` 的 `ink` / `accent` 改贴纸造型，新增 `pastel` 变体
- [ ] `ProgressBar.tsx` 轨道改手绘胶囊 + 斜纹填充
- [ ] `PrincipleCard.tsx` 改 `.doodle-card` + 交替倾斜 + 胶带
- [ ] `HeroSection.tsx` 换装并接入 `Doodle` 装饰
- [ ] `ChapterSection.tsx` 序号改旋转贴纸，`LevelNode.tsx` 关卡格改贴纸质感
- [ ] `LevelTopBar.tsx`、`StoryStage.tsx`、`ChoiceStage.tsx`、`OutcomeStage.tsx`、`ReviewStage.tsx` 全部换装
- [ ] `principles/index.tsx`、`play/index.tsx`、`NotFound.tsx` 换装
- [ ] `SpeechBubble.tsx` 气泡与旁白胶带改手绘，`Character.tsx` 加粗描边 + 粉腮红
- [ ] `SceneMark.tsx`、`FloorPlanView.tsx`、`ElevationView.tsx`、`BudgetView.tsx` 调色并保持描边可读
- [ ] 新增 `src/components/comic/Doodle.tsx`（Squiggle / Sparkle / Sunburst / ArrowDoodle / StarDoodle）

## Verification checklist

- [ ] `pnpm run lint` 无报错
- [ ] `pnpm exec tsc --noEmit` 无类型错误
- [ ] `pnpm run build` 成功
- [ ] `/` 在 `mobile_390` 与 `desktop_1280` 截图通过：无横向溢出、关卡格不重叠、胶带/涂鸦不遮挡文字
- [ ] `/play/c1-l01` 四个阶段可正常推进，选错出 shake 与重试按钮，选对进入复盘并写入通关进度
- [ ] `/play/c1-l50` 未解锁时显示锁定页，`/nope` 显示 404，两页均为新风格
- [ ] `/principles` 已解锁与未解锁两种卡片均正常显示，分组贴纸不换行溢出
- [ ] 关卡页竖屏 `100dvh` 布局下文本区可滚动、操作栏不被裁切
- [ ] 浅色底上的正文/图标均为深墨或 `primary-ink`，无浅粉字压浅底
