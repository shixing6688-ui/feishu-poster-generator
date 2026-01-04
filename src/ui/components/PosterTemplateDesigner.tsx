import React, { useState } from 'react';
import {
  PosterTemplate,
  PosterElement,
  TextElement,
  ImageElement,
  TagElement,
  BackgroundElement,
  PosterElementType,
} from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { backgroundPresets, getBackgroundPresetsByType } from '../../utils/backgroundPresets';

interface PosterTemplateDesignerProps {
  template?: PosterTemplate;
  onSave: (template: PosterTemplate) => void;
  onCancel: () => void;
}

const PosterTemplateDesigner: React.FC<PosterTemplateDesignerProps> = ({
  template,
  onSave,
  onCancel,
}) => {
  const [currentTemplate, setCurrentTemplate] = useState<PosterTemplate>(
    template || {
      id: uuidv4(),
      name: '新模板',
      width: 750,
      height: 1334,
      elements: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );

  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [dragging, setDragging] = useState<{
    elementId: string;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  // 添加元素
  const addElement = (type: PosterElementType) => {
    const basePosition = {
      x: 50,
      y: 50,
      width: 200,
      height: 100,
    };

    let newElement: PosterElement;

    if (type === 'background') {
      newElement = {
        id: uuidv4(),
        type: 'background',
        position: { x: 0, y: 0, width: currentTemplate.width, height: currentTemplate.height },
        zIndex: 0,
        backgroundColor: '#ffffff',
      };
    } else if (type === 'text') {
      newElement = {
        id: uuidv4(),
        type: 'text',
        position: basePosition,
        zIndex: currentTemplate.elements.length + 1,
        content: '文本内容',
        fontStyle: {
          family: 'Arial, sans-serif',
          size: 24,
          weight: 'normal',
          color: '#000000',
          lineHeight: 1.5,
        },
        align: 'left',
      };
    } else if (type === 'image') {
      newElement = {
        id: uuidv4(),
        type: 'image',
        position: { ...basePosition, height: 200 },
        zIndex: currentTemplate.elements.length + 1,
        src: '',
        fit: 'cover',
        borderRadius: 0,
      };
    } else if (type === 'tag') {
      newElement = {
        id: uuidv4(),
        type: 'tag',
        position: basePosition,
        zIndex: currentTemplate.elements.length + 1,
        tags: ['标签1', '标签2'],
        tagStyle: {
          backgroundColor: '#e0e0e0',
          textColor: '#333333',
          fontSize: 14,
          padding: { x: 8, y: 4 },
          borderRadius: 4,
          spacing: 8,
        },
      };
    } else {
      return;
    }

    setCurrentTemplate({
      ...currentTemplate,
      elements: [...currentTemplate.elements, newElement] as PosterElement[],
    });
    setSelectedElement(newElement.id);
  };

  // 更新元素
  const updateElement = (elementId: string, updates: Partial<PosterElement>) => {
    setCurrentTemplate({
      ...currentTemplate,
      elements: currentTemplate.elements.map((el) =>
        el.id === elementId ? { ...el, ...updates } as PosterElement : el
      ),
    });
  };

  // 删除元素
  const deleteElement = (elementId: string) => {
    setCurrentTemplate({
      ...currentTemplate,
      elements: currentTemplate.elements.filter((el) => el.id !== elementId),
    });
    if (selectedElement === elementId) {
      setSelectedElement(null);
    }
  };

  // 保存模板
  const handleSave = () => {
    onSave({
      ...currentTemplate,
      updatedAt: new Date().toISOString(),
    });
  };

  // 处理鼠标按下事件（开始拖拽）
  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    const element = currentTemplate.elements.find((el) => el.id === elementId);
    if (!element) return;

    setSelectedElement(elementId);
    setDragging({
      elementId,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: element.position.x,
      offsetY: element.position.y,
    });
  };

  // 处理鼠标移动事件（拖拽中）
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;

    const deltaX = e.clientX - dragging.startX;
    const deltaY = e.clientY - dragging.startY;

    updateElement(dragging.elementId, {
      position: {
        ...currentTemplate.elements.find((el) => el.id === dragging.elementId)!.position,
        x: Math.max(0, Math.min(currentTemplate.width - 50, dragging.offsetX + deltaX)),
        y: Math.max(0, Math.min(currentTemplate.height - 50, dragging.offsetY + deltaY)),
      },
    });
  };

  // 处理鼠标释放事件（结束拖拽）
  const handleMouseUp = () => {
    setDragging(null);
  };

  const selectedElementData = currentTemplate.elements.find(
    (el) => el.id === selectedElement
  );

  return (
    <div className="poster-template-designer">
      <div className="designer-header">
        <input
          type="text"
          value={currentTemplate.name}
          onChange={(e) =>
            setCurrentTemplate({ ...currentTemplate, name: e.target.value })
          }
          className="template-name-input"
          placeholder="模板名称"
        />
        <div className="header-actions">
          <button onClick={onCancel} className="btn-secondary">
            取消
          </button>
          <button onClick={handleSave} className="btn-primary">
            保存模板
          </button>
        </div>
      </div>

      <div className="designer-body">
        {/* 左侧工具栏 */}
        <div className="designer-toolbar">
          <h3>添加元素</h3>
          <button onClick={() => addElement('background')} className="tool-btn">
            📄 背景
          </button>
          <button onClick={() => addElement('text')} className="tool-btn">
            📝 文本
          </button>
          <button onClick={() => addElement('image')} className="tool-btn">
            🖼️ 图片
          </button>
          <button onClick={() => addElement('tag')} className="tool-btn">
            🏷️ 标签
          </button>
        </div>

        {/* 中间画布区域 */}
        <div className="designer-canvas-wrapper">
          <div
            className="designer-canvas"
            style={{
              width: currentTemplate.width,
              height: currentTemplate.height,
              position: 'relative',
              backgroundColor: '#f5f5f5',
              margin: '0 auto',
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {currentTemplate.elements.map((element) => (
              <div
                key={element.id}
                className={`canvas-element ${selectedElement === element.id ? 'selected' : ''}`}
                style={{
                  position: 'absolute',
                  left: element.position.x,
                  top: element.position.y,
                  width: element.position.width,
                  height: element.position.height,
                  border: selectedElement === element.id ? '2px solid #1890ff' : '1px dashed #ccc',
                  cursor: dragging?.elementId === element.id ? 'grabbing' : 'grab',
                  zIndex: element.zIndex || 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  userSelect: 'none',
                }}
                onMouseDown={(e) => handleMouseDown(e, element.id)}
              >
                <div className="element-label" style={{ pointerEvents: 'none' }}>
                  {element.type === 'text' && '📝 文本'}
                  {element.type === 'image' && '🖼️ 图片'}
                  {element.type === 'tag' && '🏷️ 标签'}
                  {element.type === 'background' && '📄 背景'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧属性面板 */}
        <div className="designer-properties">
          <h3>属性设置</h3>
          {selectedElementData ? (
            <ElementProperties
              element={selectedElementData}
              onUpdate={(updates) => updateElement(selectedElementData.id, updates)}
              onDelete={() => deleteElement(selectedElementData.id)}
            />
          ) : (
            <div className="no-selection">请选择一个元素</div>
          )}
        </div>
      </div>
    </div>
  );
};

// 元素属性编辑组件
interface ElementPropertiesProps {
  element: PosterElement;
  onUpdate: (updates: Partial<PosterElement>) => void;
  onDelete: () => void;
}

const ElementProperties: React.FC<ElementPropertiesProps> = ({
  element,
  onUpdate,
  onDelete,
}) => {
  return (
    <div className="element-properties">
      <h4>{element.type} 元素</h4>

      {/* 位置和尺寸 */}
      <div className="property-group">
        <label>位置和尺寸</label>
        <div className="property-row">
          <input
            type="number"
            value={element.position.x}
            onChange={(e) =>
              onUpdate({ position: { ...element.position, x: Number(e.target.value) } })
            }
            placeholder="X"
          />
          <input
            type="number"
            value={element.position.y}
            onChange={(e) =>
              onUpdate({ position: { ...element.position, y: Number(e.target.value) } })
            }
            placeholder="Y"
          />
        </div>
        <div className="property-row">
          <input
            type="number"
            value={element.position.width}
            onChange={(e) =>
              onUpdate({ position: { ...element.position, width: Number(e.target.value) } })
            }
            placeholder="宽度"
          />
          <input
            type="number"
            value={element.position.height}
            onChange={(e) =>
              onUpdate({ position: { ...element.position, height: Number(e.target.value) } })
            }
            placeholder="高度"
          />
        </div>
      </div>

      {/* 根据元素类型显示特定属性 */}
      {element.type === 'text' && (
        <TextElementProperties element={element as TextElement} onUpdate={onUpdate} />
      )}
      {element.type === 'image' && (
        <ImageElementProperties element={element as ImageElement} onUpdate={onUpdate} />
      )}
      {element.type === 'tag' && (
        <TagElementProperties element={element as TagElement} onUpdate={onUpdate} />
      )}
      {element.type === 'background' && (
        <BackgroundElementProperties element={element as BackgroundElement} onUpdate={onUpdate} />
      )}

      <button onClick={onDelete} className="btn-danger" style={{ marginTop: '20px' }}>
        删除元素
      </button>
    </div>
  );
};

// 文本元素属性
const TextElementProperties: React.FC<{
  element: TextElement;
  onUpdate: (updates: Partial<TextElement>) => void;
}> = ({ element, onUpdate }) => {
  return (
    <>
      <div className="property-group">
        <label>文本内容</label>
        <textarea
          value={element.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          rows={3}
        />
      </div>

      <div className="property-group">
        <label>字段映射</label>
        <input
          type="text"
          value={element.fieldKey || ''}
          onChange={(e) => onUpdate({ fieldKey: e.target.value })}
          placeholder="表格字段 key"
        />
      </div>

      <div className="property-group">
        <label>字体大小</label>
        <input
          type="number"
          value={element.fontStyle.size}
          onChange={(e) =>
            onUpdate({
              fontStyle: { ...element.fontStyle, size: Number(e.target.value) },
            })
          }
        />
      </div>

      <div className="property-group">
        <label>字体颜色</label>
        <input
          type="color"
          value={element.fontStyle.color}
          onChange={(e) =>
            onUpdate({
              fontStyle: { ...element.fontStyle, color: e.target.value },
            })
          }
        />
      </div>

      <div className="property-group">
        <label>对齐方式</label>
        <select
          value={element.align}
          onChange={(e) => onUpdate({ align: e.target.value as any })}
        >
          <option value="left">左对齐</option>
          <option value="center">居中</option>
          <option value="right">右对齐</option>
        </select>
      </div>

      <div className="property-group">
        <label>最大行数</label>
        <input
          type="number"
          value={element.maxLines || ''}
          onChange={(e) => onUpdate({ maxLines: Number(e.target.value) || undefined })}
          placeholder="不限制"
        />
      </div>
    </>
  );
};

// 图片元素属性
const ImageElementProperties: React.FC<{
  element: ImageElement;
  onUpdate: (updates: Partial<ImageElement>) => void;
}> = ({ element, onUpdate }) => {
  return (
    <>
      <div className="property-group">
        <label>图片</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  const dataUrl = event.target?.result as string;
                  onUpdate({ src: dataUrl });
                };
                reader.readAsDataURL(file);
              }
            }}
            style={{ fontSize: '12px' }}
          />
          <input
            type="text"
            value={element.src || ''}
            onChange={(e) => onUpdate({ src: e.target.value })}
            placeholder="或输入图片 URL"
            style={{ fontSize: '12px' }}
          />
          {element.src && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <img
                src={element.src}
                alt="图片预览"
                style={{
                  width: '100%',
                  height: '100px',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0',
                  background: '#f5f5f5',
                }}
              />
              <button
                onClick={() => onUpdate({ src: '' })}
                className="btn-secondary"
                style={{ fontSize: '12px', padding: '4px 8px', whiteSpace: 'nowrap' }}
              >
                移除
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="property-group">
        <label>字段映射（附件）</label>
        <input
          type="text"
          value={element.fieldKey || ''}
          onChange={(e) => onUpdate({ fieldKey: e.target.value })}
          placeholder="表格附件字段 key"
        />
      </div>

      <div className="property-group">
        <label>填充模式</label>
        <select value={element.fit} onChange={(e) => onUpdate({ fit: e.target.value as any })}>
          <option value="cover">覆盖</option>
          <option value="contain">包含</option>
          <option value="fill">拉伸</option>
          <option value="none">原始</option>
        </select>
      </div>

      <div className="property-group">
        <label>圆角</label>
        <input
          type="number"
          value={element.borderRadius || 0}
          onChange={(e) => onUpdate({ borderRadius: Number(e.target.value) })}
        />
      </div>
    </>
  );
};

// 标签元素属性
const TagElementProperties: React.FC<{
  element: TagElement;
  onUpdate: (updates: Partial<TagElement>) => void;
}> = ({ element, onUpdate }) => {
  return (
    <>
      <div className="property-group">
        <label>标签内容（逗号分隔）</label>
        <input
          type="text"
          value={element.tags.join(', ')}
          onChange={(e) =>
            onUpdate({ tags: e.target.value.split(',').map((t) => t.trim()) })
          }
        />
      </div>

      <div className="property-group">
        <label>字段映射</label>
        <input
          type="text"
          value={element.fieldKey || ''}
          onChange={(e) => onUpdate({ fieldKey: e.target.value })}
          placeholder="表格标签字段 key"
        />
      </div>

      <div className="property-group">
        <label>背景颜色</label>
        <input
          type="color"
          value={element.tagStyle.backgroundColor}
          onChange={(e) =>
            onUpdate({
              tagStyle: { ...element.tagStyle, backgroundColor: e.target.value },
            })
          }
        />
      </div>

      <div className="property-group">
        <label>文字颜色</label>
        <input
          type="color"
          value={element.tagStyle.textColor}
          onChange={(e) =>
            onUpdate({
              tagStyle: { ...element.tagStyle, textColor: e.target.value },
            })
          }
        />
      </div>

      <div className="property-group">
        <label>字体大小</label>
        <input
          type="number"
          value={element.tagStyle.fontSize}
          onChange={(e) =>
            onUpdate({
              tagStyle: { ...element.tagStyle, fontSize: Number(e.target.value) },
            })
          }
        />
      </div>
    </>
  );
};

// 背景元素属性
const BackgroundElementProperties: React.FC<{
  element: BackgroundElement;
  onUpdate: (updates: Partial<BackgroundElement>) => void;
}> = ({ element, onUpdate }) => {
  const [showPresets, setShowPresets] = useState(false);
  const [presetType, setPresetType] = useState<'solid' | 'gradient'>('gradient');

  const handlePresetSelect = (presetValue: string) => {
    if (presetValue.startsWith('linear-gradient')) {
      onUpdate({ backgroundColor: presetValue });
    } else {
      onUpdate({ backgroundColor: presetValue });
    }
    setShowPresets(false);
  };

  return (
    <>
      <div className="property-group">
        <label>背景类型</label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="btn-secondary"
            style={{ flex: 1, fontSize: '12px', padding: '6px 12px' }}
          >
            {showPresets ? '隐藏预设' : '🎨 选择预设'}
          </button>
          <button
            onClick={() => onUpdate({ backgroundColor: '#ffffff', backgroundImage: '' })}
            className="btn-secondary"
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            清除
          </button>
        </div>
      </div>

      {showPresets && (
        <div className="property-group">
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <button
              onClick={() => setPresetType('solid')}
              className={presetType === 'solid' ? 'btn-primary' : 'btn-secondary'}
              style={{ flex: 1, fontSize: '12px', padding: '6px' }}
            >
              纯色
            </button>
            <button
              onClick={() => setPresetType('gradient')}
              className={presetType === 'gradient' ? 'btn-primary' : 'btn-secondary'}
              style={{ flex: 1, fontSize: '12px', padding: '6px' }}
            >
              渐变
            </button>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            {getBackgroundPresetsByType(presetType).map((preset) => (
              <div
                key={preset.id}
                onClick={() => handlePresetSelect(preset.value)}
                style={{
                  width: '100%',
                  height: '60px',
                  background: preset.preview,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: element.backgroundColor === preset.value ? '3px solid #667eea' : '2px solid #e0e0e0',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '4px',
                }}
                title={preset.description}
              >
                <span
                  style={{
                    fontSize: '10px',
                    color: presetType === 'solid' && preset.value === '#000000' ? '#fff' : '#333',
                    background: 'rgba(255, 255, 255, 0.8)',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    fontWeight: 500,
                  }}
                >
                  {preset.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="property-group">
        <label>自定义颜色</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="color"
            value={element.backgroundColor?.startsWith('#') ? element.backgroundColor : '#ffffff'}
            onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
            style={{ width: '50px', height: '36px' }}
          />
          <input
            type="text"
            value={element.backgroundColor || '#ffffff'}
            onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
            placeholder="颜色值或渐变"
            style={{ flex: 1 }}
          />
        </div>
      </div>

      <div className="property-group">
        <label>背景图片</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  const dataUrl = event.target?.result as string;
                  onUpdate({ backgroundImage: dataUrl });
                };
                reader.readAsDataURL(file);
              }
            }}
            style={{ fontSize: '12px' }}
          />
          <input
            type="text"
            value={element.backgroundImage || ''}
            onChange={(e) => onUpdate({ backgroundImage: e.target.value })}
            placeholder="或输入图片 URL"
            style={{ fontSize: '12px' }}
          />
          {element.backgroundImage && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <img
                src={element.backgroundImage}
                alt="背景预览"
                style={{
                  width: '100%',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0',
                }}
              />
              <button
                onClick={() => onUpdate({ backgroundImage: '' })}
                className="btn-secondary"
                style={{ fontSize: '12px', padding: '4px 8px', whiteSpace: 'nowrap' }}
              >
                移除
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PosterTemplateDesigner;
