import { useAntdTable } from "ahooks";
import { Form } from "antd";
import { ColumnsType } from "antd/es/table";
import AdvancedSearchForm from "../../../components/AdvanceSearchForm";
import Input from "../../../components/Form/Input";
import Table from "../../../components/Table/Table";
import { AuditLogDto } from "../../../data/models/AuditLog";
import { useStores } from "../../../hooks/useStore";
import styles from "./index.module.less";
function AuditLog() {
  const { useAuditLogStore } = useStores();
  const [getAuditLogs] = useAuditLogStore(state => [state.getAuditLogs])
  const [form] = Form.useForm();
  const { tableProps, search } = useAntdTable(getAuditLogs, { defaultPageSize: 10, form, debounceWait: 500, });
  const tableColumns: ColumnsType<AuditLogDto> = [
    { title: '用户', dataIndex: 'userName', },
    { title: '执行时间', dataIndex: 'executionTime', },
    { title: '持续时间(毫秒)', dataIndex: 'executionDuration' },
    { title: '浏览器信息', dataIndex: 'browserInfo', },
    { title: '请求地址', dataIndex: 'url', },
  ]
  return (
    <div>
      <AdvancedSearchForm form={form} {...search}>
        <Input name="title" label="标题" placeholder={true} />
        <Input name="linkUrl" label="链接地址" placeholder={true} />
      </AdvancedSearchForm>
      <div className={styles.table}>
        <Table<AuditLogDto> columns={tableColumns}  {...tableProps} />
      </div>
    </div >
  );
}

export default AuditLog;
