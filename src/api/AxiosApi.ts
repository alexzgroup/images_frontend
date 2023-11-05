import axios from 'axios';
import {
    generateImageType,
    imageType,
    initUserApiType,
    monetizationDataType,
    operationResultType,
    operationWithMessageType
} from "../types/ApiTypes";

const axiosApi =  axios.create({
    baseURL: process.env.REACT_APP_URL_API,
    responseType: 'json',
    headers: {
        'X-Referer': window.location.href,
    },
    withCredentials: false,
});

/**
 * Инициализируем пользователя при запуске
 */
export const apiInitUser = () => {
    return axiosApi.get(`init`).then((r: {data:initUserApiType}) => r.data);
};

/**
 * Получаем типы генераций
 */
export const apiGetImageTypes = () => {
    return axiosApi.get(`image_type`).then((r: {data:{items:imageType[]}}) => r.data.items);
};

export const apiSubscribe = () => {
    return axiosApi.post(`subscribe`).then((r: {data: operationWithMessageType}) => r.data);
};

export const apiMonetization = () => {
    return axiosApi.post(`monetization`).then((r: {data: operationResultType}) => r.data);
};

export const apiGetMonetizationData = () => {
    return axiosApi.get(`monetization`).then((r: {data: monetizationDataType}) => r.data);
};

export const apiAddAppToGroup = (group_id: number) => {
    return axiosApi.post(`add_app_to_group`, {group_id}).then((r: {data: operationWithMessageType}) => r.data);
};

export const apiGenerateImage = (image_url: string, image_type_id: string) => {
    return axiosApi.post(`generate_image`, {image_url, image_type_id}).then((r: {data: generateImageType}) => r.data);
};


