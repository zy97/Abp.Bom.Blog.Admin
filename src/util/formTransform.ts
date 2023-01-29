import { SettingConst } from "../data/const/setting";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformToArray = (data: any) => {
    return Object.entries(data).map(([key, value]) => {
        let valueStr = value + "";
        valueStr = valueStr.replace(/,/g, "");
        return { name: key, value: valueStr };
    })
}

export const transformToZH = (key: string) => {
    return SettingConst[key];
}