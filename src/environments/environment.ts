import { WebStorageStateStore } from "oidc-client-ts";
import { AuthProviderProps } from "react-oidc-context";

export const baseUrl = "http://localhost:3000";

export const oidcConfig: AuthProviderProps = {
  authority: "https://localhost:44400",
  client_id: "Blog_React",
  redirect_uri: baseUrl,
  response_type: "code",
  scope: "offline_access Blog profile openid email roles phone address",
  monitorSession: true,
  onSigninCallback: (): void => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
  userStore: new WebStorageStateStore({
    store: localStorage
  })
};
