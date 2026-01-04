import {
  PosterTemplate,
  PosterElement,
  TextElement,
  ImageElement,
  TagElement,
  BackgroundElement,
  FeishuTableRow,
  FieldMapping,
  PosterGenerationResult,
} from '../types';

/**
 * 海报生成服务
 * 基于 Canvas API 实现海报渲染
 */
export class PosterService {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('无法创建 Canvas 上下文');
    }
    this.ctx = ctx;
  }

  /**
   * 生成单个海报
   */
  async generatePoster(
    template: PosterTemplate,
    rowData: FeishuTableRow,
    fieldMappings: FieldMapping[]
  ): Promise<PosterGenerationResult> {
    try {
      // 设置画布尺寸
      this.canvas.width = template.width;
      this.canvas.height = template.height;

      // 清空画布
      this.ctx.clearRect(0, 0, template.width, template.height);

      // 按 zIndex 排序元素
      const sortedElements = [...template.elements].sort(
        (a, b) => (a.zIndex || 0) - (b.zIndex || 0)
      );

      // 渲染每个元素
      for (const element of sortedElements) {
        await this.renderElement(element, rowData, fieldMappings);
      }

      // 导出为图片
      const dataUrl = this.canvas.toDataURL('image/png', 1.0);
      const blob = await this.dataUrlToBlob(dataUrl);

      return {
        recordId: rowData.recordId,
        success: true,
        dataUrl,
        blob,
      };
    } catch (error) {
      console.error('生成海报失败:', error);
      return {
        recordId: rowData.recordId,
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
      };
    }
  }

  /**
   * 渲染单个元素
   */
  private async renderElement(
    element: PosterElement,
    rowData: FeishuTableRow,
    fieldMappings: FieldMapping[]
  ): Promise<void> {
    switch (element.type) {
      case 'background':
        await this.renderBackground(element as BackgroundElement);
        break;
      case 'text':
        await this.renderText(element as TextElement, rowData, fieldMappings);
        break;
      case 'image':
        await this.renderImage(element as ImageElement, rowData, fieldMappings);
        break;
      case 'tag':
        await this.renderTags(element as TagElement, rowData, fieldMappings);
        break;
    }
  }

  /**
   * 渲染背景
   */
  private async renderBackground(element: BackgroundElement): Promise<void> {
    const { position, backgroundColor, backgroundImage } = element;

    if (backgroundColor) {
      this.ctx.fillStyle = backgroundColor;
      this.ctx.fillRect(position.x, position.y, position.width, position.height);
    }

    if (backgroundImage) {
      const img = await this.loadImage(backgroundImage);
      this.ctx.drawImage(img, position.x, position.y, position.width, position.height);
    }
  }

  /**
   * 渲染文本
   */
  private async renderText(
    element: TextElement,
    rowData: FeishuTableRow,
    fieldMappings: FieldMapping[]
  ): Promise<void> {
    const { position, fontStyle, align, maxLines, fieldKey } = element;
    let content = element.content;

    // 如果有字段映射，使用实际数据
    if (fieldKey) {
      const mapping = fieldMappings.find((m) => m.elementId === element.id);
      if (mapping && rowData.fields[mapping.fieldKey]) {
        content = String(rowData.fields[mapping.fieldKey]);
      }
    }

    // 设置字体样式
    this.ctx.font = `${fontStyle.weight} ${fontStyle.size}px ${fontStyle.family}`;
    this.ctx.fillStyle = fontStyle.color;
    this.ctx.textBaseline = 'top';

    // 文本换行处理
    const lines = this.wrapText(content, position.width);
    const lineHeight = fontStyle.lineHeight || fontStyle.size * 1.2;
    const maxDisplayLines = maxLines || lines.length;

    for (let i = 0; i < Math.min(lines.length, maxDisplayLines); i++) {
      let line = lines[i];
      
      // 如果是最后一行且还有更多内容，添加省略号
      if (i === maxDisplayLines - 1 && lines.length > maxDisplayLines) {
        line = line.substring(0, line.length - 3) + '...';
      }

      const y = position.y + i * lineHeight;
      let x = position.x;

      // 处理对齐方式
      if (align === 'center') {
        const textWidth = this.ctx.measureText(line).width;
        x = position.x + (position.width - textWidth) / 2;
      } else if (align === 'right') {
        const textWidth = this.ctx.measureText(line).width;
        x = position.x + position.width - textWidth;
      }

      this.ctx.fillText(line, x, y);
    }
  }

  /**
   * 渲染图片
   */
  private async renderImage(
    element: ImageElement,
    rowData: FeishuTableRow,
    fieldMappings: FieldMapping[]
  ): Promise<void> {
    const { position, fit, borderRadius, fieldKey } = element;
    let imageSrc = element.src;

    // 如果有字段映射，使用实际数据（附件字段）
    if (fieldKey) {
      const mapping = fieldMappings.find((m) => m.elementId === element.id);
      if (mapping && rowData.fields[mapping.fieldKey]) {
        const attachments = rowData.fields[mapping.fieldKey];
        if (Array.isArray(attachments) && attachments.length > 0) {
          imageSrc = attachments[0].url || attachments[0].tmpUrl;
        }
      }
    }

    if (!imageSrc) return;

    try {
      const img = await this.loadImage(imageSrc);

      // 保存当前状态
      this.ctx.save();

      // 如果有圆角，创建裁剪路径
      if (borderRadius) {
        this.createRoundedRectPath(
          position.x,
          position.y,
          position.width,
          position.height,
          borderRadius
        );
        this.ctx.clip();
      }

      // 根据 fit 模式绘制图片
      this.drawImageWithFit(img, position, fit);

      // 恢复状态
      this.ctx.restore();
    } catch (error) {
      console.error('加载图片失败:', imageSrc, error);
    }
  }

  /**
   * 渲染标签
   */
  private async renderTags(
    element: TagElement,
    rowData: FeishuTableRow,
    fieldMappings: FieldMapping[]
  ): Promise<void> {
    const { position, tagStyle, fieldKey } = element;
    let tags = element.tags;

    // 如果有字段映射，使用实际数据
    if (fieldKey) {
      const mapping = fieldMappings.find((m) => m.elementId === element.id);
      if (mapping && rowData.fields[mapping.fieldKey]) {
        const fieldValue = rowData.fields[mapping.fieldKey];
        if (Array.isArray(fieldValue)) {
          tags = fieldValue.map((item) => (typeof item === 'string' ? item : item.text || item.name));
        } else if (typeof fieldValue === 'string') {
          tags = [fieldValue];
        }
      }
    }

    if (!tags || tags.length === 0) return;

    // 设置字体
    this.ctx.font = `${tagStyle.fontSize}px sans-serif`;

    let currentX = position.x;
    let currentY = position.y;

    for (const tag of tags) {
      const textWidth = this.ctx.measureText(tag).width;
      const tagWidth = textWidth + tagStyle.padding.x * 2;
      const tagHeight = tagStyle.fontSize + tagStyle.padding.y * 2;

      // 如果当前行放不下，换行
      if (currentX + tagWidth > position.x + position.width && currentX > position.x) {
        currentX = position.x;
        currentY += tagHeight + tagStyle.spacing;
      }

      // 绘制标签背景
      this.ctx.fillStyle = tagStyle.backgroundColor;
      this.createRoundedRectPath(currentX, currentY, tagWidth, tagHeight, tagStyle.borderRadius);
      this.ctx.fill();

      // 绘制标签文本
      this.ctx.fillStyle = tagStyle.textColor;
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(
        tag,
        currentX + tagStyle.padding.x,
        currentY + tagHeight / 2
      );

      currentX += tagWidth + tagStyle.spacing;
    }
  }

  /**
   * 文本换行
   */
  private wrapText(text: string, maxWidth: number): string[] {
    const lines: string[] = [];
    const paragraphs = text.split('\n');

    for (const paragraph of paragraphs) {
      if (paragraph.trim() === '') {
        lines.push('');
        continue;
      }

      let currentLine = '';
      const words = paragraph.split('');

      for (const char of words) {
        const testLine = currentLine + char;
        const metrics = this.ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine !== '') {
          lines.push(currentLine);
          currentLine = char;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }
    }

    return lines;
  }

  /**
   * 加载图片
   */
  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * 根据 fit 模式绘制图片
   */
  private drawImageWithFit(
    img: HTMLImageElement,
    position: { x: number; y: number; width: number; height: number },
    fit: 'cover' | 'contain' | 'fill' | 'none'
  ): void {
    const { x, y, width, height } = position;

    switch (fit) {
      case 'fill':
        this.ctx.drawImage(img, x, y, width, height);
        break;

      case 'contain': {
        const scale = Math.min(width / img.width, height / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const offsetX = (width - scaledWidth) / 2;
        const offsetY = (height - scaledHeight) / 2;
        this.ctx.drawImage(img, x + offsetX, y + offsetY, scaledWidth, scaledHeight);
        break;
      }

      case 'cover': {
        const scale = Math.max(width / img.width, height / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const offsetX = (width - scaledWidth) / 2;
        const offsetY = (height - scaledHeight) / 2;
        this.ctx.drawImage(img, x + offsetX, y + offsetY, scaledWidth, scaledHeight);
        break;
      }

      case 'none':
        this.ctx.drawImage(img, x, y);
        break;
    }
  }

  /**
   * 创建圆角矩形路径
   */
  private createRoundedRectPath(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
  }

  /**
   * 将 DataURL 转换为 Blob
   */
  private async dataUrlToBlob(dataUrl: string): Promise<Blob> {
    const response = await fetch(dataUrl);
    return response.blob();
  }

  /**
   * 批量生成海报
   */
  async generateBatch(
    template: PosterTemplate,
    rows: FeishuTableRow[],
    fieldMappings: FieldMapping[],
    onProgress?: (completed: number, total: number) => void
  ): Promise<PosterGenerationResult[]> {
    const results: PosterGenerationResult[] = [];

    for (let i = 0; i < rows.length; i++) {
      const result = await this.generatePoster(template, rows[i], fieldMappings);
      results.push(result);

      if (onProgress) {
        onProgress(i + 1, rows.length);
      }
    }

    return results;
  }
}

/**
 * 导出海报为文件
 */
export const downloadPoster = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * 批量下载海报（打包成 ZIP）
 */
export const downloadPostersAsZip = async (
  results: PosterGenerationResult[],
  zipFilename: string = 'posters.zip'
): Promise<void> => {
  // 注意：需要安装 jszip 库
  // 这里提供接口，实际实现需要引入 JSZip
  console.warn('批量下载功能需要安装 jszip 库');

  // 示例实现（需要 jszip）:
  // const JSZip = require('jszip');
  // const zip = new JSZip();
  // results.forEach((result, index) => {
  //   if (result.success && result.blob) {
  //     zip.file(`poster_${index + 1}.png`, result.blob);
  //   }
  // });
  // const content = await zip.generateAsync({ type: 'blob' });
  // downloadPoster(content, zipFilename);
};

// 创建单例实例
export const posterService = new PosterService();

