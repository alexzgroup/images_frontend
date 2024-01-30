import axios from 'axios';
import {
    AddGroupChatBootType,
    AdvertisementType,
    GeneratedImagesType,
    generateImageType,
    GroupToChatBootType,
    imageType,
    imageTypeStatisticType,
    initUserApiType,
    monetizationDataType,
    operationResultType,
    operationWithMessageType,
    ResponseUploadPhotoType,
    sendGenerateImageType,
    ShareTypeEnum,
    UploadPhotoType,
    uploadPhotoType,
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
    return axiosApi.post(`generate_image/add`, data).then((r: {data: generateImageType}) => r.data);
};

/**
 * Получает информацию о доступных генерациях
 */
export const apiGetImageTypeWithStatistic = (image_type_id: number) => {
    return axiosApi.get(`image_type/${image_type_id}`).then((r: {data: imageTypeStatisticType}) => r.data);
};

/**
 * Получает сгенерированное изображение
 */
export const apiGetGenerateImage = (id: number) => {
    return axiosApi.get(`generate_image/${id}`).then((r: {data: uploadPhotoType}) => r.data);
};

/**
 * Добавляет чат-бот к группе
 * @param data
 */
export const addChatBootToGroup = (data: AddGroupChatBootType) => {
    return axiosApi.post(`chat_boot/add`, data).then((r: {data: AddGroupChatBootType}) => r.data);
}

/**
 * Меняет настройки группы в чат боте
 * @param data
 */
export const editChatBootToGroup = (data: {vk_group_id: number, server_id: number}) => {
    return axiosApi.post(`chat_boot/edit`, data).then((r: {data: operationResultType}) => r.data);
}

/**
 * Удаляет чат бот
 * @param vk_group_id
 */
export const deleteChatBootToGroup = (vk_group_id: number) => {
    return axiosApi.delete(`chat_boot/delete/${vk_group_id}`).then((r: {data: operationResultType}) => r.data);
}

/**
 * Список групп подключенных к чат боту
 */
export const getChatBootGroups = () => {
    return axiosApi.get(`chat_boot/group_list`).then((r: {data: GroupToChatBootType[]}) => r.data);
}

/**
 * Добавляет статистику показов рекламы
 * @param data
 */
export const addAdvertisement = (data: AdvertisementType) => {
    return axiosApi.post(`add_advertisement`, data).then((r: {data: operationResultType}) => r.data);
}

/**
 * Проверка включены ли уведомления от группы
 */
export const getAllowMessages = () => {
    return axiosApi.get(`allow_messages`).then((r: {data: operationResultType}) => r.data);
}

/**
 * Добавляет уведомления
 */
export const addAllowMessages = () => {
    return axiosApi.post(`allow_messages/add`).then((r: {data: operationResultType}) => r.data);
}

/**
 * Получает генерированные изображения
 */
export const getGeneratedImages = () => {
    return axiosApi.get(`generate_image`).then((r: {data: GeneratedImagesType}) => r.data.images);
}

/**
 * Загружает фото на сервер ВК
 * @param data
 */
export const uploadImage = (data: UploadPhotoType) => {
    return axiosApi.post(`generate_image/upload_vk_server`, data).then((r: {data: ResponseUploadPhotoType}) => r.data);
}

/**
 * Обновляет информацию о поделиться
 * @param id
 * @param share_type
 */
export const updateShareGenerateImage = (id: number, share_type: ShareTypeEnum) => {
    return axiosApi.put(`generate_image/update_share_info`, {share_type, id}).then((r: {data: operationResultType}) => r.data);
}
