import {Platform} from "@vkontakte/vkui";
import bridge, {ShowStoryBoxOptions, UserInfo, WallPostRequestOptions} from "@vkontakte/vk-bridge";
import {PlatformType} from "@vkontakte/vkui/dist/lib/platform";
import {uploadImage} from "../api/AxiosApi";

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
export const getWallData = ({photoUploadId, vkUserInfo , wallMessage}: {
    photoUploadId: string,
    vkUserInfo: UserInfo,
    wallMessage: string,
}): WallPostRequestOptions => {
    const urlApp = 'https://vk.com/app' + process.env.REACT_APP_APP_ID;
    return {
        message: wallMessage + urlApp,
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

/**
 * Создает альбом для изображений
 * @param access_token
 */
export const createAlbumImage = async (access_token: string) => {
    const {response} = await bridge.send('VKWebAppCallAPIMethod', {
        method: 'photos.getAlbums',
        params: {
            v: process.env.REACT_APP_V_API,
            access_token: access_token,
        }});

    let findAlbum = null;
    if (response.count) {
        const find = response.items.findIndex((item: any) => item.title.search(new RegExp('Мой образ - Ренестра')) !== -1)
        if (find > -1) {
            findAlbum = response.items[find].id;
        }
    }

    if (!findAlbum) {
        const {response} = await bridge.send('VKWebAppCallAPIMethod', {
            method: 'photos.createAlbum',
            params: {
                v: process.env.REACT_APP_V_API,
                access_token: access_token,
                title: 'Мой образ - Ренестра',
                description: `Мой образ сгенерировало приложение Ренестра - https://vk.com/app${process.env.REACT_APP_APP_ID}`,
            }});

        if (response.id) {
            findAlbum = response.id
        }
    }

    return findAlbum;
}

/**
 * Отправляет фото в альбом и загружает в ВК сервер
 * @param access_token
 * @param imageGeneratedId
 */
export const getPhotoUploadId = async (access_token: string, imageGeneratedId: number) => {
    const albumId = await createAlbumImage(access_token);

    const responseUploadServer = await bridge.send('VKWebAppCallAPIMethod', {
        method: 'photos.getUploadServer',
        params: {
            v: process.env.REACT_APP_V_API,
            access_token: access_token,
            album_id: albumId,
        }});

    const responseUploadImage = await uploadImage({
        upload_url: responseUploadServer.response.upload_url,
        generate_image_id: imageGeneratedId,
    });

    const responseSavePhoto = await bridge.send('VKWebAppCallAPIMethod', {
        method: 'photos.save',
        params: {
            v: process.env.REACT_APP_V_API,
            access_token: access_token,
            ...responseUploadImage,
            album_id: albumId,
            caption: `Мой образ сгенерировало приложение Ренестра - https://vk.com/app${process.env.REACT_APP_APP_ID}`,
        }});

    const photo = responseSavePhoto.response[0] as {access_key: string, owner_id: number, id: number};
    return photo.owner_id + '_' + photo.id + '_' + photo.access_key;
}
