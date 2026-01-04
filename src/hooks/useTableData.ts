import { useEffect, useState } from 'react';
import { fetchTableData } from '../services/feishuApi';
import { TableData } from '../types';

const useTableData = (tableId: string) => {
    const [data, setData] = useState<TableData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await fetchTableData(tableId);
                setData(result);
            } catch (err) {
                setError('Failed to fetch table data');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [tableId]);

    return { data, loading, error };
};

export default useTableData;