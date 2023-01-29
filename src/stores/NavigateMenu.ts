import { MenuProps } from "antd";
import { create } from "zustand"
type MenuItem = Required<MenuProps>["items"][number];
interface NavigateMenuState {
    menus: MenuItem[]
    storeMenus: (menus: MenuItem[]) => void
}
export const useNavigateMenuStore = create<NavigateMenuState>()((set) => ({
    menus: [],
    storeMenus: (menus: MenuItem[]) => set(() => ({ menus, })),
}))