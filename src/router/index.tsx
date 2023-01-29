import { Router } from "@remix-run/router";
import { useAsyncEffect, useRequest } from "ahooks";
import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Loading from "../components/Loading";
import { useAppConfig } from "../hooks/useStore";
import { filterPermissionRoute } from "../util/permission";
import styles from "./index.module.less"
import { ROUTES } from "./routes";
function Routers() {
    const [router, setRouter] = useState<Router>()
    const { useApplicationConfigurationStore } = useAppConfig();
    const { data, error, loading, runAsync } = useRequest(useApplicationConfigurationStore(state => state.Get), { throttleWait: 1000, manual: true });
    useAsyncEffect(async () => {
        await runAsync()
    }, [])
    useEffect(() => {
        if (data !== undefined) {
            const routes = filterPermissionRoute(ROUTES, data.auth.grantedPolicies);
            const r = createBrowserRouter(routes);
            setRouter(r);
        }
    }, [data]);
    return (
        <div className={styles.wrapper}>
            {loading ? <Loading /> :
                error !== undefined ? <div>{error.message}</div> :
                    router !== undefined ? <RouterProvider router={router} /> : <Loading />
            }
        </div>
    );
}

export default Routers;

