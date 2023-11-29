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
