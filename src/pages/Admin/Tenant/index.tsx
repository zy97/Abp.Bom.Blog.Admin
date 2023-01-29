import { FeatureDto, GetFeatureListResultDto } from "@abp/ng.feature-management/proxy";
import { TenantDto, } from "@abp/ng.tenant-management/proxy/lib";
import { useAntdTable } from "ahooks";
import { Form, message, Modal, Space } from "antd";
import { ColumnsType } from "antd/es/table";
import { produce } from 'immer';
import { useState } from "react";
import AdvancedSearchForm from "../../../components/AdvanceSearchForm";
import Checkbox from "../../../components/Form/Checkbox";
import Input from "../../../components/Form/Input";
import Table from "../../../components/Table/Table";
import { useAppConfig, useStores } from "../../../hooks/useStore";
import { transformToArray } from "../../../util/formTransform";
import { getEmailValidationRule, getRequiredRule, } from "../../../util/formValid";
import styles from "./index.module.less";
import Button from "../../../components/Button";
import { useApplicationConfigurationStore } from "../../../stores/Abp/ApplicationConfiguration";
type TanantState = {
    tenantId: string
    tenantModalVisible: boolean
    featureModalVisible: boolean
    features: FeatureDto[]
}
function Tenant() {
    const [state, setState] = useState<TanantState>({
        tenantId: "",
        tenantModalVisible: false,
        featureModalVisible: false,
        features: []
    })
    const { L } = useAppConfig();
    const { useTenantsStore } = useStores();
    const [getTenants, getTenantById, deleteTenantSvc, getHostFeatures, getTenantFeatures, updateTenant, updateHostFeatures, updateTenantFeatures, addTenantSvc] = useTenantsStore(state => [state.getTenants, state.getTenantById, state.deleteTenant, state.getHostFeatures, state.getTenantFeatures, state.updateTenant, state.updateHostFeatures, state.updateTenantFeatures, state.addTenant])
    const [form] = Form.useForm();
    const [featuresForm] = Form.useForm();
    const [tenantForm] = Form.useForm();
    const { tableProps, search } = useAntdTable(getTenants, { defaultPageSize: 10, form, debounceWait: 500, });
    const deleteTenant = (record: TenantDto) => {
        Modal.confirm({
            title: "删除标签",
            content: "确定删除吗？",
            onOk: async () => {
                if (await deleteTenantSvc(record.id)) {
                    message.success("删除成功");
                    search.submit();
                }
            },
            okText: "确定",
            cancelText: "取消",
        });
    };
    const showTenantModal = () => { setState(produce(draft => { draft.tenantModalVisible = true })) }
    const addTenant = () => { showTenantModal() }
    const showFeatureModal = async (id?: string) => {
        let featureList: GetFeatureListResultDto;
        if (id)
            featureList = await getTenantFeatures(id);
        else
            featureList = await getHostFeatures();
        const tenantId = id ?? "";
        const features = featureList.groups.flatMap(i => i.features)
        setState(produce(draft => {
            draft.features = features
            draft.tenantId = tenantId
            draft.featureModalVisible = true
        }))
    };
    const getTenant = async (record: TenantDto) => {
        const tenant = await getTenantById(record.id);
        tenantForm.setFieldsValue(tenant);
        setState(produce(draft => {
            draft.tenantModalVisible = true
            draft.tenantId = tenant.id
        }))

    };
    const addOrUpdateTag = async (data: any) => {
        if (data.id) {
            if (await updateTenant(data.id, data))
                message.success("更新成功");
        } else {
            if (await addTenantSvc(data))
                message.success("添加成功");
        }
        tenantForm.resetFields();
        setState(produce(draft => { draft.tenantModalVisible = false }))
        search.submit();
    };
    const updateFeatures = async (data: any) => {
        const { tenantId } = state;
        if (tenantId !== "") {
            await updateTenantFeatures(tenantId, { features: transformToArray(data) });
            setState(produce(draft => { draft.tenantId = "" }))
        }
        else
            await updateHostFeatures({ features: transformToArray(data) });
        setState(produce(draft => { draft.featureModalVisible = false }))
    }
    const tableColumns: ColumnsType<TenantDto> = [
        { title: '租户名', dataIndex: 'name', },
        {
            title: '操作', render: (record) => (
                <Space>
                    <Button permission="AbpTenantManagement.Tenants.Update" type="primary" onClick={() => getTenant(record)}>编辑</Button>
                    <Button permission="AbpTenantManagement.Tenants.Update" type="primary" onClick={() => showFeatureModal(record.id)}>功能</Button>
                    <Button permission="AbpTenantManagement.Tenants.ManageFeatures" type="primary" danger onClick={() => deleteTenant(record)} >删除</Button>
                </Space>
            )
        },
    ]
    const closeTenantModal = () => {
        setState(produce(draft => { draft.tenantModalVisible = false }))
        tenantForm.resetFields();
    }
    const submitTenantModal = async () => {
        addOrUpdateTag(await tenantForm.validateFields());
    }
    const submitFeaturesModal = async () => {
        updateFeatures(await featuresForm.validateFields());
    }
    const closeFeaturesModal = () => {
        setState(produce(draft => { draft.featureModalVisible = false }))
        featuresForm.resetFields();
    }
    return (
        <div>
            <AdvancedSearchForm form={form} {...search} extraActions={[{ content: "添加", action: addTenant, permission: "AbpTenantManagement.Tenants.Create" }, { content: "管理宿主功能", action: showFeatureModal, permission: "FeatureManagement.ManageHostFeatures" },]}>
                <Input name="Filter" label="租户名" placeholder={true} />
            </AdvancedSearchForm>
            <div className={styles.table}>
                <Table<TenantDto> columns={tableColumns}  {...tableProps} />
            </div>
            <Modal open={state.tenantModalVisible} title="添加一个新标签" okText="确定" cancelText="取消" onCancel={closeTenantModal} onOk={submitTenantModal}>
                <Form form={tenantForm} name="form_in_modal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                    <Input name="id" label="id" hidden />
                    <Input name="name" label="租户名" rules={[getRequiredRule("名字")]} />
                    {!tenantForm.getFieldValue("id") && (
                        <>
                            <Input name="adminEmailAddress" label="管理员邮件地址" rules={[getRequiredRule("管理员邮件地址"), getEmailValidationRule(),]} />
                            <Input name="adminPassword" label="管理员密码" rules={[getRequiredRule("管理员密码")]} isPassword />
                        </>
                    )}
                </Form>
            </Modal>
            <Modal open={state.featureModalVisible} title="设置管理" okText="确定" cancelText="取消" onCancel={closeFeaturesModal} onOk={submitFeaturesModal}>
                <Form form={featuresForm}>
                    {state.features.map((i) => { return <Checkbox name={i.name ?? ""} label={i.displayName} key={i.name} initialValue={i.value === "true" ? true : false} /> })}
                </Form>
            </Modal>
        </div >
    );
}

export default Tenant;

