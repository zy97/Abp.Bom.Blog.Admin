import { Form, Input } from "antd";
function ConcurrencyStamp() {
    return (
        <Form.Item name="concurrencyStamp" label="concurrencyStamp" hidden>
            <Input />
        </Form.Item>
    );
}

export default ConcurrencyStamp;