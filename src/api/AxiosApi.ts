import axios from 'axios';
import {
    AdvertisementType,
    exclusiveImageTypesType,
    favoriteImageType,
    GeneratedImagesType,
    generateImageType,
    GenerateProfileInfoType,
    imageType,
    imageTypeStatisticType,
    initUserApiType,
    operationResultType,
    ShareTypeEnum,
    TInvoiceLink,
    TSavePreparedInlineMessage,
} from "../types/ApiTypes";

const axiosApi =  axios.create({
    baseURL: process.env.REACT_APP_URL_API,
    responseType: 'json',
    headers: {
        'X-Referer': (window as any).Telegram?.WebApp.initData,
        'x-platform': 'tg',
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
    return axiosApi.get(`image_type`).then((r: {data:{items:imageType[], exclusive_image_types: exclusiveImageTypesType[], favorite_image_types: favoriteImageType[]}}) => r.data);
};

/**
 * Запрос на генерацию картинки в ИИ
 * @param data
 */
export const apiGenerateImage = (data: FormData) => {
    return axiosApi.postForm(`generate_image/add`, data).then((r: {data: generateImageType}) => r.data);
};

/**
 * Получает информацию о доступных генерациях
 */
export const apiGetImageTypeWithStatistic = (image_type_id: number) => {
    return axiosApi.get(`image_type/${image_type_id}`).then((r: {data: imageTypeStatisticType}) => r.data);
};

/**
 * Добавляет статистику показов рекламы
 * @param data
 */
export const addAdvertisement = (data: AdvertisementType) => {
    return axiosApi.post(`add_advertisement`, data).then((r: {data: operationResultType}) => r.data);
}

/**
 * Получает генерированные изображения
 */
export const getGeneratedImages = (userId: number) => {
    return axiosApi.get(`generate_image/all/` + userId).then((r: {data: GeneratedImagesType}) => r.data.images);
}

/**
 * Получает ссылку на оплату
 */
export const createInvoiceLink = () => {
    return axiosApi.get(`tg/create_invoice_link`).then((r: {data: TInvoiceLink}) => r.data);
}

/**
 * Получает ID сообщения для нового шаринга
 * @param shareImageId
 */
export const getSavePreparedInlineMessage = (shareImageId: number) => {
    return axiosApi.get(`tg/save_prepared_inline_message/` + shareImageId).then((r: {data: TSavePreparedInlineMessage}) => r.data);
}

/**
 * Получает информацию по генерациям для профиля с сокращенной историей генераций
 * @param userId
 */
export const getUserProfileGenerateInfo = (userId: number) => {
    return axiosApi.get(`generate_image/profile_info/` + userId).then((r: {data: GenerateProfileInfoType}) => r.data);
}

/**
 * Обновляет информацию о поделиться
 * @param id
 * @param share_type
 */
export const updateShareGenerateImage = (id: number, share_type: ShareTypeEnum) => {
    return axiosApi.put(`generate_image/update_share_info`, {share_type, id}).then((r: {data: operationResultType}) => r.data);
}

/**
 * Редактирует пользователя
 * @param user_id
 * @param dataUpdate
 */
export const apiEditUser = (user_id: number, dataUpdate: {}) => {
    return axiosApi.post(`user-edit/${user_id}`, {dataUpdate}).then((r: {data: operationResultType}) => r.data);
};
