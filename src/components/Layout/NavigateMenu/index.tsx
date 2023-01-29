import { useAsyncEffect } from "ahooks";
import { Layout, Menu } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppConfig, useStores } from "../../../hooks/useStore";
import { filterPermissionRoute } from "../../../util/permission";
import type { MenuProps } from 'antd';
import styles from './index.module.less'
import { SubMenuType } from "antd/es/menu/hooks/useItems";
import { Route, ROUTES } from "../../../router/routes";
const { Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];
function NavigateMenu() {
    const navigate = useNavigate();
    const { useApplicationConfigurationStore } = useAppConfig()
    const { useNavigateMenuStore } = useStores();
    const saveMenu = useNavigateMenuStore(state => state.storeMenus);
    const getAppConfig = useApplicationConfigurationStore(state => state.Get);
    const [collapsed, setCollapsed] = useState(false);
    const [menues, setMenues] = useState([] as MenuItem[])
    useAsyncEffect(async () => {
        const config = await getAppConfig();
        const routes = filterPermissionRoute(ROUTES, config.auth.grantedPolicies);
        const m = createMenu("", routes[0].children, [])
        setMenues(m)
        saveMenu(m)
    }, [])
    const createMenu = (rootPath: React.Key, nodes: Route[] | undefined, arr: MenuItem[]) => {
        if (!nodes) {
            return arr;
        }
        for (const item of nodes) {
            if (item.path && item.showInMenu !== false) {
                const menu = getMenuItem(item.title, rootPath + "" + item.path, null) as SubMenuType;
                if (menu) {
                    arr.push(menu);
                    if (item.children && item.children.length) {
                        (menu).children = [];
                        menu.key = rootPath + "" + item.path;
                        createMenu(rootPath + "" + item.path + "/", item.children, menu.children);
                    }
                }
            }
        }
        return arr;
    };
    const getMenuItem = (label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]) => {
        return { key, icon, children, label, } as MenuItem;
    };
    const onClick: MenuProps['onClick'] = (e) => {
        navigate(e.key + "");
    };
    return (
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <div className={styles.logo}>
                <div>Blog</div>
            </div>
            <Menu
                onClick={onClick}
                theme="dark"
                defaultSelectedKeys={["2"]}
                mode="inline"
                items={menues}
            />
        </Sider>
    );
}

export default NavigateMenu;