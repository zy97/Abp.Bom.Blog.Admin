import { UpdateEmailSettingsDto } from "@abp/ng.setting-management/config/public-api";
import { useAsyncEffect } from "ahooks";
import { Form, message, Space } from "antd";
import { useState } from "react";
import { produce } from 'immer';
import Input from "../../../components/Form/Input";
import Switch from "../../../components/Form/Switch";
import { useAppConfig, useStores } from "../../../hooks/useStore";
import { getEmailValidationRule } from "../../../util/formValid";
import styles from "./index.module.less";
import Button from "../../../components/Button";
type State = {
    email: string
}
function EmailSetting() {
    const [emailSettingform] = Form.useForm();
    const [state, setState] = useState<State>({ email: "" });
    const { useEmailSettingStore } = useStores();
    const [getEmailSetting, sendTestEmailService, updateEmailSettingService] = useEmailSettingStore(state => [state.getEmailSetting, state.sendTestEmail, state.updateEmailSetting])
    useAsyncEffect(async () => {
        const setting = await getEmailSetting()
        emailSettingform.setFieldsValue(setting);
        if (setting.defaultFromAddress) {
            const defaultFromAddress = setting.defaultFromAddress;
            setState(produce(draft => {
                draft.email = defaultFromAddress
            }));
        }
    }, []);
    const sendTestEmail = async () => {
        const email = state.email;
        if (email !== "") {
            await sendTestEmailService({ subject: "测试主题", body: "测试内容", targetEmailAddress: email, senderEmailAddress: email });
            message.success("发送成功");
        }
        else {
            message.error("请先填写默认发送地址");
        }
    }
    const updateEmailSetting = async (values: UpdateEmailSettingsDto) => {
        await updateEmailSettingService(values);
        setState(produce(draft => {
            draft.email = values.defaultFromAddress
        }))
        message.success("更新成功");
    }
    return (
        <div className={styles.wrapper}>
            <Form name="form_in_modal" form={emailSettingform} labelCol={{ span: 3 }} wrapperCol={{ span: 16 }} onFinish={updateEmailSetting} >
                <Input name="smtpHost" label="smtp主机" />
                <Input name="smtpPort" label="smtp端口" />
                <Input name="smtpUserName" label="smtp用户名" />
                <Input name="smtpPassword" label="smtp密码" />
                <Input name="smtpDomain" label="smtp域" />
                <Input name="defaultFromAddress" label="默认发送地址" rules={[getEmailValidationRule()]} />
                <Input name="defaultFromDisplayName" label="默认发送地址展示名" />
                <Switch name="smtpEnableSsl" label="启用Ssl" />
                <Switch name="smtpUseDefaultCredentials" label="使用默认凭证" />
                <Form.Item wrapperCol={{ offset: 6, span: 10 }} >
                    <Space>
                        <Button type="primary" htmlType="submit">提交</Button>
                        <Button type="primary" >取消</Button>
                        <Button permission="SettingManagement.Emailing.Test" type="primary" onClick={sendTestEmail}>发送测试邮件</Button>
                    </Space>
                </Form.Item>

            </Form>
        </div >
    );
}

export default EmailSetting;