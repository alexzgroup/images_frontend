import {Platform} from "@vkontakte/vkui";

export const getDonutUrl = (platform: string):string => {
    if (platform === Platform.VKCOM) {
        return process.env.REACT_APP_DONUT_URL_WEB;
    } else {
        return process.env.REACT_APP_DONUT_URL_M_WEB;
    }
}
