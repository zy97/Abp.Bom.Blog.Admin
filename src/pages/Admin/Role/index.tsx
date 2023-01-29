import { IdentityRoleDto } from "@abp/ng.identity/proxy";
import { GetPermissionListResultDto, UpdatePermissionDto } from "@abp/ng.permission-management/proxy";
import { useAntdTable } from "ahooks";
import { Form, message, Modal, Space } from "antd";
import { useState } from "react";
import { produce } from 'immer';
import AdvancedSearchForm from "../../../components/AdvanceSearchForm";
import { useStores } from "../../../hooks/useStore";
import Permission from "../../../components/Permission";
import styles from "./index.module.less";
import Input from "../../../components/Form/Input";
import { booleanRenderToString } from "../../../util/utilities";
import { getRequiredRule } from "../../../util/formValid";
import ConcurrencyStamp from "../../../components/Form/ConcurrencyStamp";
import Checkbox from "../../../components/Form/Checkbox";
import { ColumnsType } from "antd/es/table";
import Table from "../../../components/Table/Table";
import Button from "../../../components/Button";
type RoleState = {
  roleModalVisible: boolean
  roleModalTitle: string,
  permissionModalVisible: boolean
  roleName: string
  grantedPermissions: GetPermissionListResultDto
}
function Role() {
  const [state, setState] = useState<RoleState>({
    roleModalVisible: false,
    roleModalTitle: "",
    permissionModalVisible: false,
    roleName: "",
    grantedPermissions: {} as GetPermissionListResultDto,
  })
  const tableColumns: ColumnsType<IdentityRoleDto> = [
    { title: '角色字', dataIndex: 'name', },
    { title: '默认', dataIndex: 'isDefault', render: booleanRenderToString },
    { title: '公开', dataIndex: 'isPublic', render: booleanRenderToString },
    {
      title: '操作', render: (record) => (
        <Space>
          <Button permission="AbpIdentity.Roles.Update" type="primary" onClick={() => editRole(record)}>编辑</Button>
          <Button permission="AbpIdentity.Roles.ManagePermissions" type="primary" onClick={() => showPermissionModal(record.name)}>权限</Button>
          <Button permission="AbpIdentity.Roles.Delete" type="primary" danger onClick={() => deleteRole(record)}>删除</Button>
        </Space>
      )
    },
  ]
  const { useRoleStore, usePermissionStore } = useStores();
  const [getRoles, getRoleById, deleteRoleService, updateRole, addRoleSvc] = useRoleStore(state => [state.getRoles, state.getRoleById, state.deleteRole, state.updateRole, state.addRole]);
  const [getPermissionByRole, updatePermissionsByRole] = usePermissionStore(state => [state.getPermissionByRole, state.updatePermissionsByRole]);
  const [searchForm] = Form.useForm();
  const [roleModalForm] = Form.useForm();
  const { tableProps, search } = useAntdTable(getRoles, { defaultPageSize: 10, form: searchForm, debounceWait: 500, });
  let changedPermession: UpdatePermissionDto[];
  const deleteRole = (record: IdentityRoleDto) => {
    Modal.confirm({
      title: "删除", content: "确定删除吗？",
      onOk: async () => {
        if (await deleteRoleService(record.id)) {
          message.success("删除成功");
          search.submit();
        }
      },
      okText: "确定", cancelText: "取消",
    });
  };
  const showRoleModal = (roleModelTitle: string) => {
    setState(produce(draft => {
      draft.roleModalVisible = true
      draft.roleModalTitle = roleModelTitle
    }))
  };
  const closeRoleModal = () => {
    setState(produce(draft => { draft.roleModalVisible = false }))
    roleModalForm.resetFields()
  }
  const submitRoleModal = async () => {
    const values = await roleModalForm.validateFields()
    addOrUpdateRole(values);
  }
  const addRole = () => {
    showRoleModal("添加")
  }
  const editRole = async (record: IdentityRoleDto) => {
    const role = await getRoleById(record.id);
    if (role) {
      roleModalForm.setFieldsValue(role);
      showRoleModal("编辑")
    }
  };
  const addOrUpdateRole = async (data: any) => {
    if (data.id) {
      const role = await updateRole(data.id, data);
      if (role)
        message.success("更新成功");
    } else {
      const role = await addRoleSvc(data);
      if (role)
        message.success("添加成功");
    }
    roleModalForm.resetFields();
    setState(produce(draft => { draft.roleModalVisible = false }))
    search.submit();
  };

  const showPermissionModal = async (name: string) => {
    const permission = await getPermissionByRole(name)
    setState(produce(draft => {
      draft.roleName = name
      draft.permissionModalVisible = true
      draft.grantedPermissions = permission
    }))
  }
  const onPermissionChange = (checkedValues: UpdatePermissionDto[]) => {
    changedPermession = checkedValues;
  }
  const closePermissionModal = () => {
    setState(produce(draft => { draft.permissionModalVisible = false }))
  }
  const subitPermissionModal = async () => {
    await updatePermissionsByRole(state.roleName, { permissions: changedPermession })
    setState(produce(draft => { draft.permissionModalVisible = false }))
    message.success("更新成功")
  }
  return (
    <div>
      <AdvancedSearchForm form={searchForm} {...search} extraActions={[{ content: "添加", action: addRole, permission: "AbpIdentity.Roles.Create" }]}>
        <Input placeholder="请输入查找值" name="Filter" label="查找值" />
      </AdvancedSearchForm>
      <div className={styles.table}>
        <Table<IdentityRoleDto> columns={tableColumns} {...tableProps} />
      </div>
      <Modal open={state.roleModalVisible} title={state.roleModalTitle} okText="确定" cancelText="取消" onCancel={closeRoleModal}
        onOk={submitRoleModal}>
        <Form form={roleModalForm} name="form_in_modal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} >
          <Input name="id" label="id" hidden />
          <Input name="name" label="角色名" rules={[getRequiredRule("角色名")]} placeholder={true} />
          <Checkbox name="isDefault" label="默认" />
          <Checkbox name="isPublic" label="公开" />
          <ConcurrencyStamp />
        </Form>
      </Modal>
      <Modal open={state.permissionModalVisible} title={`${state.grantedPermissions.entityDisplayName} - 权限`} okText="确定" cancelText="取消" onCancel={closePermissionModal}
        onOk={subitPermissionModal}>
        <Permission permissions={state.grantedPermissions} onPermissionChanged={onPermissionChange} />
      </Modal>
    </div>
  );
}
export default Role;
