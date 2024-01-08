import {Platform} from "@vkontakte/vkui";
import {uploadPhotoType} from "../types/ApiTypes";
import {ShowStoryBoxOptions, UserInfo, WallPostRequestOptions} from "@vkontakte/vk-bridge";

export const getDonutUrl = (platform: string):string => {
    if (platform === Platform.VKCOM) {
        return process.env.REACT_APP_DONUT_URL_WEB;
    } else {
        return process.env.REACT_APP_DONUT_URL_M_WEB;
    }
}

/**
 * Генератор данных для стены
 * @param uploadPhoto
 * @param vkUserInfo
 */
export const getWallData = ({uploadPhoto, vkUserInfo}: {
    uploadPhoto: uploadPhotoType,
    vkUserInfo: UserInfo
}): WallPostRequestOptions => {
    return {
        message: 'Это изображение сгенерировано с помощью приложения "Ренестра". Для генерации своего уникального аватара переходи по ссылке:',
        attachments: 'https://vk.com/app' + process.env.REACT_APP_APP_ID + ',photo' + uploadPhoto.photo_upload_id,
        owner_id: vkUserInfo.id,
        copyright: 'https://vk.com/app' + process.env.REACT_APP_APP_ID,
    }
}

/**
 * Генератор данных для истории
 * @param blob
 */
export const getStoryBoxData = (blob: any): ShowStoryBoxOptions => {
    return {
        background_type: 'image',
        blob: blob,
        locked: true,
        attachment:
            {
                text: 'learn_more',
                url: 'https://vk.com/app' + process.env.REACT_APP_APP_ID,
                type: 'url',
            },
    }
}

/**
 * Склонение слов по числу
 * @param num
 * @param variants
 */
export const trueWordForm = (num: number, variants: string[]): string =>
{
    const numClear = Math.abs(num) % 100; // берем число по модулю и сбрасываем сотни (делим на 100, а остаток присваиваем переменной $num)
    const numWithoutTeen = numClear % 10; // сбрасываем десятки и записываем в новую переменную

    if (numClear > 10 && numClear < 20) // если число принадлежит отрезку [11;19]
        return num + ' ' + variants[2];
    if (numWithoutTeen > 1 && numWithoutTeen < 5) // иначе если число оканчивается на 2,3,4
        return num + ' ' + variants[1];
    if (numWithoutTeen === 1) // иначе если оканчивается на 1
        return num + ' ' + variants[0];

    return num + ' ' + variants[2];
}

/**
 * Создает рандомный пароль
 */
export const generatePassword = (): string => {
    // Create a random password
    return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
};
