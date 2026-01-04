export interface Template {
    id: string;
    name: string;
    fields: Field[];
}

export interface Field {
    key: string;
    label: string;
    type: 'text' | 'image' | 'template';
    value?: string;
}

export interface BatchApplyResult {
    success: boolean;
    message: string;
}

export interface TableData {
    id: string;
    title: string;
    fields: Record<string, any>;
}

export interface PluginConfig {
    apiKey: string;
    version: string;
    permissions: string[];
}

// ========== 海报生成相关类型定义 ==========

/**
 * 海报元素类型
 */
export type PosterElementType = 'text' | 'image' | 'tag' | 'background';

/**
 * 文本对齐方式
 */
export type TextAlign = 'left' | 'center' | 'right';

/**
 * 字体样式
 */
export interface FontStyle {
    family: string;
    size: number;
    weight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    color: string;
    lineHeight?: number;
}

/**
 * 位置和尺寸
 */
export interface Position {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * 海报元素基础接口
 */
export interface PosterElementBase {
    id: string;
    type: PosterElementType;
    position: Position;
    zIndex?: number;
}

/**
 * 文本元素
 */
export interface TextElement extends PosterElementBase {
    type: 'text';
    content: string;
    fontStyle: FontStyle;
    align: TextAlign;
    maxLines?: number; // 最大行数，超出显示省略号
    fieldKey?: string; // 映射的表格字段key
}

/**
 * 图片元素
 */
export interface ImageElement extends PosterElementBase {
    type: 'image';
    src: string;
    fit: 'cover' | 'contain' | 'fill' | 'none';
    borderRadius?: number;
    fieldKey?: string; // 映射的表格字段key（附件字段）
}

/**
 * 标签元素
 */
export interface TagElement extends PosterElementBase {
    type: 'tag';
    tags: string[];
    tagStyle: {
        backgroundColor: string;
        textColor: string;
        fontSize: number;
        padding: { x: number; y: number };
        borderRadius: number;
        spacing: number; // 标签之间的间距
    };
    fieldKey?: string; // 映射的表格字段key
}

/**
 * 背景元素
 */
export interface BackgroundElement extends PosterElementBase {
    type: 'background';
    backgroundColor?: string;
    backgroundImage?: string;
}

/**
 * 海报元素联合类型
 */
export type PosterElement = TextElement | ImageElement | TagElement | BackgroundElement;

/**
 * 海报模板
 */
export interface PosterTemplate {
    id: string;
    name: string;
    description?: string;
    width: number;
    height: number;
    elements: PosterElement[];
    thumbnail?: string; // 模板缩略图
    createdAt: string;
    updatedAt: string;
}

/**
 * 字段映射配置
 */
export interface FieldMapping {
    elementId: string; // 海报元素ID
    fieldKey: string; // 表格字段key
    fieldName: string; // 表格字段名称
    fieldType: 'text' | 'attachment' | 'multiSelect' | 'singleSelect'; // 飞书字段类型
}

/**
 * 海报配置
 */
export interface PosterConfig {
    templateId: string;
    fieldMappings: FieldMapping[];
    outputFormat: 'png' | 'jpg';
    quality?: number; // 图片质量 0-1
}

/**
 * 飞书表格字段定义
 */
export interface FeishuFieldMeta {
    fieldKey: string;
    fieldName: string;
    fieldType: 'text' | 'number' | 'attachment' | 'multiSelect' | 'singleSelect' | 'date' | 'url';
}

/**
 * 飞书表格行数据
 */
export interface FeishuTableRow {
    recordId: string;
    fields: Record<string, any>;
}

/**
 * 飞书附件
 */
export interface FeishuAttachment {
    fileToken: string;
    name: string;
    size: number;
    type: string;
    url: string;
    tmpUrl?: string;
}

/**
 * 海报生成结果
 */
export interface PosterGenerationResult {
    recordId: string;
    success: boolean;
    dataUrl?: string; // base64 图片数据
    blob?: Blob;
    error?: string;
}

/**
 * 批量生成进度
 */
export interface BatchGenerationProgress {
    total: number;
    completed: number;
    failed: number;
    current?: string; // 当前处理的记录ID
    results: PosterGenerationResult[];
}