/**
 * 预设背景配置
 */

export interface BackgroundPreset {
  id: string;
  name: string;
  type: 'solid' | 'gradient' | 'image';
  value: string;
  preview: string;
  description?: string;
}

export const backgroundPresets: BackgroundPreset[] = [
  // 纯色背景
  {
    id: 'solid-white',
    name: '纯白',
    type: 'solid',
    value: '#FFFFFF',
    preview: '#FFFFFF',
    description: '简洁纯白背景',
  },
  {
    id: 'solid-black',
    name: '纯黑',
    type: 'solid',
    value: '#000000',
    preview: '#000000',
    description: '经典黑色背景',
  },
  {
    id: 'solid-gray',
    name: '浅灰',
    type: 'solid',
    value: '#F5F5F5',
    preview: '#F5F5F5',
    description: '柔和灰色背景',
  },
  {
    id: 'solid-blue',
    name: '天蓝',
    type: 'solid',
    value: '#E3F2FD',
    preview: '#E3F2FD',
    description: '清新天蓝色',
  },
  {
    id: 'solid-pink',
    name: '粉红',
    type: 'solid',
    value: '#FCE4EC',
    preview: '#FCE4EC',
    description: '温柔粉红色',
  },
  {
    id: 'solid-green',
    name: '薄荷绿',
    type: 'solid',
    value: '#E8F5E9',
    preview: '#E8F5E9',
    description: '清新薄荷绿',
  },
  
  // 渐变背景
  {
    id: 'gradient-sunset',
    name: '日落',
    type: 'gradient',
    value: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
    preview: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
    description: '温暖日落渐变',
  },
  {
    id: 'gradient-ocean',
    name: '海洋',
    type: 'gradient',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    description: '深邃海洋渐变',
  },
  {
    id: 'gradient-forest',
    name: '森林',
    type: 'gradient',
    value: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
    preview: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
    description: '清新森林渐变',
  },
  {
    id: 'gradient-sky',
    name: '天空',
    type: 'gradient',
    value: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    preview: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    description: '晴朗天空渐变',
  },
  {
    id: 'gradient-fire',
    name: '火焰',
    type: 'gradient',
    value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    description: '热情火焰渐变',
  },
  {
    id: 'gradient-purple',
    name: '紫梦',
    type: 'gradient',
    value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    preview: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    description: '梦幻紫色渐变',
  },
  {
    id: 'gradient-gold',
    name: '金色',
    type: 'gradient',
    value: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    preview: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    description: '奢华金色渐变',
  },
  {
    id: 'gradient-rose',
    name: '玫瑰',
    type: 'gradient',
    value: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    preview: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    description: '浪漫玫瑰渐变',
  },
  {
    id: 'gradient-mint',
    name: '薄荷',
    type: 'gradient',
    value: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    preview: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    description: '清凉薄荷渐变',
  },
  {
    id: 'gradient-peach',
    name: '蜜桃',
    type: 'gradient',
    value: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    preview: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    description: '甜美蜜桃渐变',
  },
  {
    id: 'gradient-night',
    name: '夜空',
    type: 'gradient',
    value: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    preview: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    description: '神秘夜空渐变',
  },
  {
    id: 'gradient-aurora',
    name: '极光',
    type: 'gradient',
    value: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
    preview: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
    description: '绚丽极光渐变',
  },
];

/**
 * 根据 ID 获取背景预设
 */
export const getBackgroundPreset = (id: string): BackgroundPreset | undefined => {
  return backgroundPresets.find((preset) => preset.id === id);
};

/**
 * 根据类型获取背景预设列表
 */
export const getBackgroundPresetsByType = (type: 'solid' | 'gradient' | 'image'): BackgroundPreset[] => {
  return backgroundPresets.filter((preset) => preset.type === type);
};

