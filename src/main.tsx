import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';
import { AuthProvider } from 'react-oidc-context';
import { oidcConfig } from './environments/environment';
import * as dayjs from 'dayjs';
import * as isLeapYear from 'dayjs/plugin/isLeapYear'; // import plugin
import * as format from 'dayjs/plugin/localizedFormat'; // import plugin
import 'dayjs/locale/zh-cn'; // import locale
import interceptors from './Interceptors';
import Routers from './router/index';

dayjs.extend(isLeapYear); // use plugin
dayjs.extend(format); // use plugin
dayjs.locale('zh-cn'); // use locale
interceptors();
// abp angular 之所以能在路由上加上权限，并根据你是否有权限经行菜单路由的显示，是由于调用https://localhost:44349/api/abp/application-configuration接口，这会返回这个账号的很多信息，包括权限信息
// 这一阶段还是先进行正常的显示，调用的时候服务器判断是否有权限，后期在进行权限菜单优化显示
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
    <AuthProvider {...oidcConfig} >
        <ConfigProvider locale={zhCN}>
            <Routers />
        </ConfigProvider>
    </AuthProvider>
);
