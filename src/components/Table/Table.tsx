/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table as AntdTable } from "antd";
import { ColumnsType } from "antd/es/table";
type TableProps<RecordType> = {
    rowKey?: string,
    dataSource?: RecordType[],
    columns: ColumnsType<RecordType>,
    [key: string]: any;
    loading?: boolean;
    onChange?: (pagination: any, filters?: any, sorter?: any) => void;
    pagination?: any;
}

function Table<T extends object>(props: TableProps<T>) {
    const { columns, rowKey, ...tableProps } = props;
    return (
        <AntdTable<T>
            rowKey={rowKey ?? "id"} columns={columns}
            {...{
                ...tableProps,
                pagination: {
                    ...tableProps.pagination,
                    showTotal: (total) => {
                        return <div>总共：{total} 项</div>;
                    },
                    showSizeChanger: true,
                },
            }} />
    );
}

export default Table;