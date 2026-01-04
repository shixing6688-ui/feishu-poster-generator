import { PosterTemplate } from '../types';

const STORAGE_KEY = 'feishu_poster_templates';

/**
 * 保存模板到 localStorage
 */
export const saveTemplate = (template: PosterTemplate): void => {
  try {
    const templates = loadTemplates();
    const existingIndex = templates.findIndex((t) => t.id === template.id);

    if (existingIndex !== -1) {
      // 更新现有模板
      templates[existingIndex] = template;
    } else {
      // 添加新模板
      templates.push(template);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('保存模板失败:', error);
    throw error;
  }
};

/**
 * 从 localStorage 加载所有模板
 */
export const loadTemplates = (): PosterTemplate[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }
    return JSON.parse(data) as PosterTemplate[];
  } catch (error) {
    console.error('加载模板失败:', error);
    return [];
  }
};

/**
 * 删除指定模板
 */
export const deleteTemplate = (templateId: string): void => {
  try {
    const templates = loadTemplates();
    const filteredTemplates = templates.filter((t) => t.id !== templateId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTemplates));
  } catch (error) {
    console.error('删除模板失败:', error);
    throw error;
  }
};

/**
 * 获取单个模板
 */
export const getTemplate = (templateId: string): PosterTemplate | null => {
  const templates = loadTemplates();
  return templates.find((t) => t.id === templateId) || null;
};

/**
 * 导出模板为 JSON
 */
export const exportTemplate = (template: PosterTemplate): string => {
  return JSON.stringify(template, null, 2);
};

/**
 * 从 JSON 导入模板
 */
export const importTemplate = (jsonString: string): PosterTemplate => {
  try {
    const template = JSON.parse(jsonString) as PosterTemplate;
    // 验证模板结构
    if (!template.id || !template.name || !template.elements) {
      throw new Error('无效的模板格式');
    }
    return template;
  } catch (error) {
    console.error('导入模板失败:', error);
    throw new Error('导入模板失败，请检查 JSON 格式');
  }
};