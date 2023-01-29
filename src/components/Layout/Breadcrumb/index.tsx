import { Breadcrumb as AntdBreadcrumb } from 'antd'
import { SubMenuType } from 'antd/es/menu/hooks/useItems';
import { useLocation } from 'react-router-dom';
import { useStores } from '../../../hooks/useStore';

function Breadcrumb() {
    const location = useLocation();
    const { useNavigateMenuStore } = useStores();
    const menus = useNavigateMenuStore(state => state.menus);
    const breadcrumbs = () => {
        const names = [] as string[];
        const url = location.pathname;
        for (const item of menus) {
            const menu = item as SubMenuType;
            if (url.startsWith(menu.key + "")) {
                names.push(menu.label + "");
                for (const submenu of menu.children) {
                    if (url === submenu?.key) {
                        names.push((submenu as SubMenuType).label?.toString() ?? "");
                    }
                }
            }
        }
        return names;
    };
    return (
        <AntdBreadcrumb>
            {
                breadcrumbs().map(i => { return <AntdBreadcrumb.Item key={i}>{i}</AntdBreadcrumb.Item> })
            }
        </AntdBreadcrumb>
    );
}

export default Breadcrumb;