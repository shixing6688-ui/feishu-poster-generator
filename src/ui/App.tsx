import React, { useState, useEffect } from 'react';
import PosterTemplateDesigner from './components/PosterTemplateDesigner';
import FieldMapper from './components/FieldMapper';
import PosterPreview from './components/PosterPreview';
import BatchApplyModal from './components/BatchApplyModal';
import {
  PosterTemplate,
  FeishuTableRow,
  FeishuFieldMeta,
  FieldMapping,
} from '../types';
import { feishuApi } from '../services/feishuApi';
import { saveTemplate, loadTemplates, deleteTemplate } from '../services/templateService';
import { mockFields, mockRows, USE_MOCK_DATA } from '../utils/mockData';

type WorkflowStep = 'template-list' | 'template-design' | 'field-mapping' | 'preview' | 'batch-generate';

const App: React.FC = () => {
  // 状态管理
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('template-list');
  const [templates, setTemplates] = useState<PosterTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PosterTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<PosterTemplate | null>(null);

  // 飞书数据
  const [appToken, setAppToken] = useState<string>('');
  const [tableId, setTableId] = useState<string>('');
  const [tableFields, setTableFields] = useState<FeishuFieldMeta[]>([]);
  const [tableRows, setTableRows] = useState<FeishuTableRow[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // 字段映射和预览
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [previewRowIndex, setPreviewRowIndex] = useState(0);
  const [showBatchModal, setShowBatchModal] = useState(false);

  // 加载模板列表
  useEffect(() => {
    const savedTemplates = loadTemplates();
    setTemplates(savedTemplates);
  }, []);

  // 加载飞书表格数据
  const handleLoadTableData = async () => {
    // 如果使用模拟数据
    if (USE_MOCK_DATA) {
      setLoadingData(true);
      setTimeout(() => {
        setTableFields(mockFields);
        setTableRows(mockRows);
        setLoadingData(false);
        alert(`成功加载 ${mockRows.length} 条模拟数据`);
      }, 500);
      return;
    }

    if (!appToken || !tableId) {
      alert('请输入 App Token 和 Table ID');
      return;
    }

    setLoadingData(true);
    try {
      // 获取字段定义
      const fields = await feishuApi.getTableMeta(appToken, tableId);
      setTableFields(fields);

      // 获取所有记录
      const rows = await feishuApi.getAllTableRecords(appToken, tableId);
      setTableRows(rows);

      alert(`成功加载 ${rows.length} 条记录`);
    } catch (error) {
      console.error('加载表格数据失败:', error);
      alert('加载表格数据失败，请检查 Token 和 ID 是否正确');
    } finally {
      setLoadingData(false);
    }
  };

  // 创建新模板
  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setCurrentStep('template-design');
  };

  // 编辑模板
  const handleEditTemplate = (template: PosterTemplate) => {
    setEditingTemplate(template);
    setCurrentStep('template-design');
  };

  // 保存模板
  const handleSaveTemplate = (template: PosterTemplate) => {
    saveTemplate(template);
    const updatedTemplates = loadTemplates();
    setTemplates(updatedTemplates);
    setCurrentStep('template-list');
    alert('模板保存成功');
  };

  // 删除模板
  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('确定要删除这个模板吗？')) {
      deleteTemplate(templateId);
      const updatedTemplates = loadTemplates();
      setTemplates(updatedTemplates);
    }
  };

  // 选择模板进行使用
  const handleSelectTemplate = (template: PosterTemplate) => {
    setSelectedTemplate(template);
    setFieldMappings([]);
    setCurrentStep('field-mapping');
  };

  // 进入预览
  const handleGoToPreview = () => {
    if (tableRows.length === 0) {
      alert('请先加载表格数据');
      return;
    }
    setPreviewRowIndex(0);
    setCurrentStep('preview');
  };

  // 进入批量生成
  const handleGoToBatchGenerate = () => {
    if (tableRows.length === 0) {
      alert('请先加载表格数据');
      return;
    }
    setShowBatchModal(true);
  };

  // 渲染不同步骤的内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 'template-list':
        return (
          <div className="template-list-view">
            <div className="view-header">
              <h2>海报模板管理</h2>
              <button onClick={handleCreateTemplate} className="btn-primary">
                + 创建新模板
              </button>
            </div>

            <div className="templates-grid">
              {templates.length === 0 ? (
                <div className="empty-state">
                  <p>还没有模板，创建一个开始吧！</p>
                </div>
              ) : (
                templates.map((template) => (
                  <div key={template.id} className="template-card">
                    {template.thumbnail && (
                      <img src={template.thumbnail} alt={template.name} className="template-thumbnail" />
                    )}
                    <div className="template-info">
                      <h3>{template.name}</h3>
                      <p>{template.description}</p>
                      <p className="template-meta">
                        {template.width} × {template.height} | {template.elements.length} 个元素
                      </p>
                    </div>
                    <div className="template-actions">
                      <button onClick={() => handleSelectTemplate(template)} className="btn-primary">
                        使用
                      </button>
                      <button onClick={() => handleEditTemplate(template)} className="btn-secondary">
                        编辑
                      </button>
                      <button onClick={() => handleDeleteTemplate(template.id)} className="btn-danger">
                        删除
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'template-design':
        return (
          <PosterTemplateDesigner
            template={editingTemplate || undefined}
            onSave={handleSaveTemplate}
            onCancel={() => setCurrentStep('template-list')}
          />
        );

      case 'field-mapping':
        return (
          <div className="field-mapping-view">
            <div className="view-header">
              <h2>字段映射配置</h2>
              <div className="header-actions">
                <button onClick={() => setCurrentStep('template-list')} className="btn-secondary">
                  返回模板列表
                </button>
                <button onClick={handleGoToPreview} className="btn-primary" disabled={tableRows.length === 0}>
                  预览效果
                </button>
              </div>
            </div>

            {selectedTemplate && (
              <FieldMapper
                template={selectedTemplate}
                availableFields={tableFields}
                initialMappings={fieldMappings}
                onMappingsChange={setFieldMappings}
              />
            )}
          </div>
        );

      case 'preview':
        return (
          <div className="preview-view">
            <div className="view-header">
              <h2>海报预览</h2>
              <div className="header-actions">
                <button onClick={() => setCurrentStep('field-mapping')} className="btn-secondary">
                  返回映射配置
                </button>
                <button onClick={handleGoToBatchGenerate} className="btn-primary">
                  批量生成
                </button>
              </div>
            </div>

            {selectedTemplate && (
              <PosterPreview
                template={selectedTemplate}
                rows={tableRows}
                fieldMappings={fieldMappings}
                currentRowIndex={previewRowIndex}
                onRowChange={setPreviewRowIndex}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      {/* 顶部导航栏 */}
      <header className="app-header">
        <h1>🎨 飞书多维表海报生成器</h1>
        <div className="header-info">
          {tableRows.length > 0 && (
            <span className="data-badge">已加载 {tableRows.length} 条数据</span>
          )}
        </div>
      </header>

      {/* 飞书数据配置面板 */}
      <div className="data-config-panel">
        <div className="config-inputs">
          {USE_MOCK_DATA ? (
            <>
              <div style={{ flex: 1, color: '#667eea', fontWeight: 500 }}>
                🎭 演示模式：使用模拟数据
              </div>
              <button
                onClick={handleLoadTableData}
                disabled={loadingData}
                className="btn-primary"
              >
                {loadingData ? '加载中...' : '加载模拟数据'}
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                value={appToken}
                onChange={(e) => setAppToken(e.target.value)}
                placeholder="输入 App Token"
                className="config-input"
              />
              <input
                type="text"
                value={tableId}
                onChange={(e) => setTableId(e.target.value)}
                placeholder="输入 Table ID"
                className="config-input"
              />
              <button
                onClick={handleLoadTableData}
                disabled={loadingData}
                className="btn-primary"
              >
                {loadingData ? '加载中...' : '加载表格数据'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* 主内容区域 */}
      <main className="app-main">
        {renderStepContent()}
      </main>

      {/* 批量生成弹窗 */}
      {showBatchModal && selectedTemplate && (
        <BatchApplyModal
          visible={showBatchModal}
          onClose={() => setShowBatchModal(false)}
          template={selectedTemplate}
          rows={tableRows}
          fieldMappings={fieldMappings}
        />
      )}
    </div>
  );
};

export default App;