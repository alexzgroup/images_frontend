import React from "react";
import type {ITelegramUser} from "../types/Telegram";


export type AdaptiveContextType = {
    isMobileSize?: boolean,
    vkUserInfo?: ITelegramUser,
}
export const AdaptiveContext = React.createContext<AdaptiveContextType>({});
