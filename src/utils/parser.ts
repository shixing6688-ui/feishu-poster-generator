import { Template } from '../types';

export const parseTemplate = (template: Template, data: Record<string, any>): Record<string, any> => {
    const parsedData: Record<string, any> = {};

    for (const key in template) {
        if (template.hasOwnProperty(key)) {
            const value = template[key];
            parsedData[key] = typeof value === 'function' ? value(data) : value;
        }
    }

    return parsedData;
};

export const formatDataForDisplay = (data: Record<string, any>): string => {
    return Object.entries(data)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
};