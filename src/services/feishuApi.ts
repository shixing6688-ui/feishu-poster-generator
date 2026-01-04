import axios, { AxiosInstance } from 'axios';
import {
  FeishuFieldMeta,
  FeishuTableRow,
  FeishuAttachment,
  TableData,
} from '../types';

const BASE_URL = 'https://open.feishu.cn/open-apis';

/**
 * 飞书 API 客户端类
 */
class FeishuApiClient {
  private axiosInstance: AxiosInstance;
  private accessToken: string = '';

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
    });

    // 请求拦截器：添加 token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 响应拦截器：统一错误处理
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('飞书 API 请求失败:', error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * 设置访问令牌
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  /**
   * 获取表格元数据（字段定义）
   */
  async getTableMeta(appToken: string, tableId: string): Promise<FeishuFieldMeta[]> {
    try {
      const response = await this.axiosInstance.get(
        `/bitable/v1/apps/${appToken}/tables/${tableId}/fields`
      );

      const fields = response.data.data.items || [];
      return fields.map((field: any) => ({
        fieldKey: field.field_name,
        fieldName: field.ui_name || field.field_name,
        fieldType: this.mapFieldType(field.type),
      }));
    } catch (error) {
      console.error('获取表格元数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取表格记录列表
   */
  async getTableRecords(
    appToken: string,
    tableId: string,
    pageSize: number = 100,
    pageToken?: string
  ): Promise<{ rows: FeishuTableRow[]; hasMore: boolean; pageToken?: string }> {
    try {
      const params: any = {
        page_size: pageSize,
      };

      if (pageToken) {
        params.page_token = pageToken;
      }

      const response = await this.axiosInstance.get(
        `/bitable/v1/apps/${appToken}/tables/${tableId}/records`,
        { params }
      );

      const data = response.data.data;
      const rows: FeishuTableRow[] = (data.items || []).map((item: any) => ({
        recordId: item.record_id,
        fields: item.fields,
      }));

      return {
        rows,
        hasMore: data.has_more || false,
        pageToken: data.page_token,
      };
    } catch (error) {
      console.error('获取表格记录失败:', error);
      throw error;
    }
  }

  /**
   * 获取所有表格记录（自动分页）
   */
  async getAllTableRecords(
    appToken: string,
    tableId: string
  ): Promise<FeishuTableRow[]> {
    const allRows: FeishuTableRow[] = [];
    let hasMore = true;
    let pageToken: string | undefined;

    while (hasMore) {
      const result = await this.getTableRecords(appToken, tableId, 100, pageToken);
      allRows.push(...result.rows);
      hasMore = result.hasMore;
      pageToken = result.pageToken;
    }

    return allRows;
  }

  /**
   * 获取单条记录
   */
  async getRecord(
    appToken: string,
    tableId: string,
    recordId: string
  ): Promise<FeishuTableRow> {
    try {
      const response = await this.axiosInstance.get(
        `/bitable/v1/apps/${appToken}/tables/${tableId}/records/${recordId}`
      );

      const record = response.data.data.record;
      return {
        recordId: record.record_id,
        fields: record.fields,
      };
    } catch (error) {
      console.error('获取记录失败:', error);
      throw error;
    }
  }

  /**
   * 获取附件临时下载链接
   */
  async getAttachmentUrl(
    appToken: string,
    tableId: string,
    fieldKey: string,
    fileToken: string
  ): Promise<string> {
    try {
      const response = await this.axiosInstance.get(
        `/bitable/v1/apps/${appToken}/tables/${tableId}/records/attachments/${fileToken}/url`
      );

      return response.data.data.url;
    } catch (error) {
      console.error('获取附件链接失败:', error);
      throw error;
    }
  }

  /**
   * 批量获取附件信息
   */
  async getAttachments(
    appToken: string,
    tableId: string,
    attachmentTokens: string[]
  ): Promise<FeishuAttachment[]> {
    try {
      const attachments: FeishuAttachment[] = [];

      for (const token of attachmentTokens) {
        const url = await this.getAttachmentUrl(appToken, tableId, '', token);
        attachments.push({
          fileToken: token,
          name: '',
          size: 0,
          type: '',
          url,
          tmpUrl: url,
        });
      }

      return attachments;
    } catch (error) {
      console.error('批量获取附件失败:', error);
      throw error;
    }
  }

  /**
   * 映射飞书字段类型到内部类型
   */
  private mapFieldType(feishuType: number): FeishuFieldMeta['fieldType'] {
    // 飞书字段类型映射
    // 参考: https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-field/guide
    const typeMap: Record<number, FeishuFieldMeta['fieldType']> = {
      1: 'text', // 多行文本
      2: 'number', // 数字
      3: 'singleSelect', // 单选
      4: 'multiSelect', // 多选
      5: 'date', // 日期
      7: 'text', // 复选框
      11: 'text', // 人员
      13: 'text', // 电话号码
      15: 'url', // 超链接
      17: 'attachment', // 附件
      18: 'text', // 关联
      19: 'text', // 公式
      20: 'text', // 双向关联
      21: 'text', // 创建时间
      22: 'text', // 最后更新时间
      23: 'text', // 创建人
      24: 'text', // 修改人
    };

    return typeMap[feishuType] || 'text';
  }
}

// 创建单例实例
export const feishuApi = new FeishuApiClient();

// 兼容旧的导出
export const fetchTableData = async (tableId: string): Promise<TableData> => {
  try {
    // 这里需要根据实际情况解析 tableId
    // 假设格式为 appToken:tableId
    const [appToken, actualTableId] = tableId.split(':');
    const rows = await feishuApi.getAllTableRecords(appToken, actualTableId);

    return {
      id: tableId,
      title: '',
      fields: rows.length > 0 ? rows[0].fields : {},
    };
  } catch (error) {
    console.error('Error fetching table data:', error);
    throw error;
  }
};

export const submitBatchApplication = async (
  tableId: string,
  templateId: string,
  data: any
): Promise<BatchApplyResponse> => {
  try {
    // 这是一个占位实现，实际可能不需要这个 API
    console.warn('submitBatchApplication 未实现');
    return {
      success: true,
      message: '批量应用成功',
    } as BatchApplyResponse;
  } catch (error) {
    console.error('Error submitting batch application:', error);
    throw error;
  }
};