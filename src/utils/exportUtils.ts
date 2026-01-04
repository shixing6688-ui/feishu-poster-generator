import { PosterGenerationResult } from '../types';

/**
 * 下载单个海报
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
 * 批量下载海报（逐个下载）
 */
export const downloadPostersSequentially = (
  results: PosterGenerationResult[],
  filenamePrefix: string = 'poster'
): void => {
  const successResults = results.filter((r) => r.success && r.blob);

  successResults.forEach((result, index) => {
    setTimeout(() => {
      if (result.blob) {
        downloadPoster(result.blob, `${filenamePrefix}_${index + 1}.png`);
      }
    }, index * 200); // 延迟下载避免浏览器阻止
  });
};

/**
 * 将 DataURL 转换为 Blob
 */
export const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
  const response = await fetch(dataUrl);
  return response.blob();
};

/**
 * 批量下载海报为 ZIP（需要 JSZip 库）
 * 注意：使用此功能需要先安装 jszip: npm install jszip
 */
export const downloadPostersAsZip = async (
  results: PosterGenerationResult[],
  zipFilename: string = 'posters.zip'
): Promise<void> => {
  try {
    // 动态导入 JSZip
    let JSZip: any;
    try {
      JSZip = (await import('jszip' as any)).default;
    } catch (e) {
      console.warn('jszip 未安装，使用顺序下载代替');
      alert('批量下载功能需要安装 jszip 库。\n将使用顺序下载代替。');
      // 使用顺序下载代替
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.success && result.blob) {
          downloadPoster(result.blob, `poster_${i + 1}.png`);
          // 添加延迟避免浏览器阻止多个下载
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      return;
    }

    const zip = new JSZip();

    const successResults = results.filter((r) => r.success && r.blob);

    // 添加文件到 ZIP
    successResults.forEach((result, index) => {
      if (result.blob) {
        zip.file(`poster_${index + 1}.png`, result.blob);
      }
    });

    // 生成 ZIP 文件
    const content = await zip.generateAsync({ type: 'blob' });

    // 下载 ZIP
    downloadPoster(content, zipFilename);
  } catch (error) {
    console.error('生成 ZIP 失败:', error);
    alert('生成 ZIP 文件失败，请重试');
  }
};

/**
 * 将 Blob 转换为 Base64
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * 预览海报（在新窗口中打开）
 */
export const previewPoster = (dataUrl: string): void => {
  const win = window.open();
  if (win) {
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>海报预览</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              background: #f0f0f0;
            }
            img {
              max-width: 100%;
              max-height: 100vh;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" alt="海报预览" />
        </body>
      </html>
    `);
  }
};

/**
 * 复制图片到剪贴板
 */
export const copyPosterToClipboard = async (blob: Blob): Promise<void> => {
  try {
    if (navigator.clipboard && window.ClipboardItem) {
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      alert('海报已复制到剪贴板');
    } else {
      throw new Error('浏览器不支持剪贴板 API');
    }
  } catch (error) {
    console.error('复制到剪贴板失败:', error);
    alert('复制失败，请使用下载功能');
  }
};

