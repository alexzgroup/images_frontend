import {Platform} from "@vkontakte/vkui";
import {ShowStoryBoxOptions, UserInfo, WallPostRequestOptions} from "@vkontakte/vk-bridge";
import {PlatformType} from "@vkontakte/vkui/dist/lib/platform";

export const getDonutUrl = (platform: PlatformType):string => {
    if (platform === Platform.VKCOM) {
        return process.env.REACT_APP_DONUT_URL_WEB;
    } else {
        return process.env.REACT_APP_DONUT_URL_CLIENT;
    }
}

/**
 * Генератор данных для стены
 * @param uploadPhoto
 * @param vkUserInfo
 */
export const getWallData = ({photoUploadId, vkUserInfo}: {
    photoUploadId: string,
    vkUserInfo: UserInfo
}): WallPostRequestOptions => {
    const urlApp = 'https://vk.com/app' + process.env.REACT_APP_APP_ID;
    return {
        message: 'Это изображение сгенерировано с помощью приложения "Ренестра". Для генерации своего уникального аватара переходи по ссылке: ' + urlApp,
        attachments: 'https://vk.com/app' + process.env.REACT_APP_APP_ID + ',photo' + photoUploadId,
        owner_id: vkUserInfo.id,
        copyright: urlApp,
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
