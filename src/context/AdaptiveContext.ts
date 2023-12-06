import React from "react";
import {UserInfo} from "@vkontakte/vk-bridge";


export type AdaptiveContextType = {
    isVkComPlatform?: boolean,
    isMobileSize?: boolean,
    vkUserInfo?: UserInfo,
    initSocket?: () => void,
}
export const AdaptiveContext = React.createContext<AdaptiveContextType>({});
