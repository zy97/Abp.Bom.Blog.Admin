import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigete = useNavigate();
    const handleClick = () => {
        navigete('/');
    };
    return (
        <Result
            status="404"
            title="404"
            subTitle="对不起，您访问的页面不存在"
            extra={<Button type="primary" onClick={handleClick}>首页</Button>}
        />
    );
}

export default NotFound;
