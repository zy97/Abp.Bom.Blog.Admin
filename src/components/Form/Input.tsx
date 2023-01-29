import { Form, Input as AntdInput } from "antd";
import { Rule } from "antd/es/form";
import { NamePath } from "antd/es/form/interface";

type InputProps = {
    name: string
    label: string
    rules?: Rule[]
    dependencies?: NamePath[]
    placeholder?: string | true
    isPassword?: boolean
    hidden?: boolean
}
function Input(props: InputProps) {
    const { name, label, rules, dependencies, isPassword, placeholder, hidden } = props;
    let waterText = undefined;
    if (placeholder === true) {
        waterText = rules?.filter((r: any) => r.required === true).map((r: any) => r.message).join(" ") ?? "请输入" + label;
    }
    else {
        waterText = placeholder
    }
    return (
        <>
            <Form.Item name={name} label={label} rules={rules} dependencies={dependencies} hidden={hidden} >
                {isPassword === true ? <AntdInput.Password placeholder={waterText} /> : <AntdInput placeholder={waterText} />}
            </Form.Item>
        </>

    );
}

export default Input;