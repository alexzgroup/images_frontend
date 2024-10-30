import React from "react";
import {ITelegramUser} from "../types/Telegram";
import {Lang} from "../lang/en";
import {TLang} from "../types/LangType";

export type AdaptiveContextType = {
    isMobileSize?: boolean,
    vkUserInfo?: ITelegramUser,
    lang: TLang,
}

export const AdaptiveContext = React.createContext<AdaptiveContextType>({
    lang: Lang,
});
