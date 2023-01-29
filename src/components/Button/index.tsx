import { useAsyncEffect } from "ahooks";
import { Button as Btn, ButtonProps } from "antd";
import React, { useState } from "react";
import { useAppConfig } from "../../hooks/useStore";
interface PermissionButtonProps extends WithPermisionProps, ButtonProps {
    text?: string | undefined
    children?: React.ReactNode | undefined
}
function Button(props: PermissionButtonProps) {
    const { text, children, ...extraProp } = props;
    return (
        <Btn {...extraProp} >{text ?? children}</Btn>
    );
}

export default withPermission(Button);

interface WithPermisionProps {
    permission?: string;
}
export function withPermission<T extends WithPermisionProps = WithPermisionProps>(
    WrappedComponent: React.ComponentType<T>
) {
    // Try to create a nice displayName for React Dev Tools.
    const displayName = WrappedComponent.displayName || WrappedComponent.name || "Component";
    const ComponentWithPermission = (props: T) => {
        const { permission, ...extraProp } = props;
        const { useApplicationConfigurationStore } = useAppConfig();
        const [permissions, setPermissions] = useState<Record<string, boolean>>({})
        const getAppConfig = useApplicationConfigurationStore(state => state.Get)
        useAsyncEffect(async () => {
            const config = await getAppConfig();
            setPermissions(config.auth.grantedPolicies)
        }, [])
        let showBtn = true;
        if (permission && permission !== "" && !permissions[permission])
            showBtn = false
        // props comes afterwards so the can override the default ones.
        return showBtn ? <WrappedComponent {...(extraProp as T)} /> : <></>;
    };

    ComponentWithPermission.displayName = `withPermission(${displayName})`;
    return ComponentWithPermission;
}