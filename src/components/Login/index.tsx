import { Button, Dropdown, Form, message, Modal, Space, Tabs } from "antd";
import { DownOutlined } from '@ant-design/icons';
import { useAuth } from "react-oidc-context";
import { useDebounceEffect } from "ahooks";
import { useState } from "react";
import { getEmailValidationRule, getPhoneValidationRule, getRequiredRule, getTwoPasswordValidationRule } from "../../util/formValid";
import ConcurrencyStamp from "../Form/ConcurrencyStamp";
import { useStores } from "../../hooks/useStore";
import { baseUrl } from "../../environments/environment";
import type { MenuProps } from 'antd';
import Input from "../Form/Input";
function Login() {
    const auth = useAuth();
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("1");
    const [profileForm] = Form.useForm();
    const [pwdForm] = Form.useForm();
    const { useAccountStore } = useStores();
    const [getProfile, updateProfile, changePassword] = useAccountStore(state => [state.getProfile, state.updateProfile, state.changePassword])
    useDebounceEffect(() => {
        if (!auth.isAuthenticated) {
            auth.signinRedirect();
        }
    }, [auth.isAuthenticated], { wait: 500 })
    const login = () => {
        auth.signinRedirect();
    }
    const logout = async () => {
        await auth.signoutRedirect({ post_logout_redirect_uri: baseUrl });
    }
    const showProfileModal = async () => {
        const profile = await getProfile();
        profileForm.setFieldsValue(profile);
        setProfileModalOpen(true);
    };

    const handleOk = async () => {
        if (activeTab === "1") {
            await updateProfile(profileForm.getFieldsValue());
        }
        if (activeTab === "2") {
            await changePassword(pwdForm.getFieldsValue());
        }
        message.success("更新成功");
        setProfileModalOpen(false);
    };

    const handleCancel = () => {
        setProfileModalOpen(false);
    };
    const tabChange = (key: string) => {
        setActiveTab(key);
    }
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: <a onClick={showProfileModal}>我的信息</a>,
        },
        {
            key: '2',
            label: <a onClick={logout} >退出登录</a>,
        },
    ];
    return (
        <div>
            {auth.isAuthenticated ? <Dropdown menu={{ items }}>
                <a onClick={e => e.preventDefault()}>
                    <Space>{auth.user?.profile.preferred_username}<DownOutlined /></Space>
                </a>
            </Dropdown> : <Button type="link" onClick={login}>登录</Button>}
            <Modal title="账户" open={isProfileModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Tabs defaultActiveKey="1" activeKey={activeTab} tabPosition="top" onChange={tabChange} items={[{
                    label: "基本信息", key: "1", children: (
                        <Form name="form_in_modal" form={profileForm} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} >
                            <Input name="userName" label="用户名" rules={[getRequiredRule("用户名")]} />
                            <Input name="email" label="邮箱" rules={[getRequiredRule("邮箱"), getEmailValidationRule()]} />
                            <Input name="name" label="名字" rules={[getRequiredRule("名字")]} />
                            <Input name="surname" label="姓氏" />
                            <Input name="phoneNumber" label="电话" rules={[getPhoneValidationRule()]} />
                            <ConcurrencyStamp />
                        </Form>
                    )
                }, {
                    label: "密码更新", key: "2", children: (
                        <Form name="form_in_modal" form={pwdForm} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} >
                            <Input name="currentPassword" label="当前密码" rules={[getRequiredRule("当前密码")]} isPassword={true} />
                            <Input name="newPassword" label="新密码" rules={[getRequiredRule("新密码")]} isPassword={true} />
                            <Input name="confirmNewPassword" label="确认新密码" rules={[getRequiredRule("当前密码"), getTwoPasswordValidationRule("newPassword", "输入的两次密码不一致")]} dependencies={["newPassword"]} isPassword />
                        </Form>)
                }]}>
                </Tabs>
            </Modal>
        </div >
    );
}

export default Login;