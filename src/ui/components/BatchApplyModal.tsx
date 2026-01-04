import React, { useState } from 'react';
import {
  PosterTemplate,
  FeishuTableRow,
  FieldMapping,
  PosterGenerationResult,
  BatchGenerationProgress,
} from '../../types';
import { posterService, downloadPoster } from '../../services/posterService';

interface BatchApplyModalProps {
  visible: boolean;
  onClose: () => void;
  template: PosterTemplate;
  rows: FeishuTableRow[];
  fieldMappings: FieldMapping[];
}

type GenerationStatus = 'idle' | 'generating' | 'completed' | 'error';

const BatchApplyModal: React.FC<BatchApplyModalProps> = ({
  visible,
  onClose,
  template,
  rows,
  fieldMappings,
}) => {
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [progress, setProgress] = useState<BatchGenerationProgress>({
    total: 0,
    completed: 0,
    failed: 0,
    results: [],
  });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rows.map((row) => row.recordId));
    }
    setSelectAll(!selectAll);
  };

  // 切换单个行的选择
  const toggleRowSelection = (recordId: string) => {
    if (selectedRows.includes(recordId)) {
      setSelectedRows(selectedRows.filter((id) => id !== recordId));
    } else {
      setSelectedRows([...selectedRows, recordId]);
    }
  };

  // 开始批量生成
  const handleGenerate = async () => {
    if (selectedRows.length === 0) {
      alert('请至少选择一行数据');
      return;
    }

    setStatus('generating');
    const selectedRowsData = rows.filter((row) => selectedRows.includes(row.recordId));

    setProgress({
      total: selectedRowsData.length,
      completed: 0,
      failed: 0,
      results: [],
    });

    try {
      const results = await posterService.generateBatch(
        template,
        selectedRowsData,
        fieldMappings,
        (completed, total) => {
          setProgress((prev) => ({
            ...prev,
            completed,
            total,
          }));
        }
      );

      const failed = results.filter((r) => !r.success).length;

      setProgress({
        total: selectedRowsData.length,
        completed: results.length,
        failed,
        results,
      });

      setStatus('completed');
    } catch (error) {
      console.error('批量生成失败:', error);
      setStatus('error');
    }
  };

  // 下载单个海报
  const handleDownloadSingle = (result: PosterGenerationResult, index: number) => {
    if (result.blob) {
      downloadPoster(result.blob, `poster_${index + 1}.png`);
    }
  };

  // 下载所有成功的海报
  const handleDownloadAll = () => {
    const successResults = progress.results.filter((r) => r.success);
    successResults.forEach((result, index) => {
      if (result.blob) {
        setTimeout(() => {
          downloadPoster(result.blob!, `poster_${index + 1}.png`);
        }, index * 100); // 延迟下载避免浏览器阻止
      }
    });
  };

  // 重置状态
  const handleReset = () => {
    setStatus('idle');
    setProgress({
      total: 0,
      completed: 0,
      failed: 0,
      results: [],
    });
  };

  // 关闭并重置
  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="batch-apply-modal-overlay">
      <div className="batch-apply-modal">
        <div className="modal-header">
          <h2>批量生成海报</h2>
          <button onClick={handleClose} className="close-btn">
            ×
          </button>
        </div>

        <div className="modal-body">
          {status === 'idle' && (
            <div className="selection-stage">
              <div className="stage-header">
                <h3>选择要生成海报的数据行</h3>
                <label className="select-all-checkbox">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                  全选 ({selectedRows.length}/{rows.length})
                </label>
              </div>

              <div className="rows-list">
                {rows.map((row, index) => (
                  <div key={row.recordId} className="row-item">
                    <label className="row-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.recordId)}
                        onChange={() => toggleRowSelection(row.recordId)}
                      />
                      <span className="row-index">#{index + 1}</span>
                      <span className="row-preview">
                        {Object.entries(row.fields)
                          .slice(0, 3)
                          .map(([key, value]) => `${key}: ${String(value).substring(0, 20)}`)
                          .join(', ')}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {status === 'generating' && (
            <div className="generation-stage">
              <h3>正在生成海报...</h3>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${(progress.completed / progress.total) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="progress-text">
                {progress.completed} / {progress.total}
              </p>
            </div>
          )}

          {status === 'completed' && (
            <div className="completion-stage">
              <h3>✅ 生成完成</h3>
              <div className="completion-summary">
                <p>总计: {progress.total}</p>
                <p>成功: {progress.completed - progress.failed}</p>
                <p>失败: {progress.failed}</p>
              </div>

              <div className="results-list">
                {progress.results.map((result, index) => (
                  <div
                    key={result.recordId}
                    className={`result-item ${result.success ? 'success' : 'error'}`}
                  >
                    <span className="result-index">#{index + 1}</span>
                    <span className="result-status">
                      {result.success ? '✓ 成功' : `✗ 失败: ${result.error}`}
                    </span>
                    {result.success && (
                      <button
                        onClick={() => handleDownloadSingle(result, index)}
                        className="btn-small"
                      >
                        下载
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="error-stage">
              <h3>❌ 生成失败</h3>
              <p>批量生成过程中发生错误，请重试</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {status === 'idle' && (
            <>
              <button onClick={handleClose} className="btn-secondary">
                取消
              </button>
              <button
                onClick={handleGenerate}
                className="btn-primary"
                disabled={selectedRows.length === 0}
              >
                开始生成 ({selectedRows.length})
              </button>
            </>
          )}

          {status === 'generating' && (
            <button className="btn-secondary" disabled>
              生成中...
            </button>
          )}

          {status === 'completed' && (
            <>
              <button onClick={handleReset} className="btn-secondary">
                重新生成
              </button>
              <button
                onClick={handleDownloadAll}
                className="btn-primary"
                disabled={progress.completed - progress.failed === 0}
              >
                下载全部 ({progress.completed - progress.failed})
              </button>
              <button onClick={handleClose} className="btn-secondary">
                关闭
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <button onClick={handleReset} className="btn-secondary">
                重试
              </button>
              <button onClick={handleClose} className="btn-secondary">
                关闭
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchApplyModal;