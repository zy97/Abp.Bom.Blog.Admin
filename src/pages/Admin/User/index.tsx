import { IdentityUserDto } from "@abp/ng.account.core/proxy";
import { IdentityRoleDto } from "@abp/ng.identity/proxy";
import { GetPermissionListResultDto, UpdatePermissionDto } from "@abp/ng.permission-management/proxy";
import { useAntdTable } from "ahooks";
import { Checkbox, Form, message, Modal, Row, Space, Tabs } from "antd";
import { useState } from "react";
import { produce } from 'immer';
import AdvancedSearchForm from "../../../components/AdvanceSearchForm";
import { useStores } from "../../../hooks/useStore";
import Permission from "../../../components/Permission";
import styles from "./index.module.less";
import Input from "../../../components/Form/Input";
import { booleanRenderToString } from "../../../util/utilities";
import ConcurrencyStamp from "../../../components/Form/ConcurrencyStamp";
import Switch from "../../../components/Form/Switch";
import { getEmailValidationRule, getPhoneValidationRule, getRequiredRule } from "../../../util/formValid";
import Table from "../../../components/Table/Table";
import { ColumnsType } from "antd/es/table";
import Button from "../../../components/Button";
import { L } from "../../../util/localization";
type UserState = {
  userModalVisible: boolean
  permissionModalVisible: boolean
  isAddUser: boolean
  assignableRoles: IdentityRoleDto[],
  userRoles: IdentityRoleDto[],
  userId: string
  grantedPermissions: GetPermissionListResultDto
}
function User() {
  const [state, setState] = useState<UserState>({
    userModalVisible: false,
    permissionModalVisible: false,
    isAddUser: false,
    assignableRoles: [],
    userRoles: [],
    userId: "",
    grantedPermissions: {} as GetPermissionListResultDto,
  })
  // const { L } = useAppConfig();
  const { useUserStore, usePermissionStore, } = useStores();
  const [getUsers, getUserById, deleteUserSvc, getAssignableRoles, updateUserSvc, addUserSvc, getUserRoleById] = useUserStore(state => [state.getUsers, state.getUserById, state.deleteUser, state.getAssignableRoles, state.updateUser, state.addUser, state.getUserRoleById])
  const [getPermissionByUser, updatePermissionsByUserSvc] = usePermissionStore(state => [state.getPermissionByUser, state.updatePermissionsByUser])
  const [form] = Form.useForm();
  const [userModalForm] = Form.useForm();
  let changedPermession: UpdatePermissionDto[];
  const { tableProps, search } = useAntdTable(getUsers, { defaultPageSize: 10, form, debounceWait: 500, });
  const deleteUser = (record: IdentityUserDto) => {
    Modal.confirm({
      title: "删除标签", content: "确定删除吗？",
      onOk: async () => {
        if (await deleteUserSvc(record.id)) {
          message.success("删除成功");
          search.submit();
        }
      },
      okText: "确定", cancelText: "取消",
    });
  };
  const showUserModal = async () => {
    const assignableRoles = await getAssignableRoles();
    setState(produce(draft => {
      draft.userModalVisible = true
      draft.assignableRoles = assignableRoles.items ?? []
    }))
  };
  const closeUserModal = () => {
    setState(produce(draft => { draft.userModalVisible = false }))
    userModalForm.resetFields();
  }
  const submitUserModal = async () => {
    const values = await userModalForm.validateFields()
    addOrUpdateUser(values.id, values);
  }
  const showPermissionModal = async (id: string) => {
    const permission = await getPermissionByUser(id)
    setState(produce(draft => {
      draft.permissionModalVisible = true
      draft.userId = id
      draft.grantedPermissions = permission
    }))
  };
  const addUser = () => {
    setState(produce(draft => { draft.isAddUser = true }))
    showUserModal();
  };
  const editUser = async (record: IdentityUserDto) => {
    const user = await getUserById(record.id);
    if (user) {
      const userRoles = await getUserRoleById(record.id)
      await showUserModal();
      setState(produce(draft => {
        draft.isAddUser = false
        draft.userRoles = userRoles.items ?? []
      }))
      userModalForm.setFieldsValue({ ...user, roleNames: userRoles.items?.map(x => x.name) });
    }
  };
  const addOrUpdateUser = async (id: string, data: any) => {
    if (id) {
      if (await updateUserSvc(id, data))
        message.success("更新成功");

    } else {
      if (await addUserSvc(data))
        message.success("添加成功");
    }
    await addUserSvc(data)
    setState(produce(draft => { draft.userModalVisible = false }))
    search.submit();
  };
  const onPermissionChange = (checkedValues: UpdatePermissionDto[]) => {
    changedPermession = checkedValues;
  }
  const updatePermissionsByUser = async () => {
    await updatePermissionsByUserSvc(state.userId, { permissions: changedPermession })
    setState(produce(draft => { draft.permissionModalVisible = false }));
  }
  const closePermissionModal = () => {
    setState(produce(draft => { draft.permissionModalVisible = false }))
  }
  const tableColumns: ColumnsType<IdentityUserDto> = [
    { title: '用户名', dataIndex: 'userName', },
    { title: '名', dataIndex: 'name', },
    { title: '姓', dataIndex: 'surname' },
    { title: '邮箱', dataIndex: 'email', },
    { title: '电话', dataIndex: 'phoneNumber', },
    { title: '启动锁定', dataIndex: 'lockoutEnabled', render: booleanRenderToString },
    { title: '已删除', dataIndex: 'isDeleted', render: booleanRenderToString },
    { title: '邮箱确认', dataIndex: 'emailConfirmed', render: booleanRenderToString },
    { title: '电话确认', dataIndex: 'phoneNumberConfirmed', render: booleanRenderToString },
    { title: '是否激活', dataIndex: 'isActive', render: booleanRenderToString },
    {
      title: '操作', render: (record) => (
        <Space>
          <Button permission="AbpIdentity.Users.Update" type="primary" onClick={() => editUser(record)}>{L("AbpIdentity::Edit")}</Button>
          <Button permission="AbpIdentity.Users.ManagePermissions" type="primary" onClick={() => showPermissionModal(record.id)}>{L("AbpPermissionManagement::Permissions")}</Button>
          <Button permission="AbpIdentity.Users.Delete" type="primary" danger onClick={() => deleteUser(record)} >{L("AbpIdentity::Delete")}</Button>
        </Space>
      )
    },
  ]
  return (
    <div>
      <AdvancedSearchForm form={form} {...search} extraActions={[{ content: "添加", action: addUser, permission: "AbpIdentity.Users.Create" }]}>
        <Input name="Filter" label="查找值" placeholder="请输入查找值" />
      </AdvancedSearchForm>
      <div className={styles.table}>
        <Table<IdentityUserDto> columns={tableColumns}  {...tableProps} />
      </div >
      <Modal open={state.userModalVisible} title="添加一个新标签" okText="确定" cancelText="取消" onCancel={closeUserModal} onOk={submitUserModal}>
        <Form form={userModalForm} name="form_in_modal" labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} >
          <Tabs defaultActiveKey="1" items={[{
            label: "用户信息", key: "1", children: (
              <>
                <Input name="id" label="id" hidden />
                <Input name="userName" label="用户名" rules={[getRequiredRule("用户名")]} placeholder={true} />
                <Input name="name" label="名" rules={[getRequiredRule("名")]} placeholder={true} />
                <Input name="surname" label="姓" rules={[getRequiredRule("姓")]} placeholder={true} />
                {state.isAddUser && <Input name="password" label="密码" rules={[getRequiredRule("密码")]} isPassword={true} placeholder={true} />}
                <Input name="email" label="邮箱" rules={[getRequiredRule("邮箱"), getEmailValidationRule()]} placeholder={true} />
                <Input name="phoneNumber" label="电话" rules={[getRequiredRule("电话"), getPhoneValidationRule()]} placeholder={true} />
                <Switch name="isActive" label="启用" valuePropName="checked" />
                <Switch name="lockoutEnabled" label="登陆失败，账号锁定" valuePropName="checked" />
                <ConcurrencyStamp />
              </>
            )
          }, {
            label: "角色", key: "2", children: (
              <Form.Item name="roleNames" label="">
                <Checkbox.Group style={{ width: '100%' }}>
                  {state.assignableRoles.map((item) => { return <Row key={item.name}><Checkbox value={item.name}>{item.name}</Checkbox></Row> })}
                </Checkbox.Group>
              </Form.Item>
            )
          }]}>
          </Tabs>
        </Form>
      </Modal>
      <Modal open={state.permissionModalVisible} title="权限" okText="确定" cancelText="取消" onCancel={closePermissionModal} onOk={updatePermissionsByUser}>
        <Permission permissions={state.grantedPermissions} onPermissionChanged={onPermissionChange} />
      </Modal>
    </div >
  );
}

export default User;
