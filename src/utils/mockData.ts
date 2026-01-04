import { FeishuFieldMeta, FeishuTableRow } from '../types';

/**
 * 模拟飞书表格字段定义
 */
export const mockFields: FeishuFieldMeta[] = [
  {
    fieldKey: 'title',
    fieldName: '标题',
    fieldType: 'text',
  },
  {
    fieldKey: 'content',
    fieldName: '内容',
    fieldType: 'text',
  },
  {
    fieldKey: 'image',
    fieldName: '封面图片',
    fieldType: 'attachment',
  },
  {
    fieldKey: 'tags',
    fieldName: '标签',
    fieldType: 'multiSelect',
  },
  {
    fieldKey: 'author',
    fieldName: '作者',
    fieldType: 'text',
  },
  {
    fieldKey: 'date',
    fieldName: '日期',
    fieldType: 'date',
  },
];

/**
 * 模拟飞书表格数据
 */
export const mockRows: FeishuTableRow[] = [
  {
    recordId: 'rec001',
    fields: {
      title: '春季新品发布会',
      content: '我们很高兴地宣布，春季新品系列即将发布，敬请期待！',
      image: [
        {
          fileToken: 'img001',
          name: 'spring.jpg',
          size: 102400,
          type: 'image/jpeg',
          url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
          tmpUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
        },
      ],
      tags: ['新品', '促销', '限时'],
      author: '张三',
      date: '2024-03-15',
    },
  },
  {
    recordId: 'rec002',
    fields: {
      title: '夏日清凉特惠',
      content: '炎炎夏日，为您带来清凉优惠，全场5折起！',
      image: [
        {
          fileToken: 'img002',
          name: 'summer.jpg',
          size: 98304,
          type: 'image/jpeg',
          url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800',
          tmpUrl: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800',
        },
      ],
      tags: ['夏季', '折扣', '热卖'],
      author: '李四',
      date: '2024-06-20',
    },
  },
  {
    recordId: 'rec003',
    fields: {
      title: '秋季时尚周',
      content: '探索秋季最新时尚趋势，打造专属你的秋日风格。',
      image: [
        {
          fileToken: 'img003',
          name: 'autumn.jpg',
          size: 112640,
          type: 'image/jpeg',
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
          tmpUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        },
      ],
      tags: ['时尚', '秋季', '新款'],
      author: '王五',
      date: '2024-09-10',
    },
  },
  {
    recordId: 'rec004',
    fields: {
      title: '冬季温暖计划',
      content: '寒冬来临，我们为您准备了温暖的冬季系列产品。',
      image: [
        {
          fileToken: 'img004',
          name: 'winter.jpg',
          size: 125952,
          type: 'image/jpeg',
          url: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800',
          tmpUrl: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800',
        },
      ],
      tags: ['冬季', '保暖', '舒适'],
      author: '赵六',
      date: '2024-12-01',
    },
  },
  {
    recordId: 'rec005',
    fields: {
      title: '年终大促销',
      content: '年终回馈，全场商品低至3折，数量有限，先到先得！',
      image: [
        {
          fileToken: 'img005',
          name: 'sale.jpg',
          size: 95232,
          type: 'image/jpeg',
          url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
          tmpUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
        },
      ],
      tags: ['促销', '年终', '特惠', '限量'],
      author: '孙七',
      date: '2024-12-25',
    },
  },
];

/**
 * 使用模拟数据的标志
 */
export const USE_MOCK_DATA = true;

