export const L = (resource: string) => {
    const localization = JSON.parse(localStorage.getItem("abp:application:localization") ?? "") as Record<string, Record<string, string>> ?? {};
    console.log(localization);
    const values = resource.split('::');
    if (values.length > 2) {
        return "未提供完整的本地化资源"
    }
    const [moduleName, key] = values;
    const module = localization[moduleName];
    if (!module) {
        return `未找${moduleName}模块资源`
    }
    const displayInfo = module[key];
    if (!displayInfo) {
        return `未找到${moduleName}模块中${key}资源`
    }

    return displayInfo;

}