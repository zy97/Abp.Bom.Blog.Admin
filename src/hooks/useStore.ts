import { useContext } from 'react';
import { abpApplicationConfigurationContext, storesContext } from '../stores';

export const useStores = () => useContext(storesContext);
export const useAppConfig = () => useContext(abpApplicationConfigurationContext);
