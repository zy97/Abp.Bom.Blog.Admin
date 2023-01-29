import { Form, InputNumber as AntdInputNumber } from "antd";
type InputNumberProps = {
    name: string
    label: string
    style?: React.CSSProperties
}
function InputNumber(props: InputNumberProps) {
    const { name, label, style } = props;
    return (<Form.Item name={name} label={label} key={name}>
        <AntdInputNumber style={style} />
    </Form.Item>);
}

export default InputNumber;