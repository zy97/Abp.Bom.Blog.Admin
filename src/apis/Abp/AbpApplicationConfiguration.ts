import { ApplicationConfigurationDto } from "@abp/ng.core";
import axios from "axios";

export const getApplicationConfiguration = () => { return axios.get<ApplicationConfigurationDto>(`/api/abp/application-configuration`, {}); }