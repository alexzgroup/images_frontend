import {Platform} from "@vkontakte/vkui";
import {uploadPhotoType} from "../types/ApiTypes";
import {ShowStoryBoxOptions, UserInfo, WallPostRequestOptions} from "@vkontakte/vk-bridge";
import {userImage} from "../types/UserTypes";

export const getDonutUrl = (platform: string):string => {
    if (platform === Platform.VKCOM) {
        return process.env.REACT_APP_DONUT_URL_WEB;
    } else {
        return process.env.REACT_APP_DONUT_URL_M_WEB;
    }
}

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

export const getStoryBoxData = ({generateImage}: { generateImage: userImage }): ShowStoryBoxOptions => {
    return {
        background_type: 'image',
        url: generateImage.sizes[generateImage.sizes.length - 1].url,
        attachment:
            {
                text: 'learn_more',
                url: 'https://vk.com/app' + process.env.REACT_APP_APP_ID,
                type: 'url',
            },
    }
}

export const trueWordForm = (num: number, variants: string[]): string =>
{
    const numClear = Math.abs(num) % 100; // берем число по модулю и сбрасываем сотни (делим на 100, а остаток присваиваем переменной $num)
    const numWithoutTeen = numClear % 10; // сбрасываем десятки и записываем в новую переменную

    if (numClear > 10 && numClear < 20) // если число принадлежит отрезку [11;19]
        return variants[2];
    if (numWithoutTeen > 1 && numWithoutTeen < 5) // иначе если число оканчивается на 2,3,4
        return variants[1];
    if (numWithoutTeen === 1) // иначе если оканчивается на 1
        return variants[0];

    return num + ' ' + variants[2];
}
