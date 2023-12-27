import axios from 'axios';
import {
    generateImageType,
    imageType,
    imageTypeStatisticType,
    initUserApiType,
    monetizationDataType,
    operationResultType,
    operationWithMessageType, sendGenerateImageType,
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

/**
 * Отправляет информацию о подписавшихся на сообщество
 */
export const apiSubscribe = () => {
    return axiosApi.post(`subscribe`).then((r: {data: operationWithMessageType}) => r.data);
};

/**
 * Подключится к монетизации
 */
export const apiMonetization = () => {
    return axiosApi.post(`monetization`).then((r: {data: operationResultType}) => r.data);
};

/**
 * Информация о балансе и группах которые в монетизации
 */
export const apiGetMonetizationData = () => {
    return axiosApi.get(`monetization`).then((r: {data: monetizationDataType}) => r.data);
};

/**
 * Отправляет информацию о группе которая добавила приложение к себе
 * @param group_id
 */
export const apiAddAppToGroup = (group_id: number) => {
    return axiosApi.post(`add_app_to_group`, {group_id}).then((r: {data: operationWithMessageType}) => r.data);
};

/**
 * Запрос на генерацию картинки в ИИ
 * @param data
 */
export const apiGenerateImage = (data: sendGenerateImageType) => {
    return axiosApi.post(`generate_image`, data).then((r: {data: generateImageType}) => r.data);
};

/**
 * Получает информацию о доступных генерациях
 */
export const apiGetImageTypeWithStatistic = (image_type_id: number) => {
    return axiosApi.get(`image_type/${image_type_id}`).then((r: {data: imageTypeStatisticType}) => r.data);
};

/**
 * Получает сгенерированное изображение, после оповещения
 */
export const apiGetProcessingGenerateImage = (access_token: string) => {
    return axiosApi.post(`processing_image`, {access_token}).then((r: {data: generateImageType}) => r.data);
};
