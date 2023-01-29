import { Form, Switch as AntdSwitch } from "antd";
type SwitchProps = {
    name: string
    label: string
    valuePropName?: string
}
function Switch(props: SwitchProps) {
    const { name, label, valuePropName } = props;
    return (
        <Form.Item name={name} label={label} valuePropName={valuePropName || "checked"}>
            <AntdSwitch />
        </Form.Item>
    );
}

export default Switch;