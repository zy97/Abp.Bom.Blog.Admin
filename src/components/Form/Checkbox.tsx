import { Form, Checkbox as AntdCheckbox } from "antd";
type CheckboxProps = {
    name: string
    label?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialValue?: any
}
function Checkbox(props: CheckboxProps) {
    const { name, label, initialValue } = props;
    return (
        <Form.Item name={name} label={label} valuePropName="checked" initialValue={initialValue}>
            <AntdCheckbox />
        </Form.Item>
    );
}

export default Checkbox;