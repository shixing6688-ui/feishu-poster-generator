import React, { useState, useEffect } from 'react';
import {
  PosterTemplate,
  FieldMapping,
  FeishuFieldMeta,
  PosterElement,
} from '../../types';

interface FieldMapperProps {
  template: PosterTemplate;
  availableFields: FeishuFieldMeta[];
  initialMappings?: FieldMapping[];
  onMappingsChange: (mappings: FieldMapping[]) => void;
}

const FieldMapper: React.FC<FieldMapperProps> = ({
  template,
  availableFields,
  initialMappings = [],
  onMappingsChange,
}) => {
  const [mappings, setMappings] = useState<FieldMapping[]>(initialMappings);

  // 获取所有可映射的元素（有 fieldKey 属性的元素）
  const mappableElements = template.elements.filter(
    (el) => 'fieldKey' in el && el.fieldKey !== undefined
  );

  useEffect(() => {
    onMappingsChange(mappings);
  }, [mappings, onMappingsChange]);

  // 更新映射
  const updateMapping = (elementId: string, fieldKey: string) => {
    const element = template.elements.find((el) => el.id === elementId);
    const field = availableFields.find((f) => f.fieldKey === fieldKey);

    if (!element || !field) return;

    const existingIndex = mappings.findIndex((m) => m.elementId === elementId);

    if (fieldKey === '') {
      // 移除映射
      if (existingIndex !== -1) {
        setMappings(mappings.filter((m) => m.elementId !== elementId));
      }
    } else {
      // 添加或更新映射
      const newMapping: FieldMapping = {
        elementId,
        fieldKey,
        fieldName: field.fieldName,
        fieldType: field.fieldType as any,
      };

      if (existingIndex !== -1) {
        const newMappings = [...mappings];
        newMappings[existingIndex] = newMapping;
        setMappings(newMappings);
      } else {
        setMappings([...mappings, newMapping]);
      }
    }
  };

  // 获取元素当前的映射
  const getMappingForElement = (elementId: string): string => {
    const mapping = mappings.find((m) => m.elementId === elementId);
    return mapping ? mapping.fieldKey : '';
  };

  // 根据元素类型过滤可用字段
  const getAvailableFieldsForElement = (element: PosterElement): FeishuFieldMeta[] => {
    switch (element.type) {
      case 'text':
        return availableFields.filter(
          (f) => f.fieldType === 'text' || f.fieldType === 'number' || f.fieldType === 'date'
        );
      case 'image':
        return availableFields.filter((f) => f.fieldType === 'attachment');
      case 'tag':
        return availableFields.filter(
          (f) => f.fieldType === 'multiSelect' || f.fieldType === 'singleSelect'
        );
      default:
        return availableFields;
    }
  };

  // 获取元素的显示名称
  const getElementDisplayName = (element: PosterElement): string => {
    switch (element.type) {
      case 'text':
        return `文本: ${(element as any).content?.substring(0, 20) || '未命名'}`;
      case 'image':
        return '图片元素';
      case 'tag':
        return '标签元素';
      default:
        return element.type;
    }
  };

  return (
    <div className="field-mapper">
      <div className="mapper-header">
        <h3>字段映射配置</h3>
        <p className="mapper-description">
          将飞书表格的字段映射到海报模板的元素上，生成时会自动填充数据
        </p>
      </div>

      <div className="mapper-body">
        {mappableElements.length === 0 ? (
          <div className="no-mappable-elements">
            <p>当前模板没有可映射的元素</p>
            <p className="hint">在模板设计器中为元素设置"字段映射"属性后，即可在此配置</p>
          </div>
        ) : (
          <div className="mapping-list">
            {mappableElements.map((element) => {
              const availableFieldsForElement = getAvailableFieldsForElement(element);
              const currentMapping = getMappingForElement(element.id);

              return (
                <div key={element.id} className="mapping-item">
                  <div className="mapping-element">
                    <span className="element-type-badge">{element.type}</span>
                    <span className="element-name">{getElementDisplayName(element)}</span>
                  </div>

                  <div className="mapping-arrow">→</div>

                  <div className="mapping-field">
                    <select
                      value={currentMapping}
                      onChange={(e) => updateMapping(element.id, e.target.value)}
                      className="field-select"
                    >
                      <option value="">请选择字段</option>
                      {availableFieldsForElement.map((field) => (
                        <option key={field.fieldKey} value={field.fieldKey}>
                          {field.fieldName} ({field.fieldType})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mapper-footer">
        <div className="mapping-summary">
          已映射: {mappings.length} / {mappableElements.length}
        </div>
      </div>
    </div>
  );
};

export default FieldMapper;
