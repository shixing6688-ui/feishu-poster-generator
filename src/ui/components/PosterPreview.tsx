import React, { useEffect, useRef, useState } from 'react';
import {
  PosterTemplate,
  FeishuTableRow,
  FieldMapping,
} from '../../types';
import { posterService } from '../../services/posterService';

interface PosterPreviewProps {
  template: PosterTemplate;
  rows: FeishuTableRow[];
  fieldMappings: FieldMapping[];
  currentRowIndex?: number;
  onRowChange?: (index: number) => void;
}

const PosterPreview: React.FC<PosterPreviewProps> = ({
  template,
  rows,
  fieldMappings,
  currentRowIndex = 0,
  onRowChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 生成预览
  useEffect(() => {
    if (!template || !rows || rows.length === 0 || !canvasRef.current) {
      return;
    }

    const generatePreview = async () => {
      setLoading(true);
      setError(null);

      try {
        const currentRow = rows[currentRowIndex];
        if (!currentRow) {
          throw new Error('无效的行索引');
        }

        const result = await posterService.generatePoster(
          template,
          currentRow,
          fieldMappings
        );

        if (result.success && result.dataUrl) {
          setPreviewUrl(result.dataUrl);
        } else {
          setError(result.error || '生成预览失败');
        }
      } catch (err) {
        console.error('预览生成错误:', err);
        setError(err instanceof Error ? err.message : '未知错误');
      } finally {
        setLoading(false);
      }
    };

    generatePreview();
  }, [template, rows, fieldMappings, currentRowIndex]);

  // 切换到上一行
  const handlePrevious = () => {
    if (currentRowIndex > 0 && onRowChange) {
      onRowChange(currentRowIndex - 1);
    }
  };

  // 切换到下一行
  const handleNext = () => {
    if (currentRowIndex < rows.length - 1 && onRowChange) {
      onRowChange(currentRowIndex + 1);
    }
  };

  // 下载当前预览
  const handleDownload = () => {
    if (previewUrl) {
      const link = document.createElement('a');
      link.href = previewUrl;
      link.download = `poster_preview_${currentRowIndex + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (rows.length === 0) {
    return (
      <div className="poster-preview empty">
        <div className="empty-state">
          <p>没有可预览的数据</p>
          <p className="hint">请先从飞书表格加载数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className="poster-preview">
      <div className="preview-header">
        <h3>海报预览</h3>
        <div className="preview-controls">
          <button
            onClick={handlePrevious}
            disabled={currentRowIndex === 0 || loading}
            className="btn-icon"
          >
            ← 上一个
          </button>
          <span className="preview-counter">
            {currentRowIndex + 1} / {rows.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentRowIndex === rows.length - 1 || loading}
            className="btn-icon"
          >
            下一个 →
          </button>
        </div>
      </div>

      <div className="preview-body">
        {loading && (
          <div className="preview-loading">
            <div className="spinner"></div>
            <p>生成预览中...</p>
          </div>
        )}

        {error && (
          <div className="preview-error">
            <p>❌ {error}</p>
          </div>
        )}

        {!loading && !error && previewUrl && (
          <div className="preview-canvas-wrapper">
            <img
              src={previewUrl}
              alt="海报预览"
              className="preview-image"
              style={{
                maxWidth: '100%',
                maxHeight: '600px',
                objectFit: 'contain',
              }}
            />
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      <div className="preview-footer">
        <button
          onClick={handleDownload}
          disabled={!previewUrl || loading}
          className="btn-secondary"
        >
          下载预览图
        </button>
      </div>
    </div>
  );
};

export default PosterPreview;
