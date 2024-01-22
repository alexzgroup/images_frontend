import React from "react";
import {UserInfo} from "@vkontakte/vk-bridge";


export type AdaptiveContextType = {
    isMobileSize?: boolean,
    vkUserInfo?: UserInfo,
}
export const AdaptiveContext = React.createContext<AdaptiveContextType>({});
