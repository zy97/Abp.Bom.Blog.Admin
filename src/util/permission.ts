import { Route } from "../router/routes";
export const filterPermissionRoute = (routes: Route[], permissions: Record<string, boolean>) => {
    const returnRoute: Route[] = [];
    for (const route of routes) {
        if (route.children && route.children.length > 0) {
            const newRoute: Route = { ...route, children: [] };
            const children = filterPermissionRoute(route.children, permissions);
            if (children) {
                newRoute.children = children;
                returnRoute.push(newRoute);
            }
        }
        else {
            if (route.permission === undefined || (route.permission && permissions[route.permission])) {
                returnRoute.push(route);
            }
        }
    }
    return returnRoute;
}