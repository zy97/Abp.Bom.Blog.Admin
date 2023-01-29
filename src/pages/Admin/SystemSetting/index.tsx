import { useAsyncEffect } from "ahooks";
import { Button, Col, Form, message, Row, Space } from "antd";
import { diff } from "just-diff";
import { useEffect, useState } from "react";
import { upperCaseFirst } from "upper-case-first";
import Checkbox from "../../../components/Form/Checkbox";
import InputNumber from "../../../components/Form/InputNumber";
import { useAppConfig, useStores } from "../../../hooks/useStore";
import { transformToZH } from "../../../util/formTransform";

function SystemSetting() {
    const [settingform] = Form.useForm();
    const { useApplicationConfigurationStore } = useAppConfig();
    const getAppConfig = useApplicationConfigurationStore(state => state.Get)
    const { useSettingStore } = useStores();
    const [changeSetting] = useSettingStore(state => [state.changeSetting])
    const [setting, setSetting] = useState<Record<string, string | boolean>>({})
    useEffect(() => {
        settingform.setFieldsValue(setting);
    }, [setting]);
    useAsyncEffect(async () => {
        const config = await getAppConfig()
        const temp = config.setting.values;
        const kv = temp as Record<string, string | boolean>;
        Object.keys(temp).forEach((key) => {
            const value = upperCaseFirst(temp[key] + "");
            if (value === "True") {
                kv[key] = true;
            }
            if (value === "False") {
                kv[key] = false;
            }
        });
        setSetting(kv);
    }, []);
    const createFormItems = () => {
        const kv = setting;
        // delete kv["Abp.Timing.TimeZone"];
        // delete kv["Abp.Localization.DefaultLanguage"];
        const items = Object.keys(kv).map((key) => {
            console.log(typeof kv[key]);
            if (typeof kv[key] === "boolean") {
                return (
                    <Col span={12} key={key}>
                        <Checkbox name={key} label={transformToZH(key)} key={key} />
                    </Col>

                )
            }
            if (!isNaN(+kv[key])) {
                return (
                    <Col span={12} key={key}>
                        <InputNumber style={{ width: '150px' }} name={key} label={transformToZH(key)} key={key} />
                    </Col>
                )
            }
        });
        return items;
    }
    const updateEmailSetting = async (values: any) => {
        const changes = diff(setting, values);
        if (changes.length === 0) {
            return;
        }
        try {
            changes.forEach(async item => {
                const key = item.path[0] as string;
                const value = upperCaseFirst(item.value.toString());
                await changeSetting({ key, value });
                message.success(`${transformToZH(key)}更新成功`);
            });
            setSetting(values);
        }
        catch (e) {
            message.error((e as Error).message)
        }
    }

    return (<div>
        <Form name="form_in_modal" form={settingform} onFinish={updateEmailSetting} labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}>
            <Row gutter={24}> {createFormItems()}</Row>
            <Form.Item wrapperCol={{ offset: 10, span: 16 }} style={{ marginBottom: "0px" }}>
                <Space>
                    <Button type="primary" htmlType="submit">提交</Button>
                    <Button type="primary" >取消</Button>
                </Space>
            </Form.Item>

        </Form>
    </div>);
}

export default SystemSetting;