/**
 * Development-time content checks for the 50 levels.
 * Runs once at startup in dev (see main.tsx) and logs every issue found.
 */
import { CHAPTERS } from "./chapters";
import { ACHIEVEMENTS } from "./achievements";
import { LEVELS } from "./levels";
import { principleById } from "./principles";
import { danglingRefs } from "./scenes/apply-ops";

export const EXPECTED_LEVELS = 50;
export const LEVELS_PER_CHAPTER = 10;

export function validateContent(): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();

  if (LEVELS.length !== EXPECTED_LEVELS) issues.push(`共有 ${LEVELS.length} 关，应为 ${EXPECTED_LEVELS}`);

  for (const ch of CHAPTERS) {
    const n = LEVELS.filter((l) => l.chapterId === ch.id).length;
    if (n !== LEVELS_PER_CHAPTER) issues.push(`${ch.id} 有 ${n} 关，应为 ${LEVELS_PER_CHAPTER}`);
  }

  for (const level of LEVELS) {
    const at = (msg: string) => issues.push(`[${level.id}] ${msg}`);
    if (seen.has(level.id)) at("ID 重复");
    seen.add(level.id);

    if (!CHAPTERS.some((c) => c.id === level.chapterId)) at(`未知章节 ${level.chapterId}`);
    if (!level.title || !level.brief || !level.question || !level.insight) at("标题/简介/问题/启发有空值");
    if (level.constraints.length === 0) at("缺少客户约束");
    if (level.panels.length < 4 || level.panels.length > 6) at(`分镜 ${level.panels.length} 幕，应为 4–6`);
    if (level.panels.some((p) => !p.text.trim())) at("有空白台词");
    if (level.panels.some((p) => p.speaker === "partner") && !level.partner) at("使用了 partner 但未定义");
    if (level.options.length < 2 || level.options.length > 3) at(`选项 ${level.options.length} 个，应为 2–3`);
    if (!level.options.some((o) => o.passes)) at("没有可通关选项");
    if (!level.options.some((o) => !o.passes)) at("没有不合适的选项");
    if (level.principleIds.length === 0) at("没有关联法则");
    level.principleIds.forEach((id) => !principleById.has(id) && at(`未知法则 ${id}`));

    const optIds = new Set<string>();
    for (const opt of level.options) {
      if (optIds.has(opt.id)) at(`选项 ID 重复 ${opt.id}`);
      optIds.add(opt.id);
      if (!opt.label || !opt.detail || !opt.reaction.text) at(`选项 ${opt.id} 文案不完整`);
      if (opt.passes && !opt.tradeoff) at(`通过选项 ${opt.id} 缺少取舍说明`);
      if (!opt.passes && !opt.problem) at(`失败选项 ${opt.id} 缺少具体问题`);
      if (opt.ops.length === 0) at(`选项 ${opt.id} 没有可见的空间变化`);
      danglingRefs(level.base, opt.ops).forEach((ref) => at(`选项 ${opt.id} 引用了不存在的元素 ${ref}`));
    }

    level.panels.forEach((panel, i) =>
      danglingRefs(level.base, (panel.focus ?? []).map((id) => ({ op: "patch", id, set: {} }))).forEach((ref) =>
        at(`第 ${i + 1} 幕高亮了不存在的元素 ${ref}`),
      ),
    );
  }

  const seenAchievements = new Set<string>();
  for (const achievement of ACHIEVEMENTS) {
    if (seenAchievements.has(achievement.id)) issues.push(`[achievement] ID 重复 ${achievement.id}`);
    seenAchievements.add(achievement.id);
    if (achievement.target <= 0) issues.push(`[achievement] ${achievement.id} 的目标值必须大于 0`);
    if (achievement.id.startsWith("chapter-") && !CHAPTERS.some((c) => `chapter-${c.id}` === achievement.id))
      issues.push(`[achievement] ${achievement.id} 引用了不存在的章节`);
  }

  return issues;
}

export function reportContentIssues() {
  const issues = validateContent();
  if (issues.length) console.error(`[content] ${issues.length} 个内容问题：\n${issues.join("\n")}`);
  else console.info(`[content] ${LEVELS.length} 关内容校验通过`);
}
