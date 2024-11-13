import React from "react";
import {Lang} from "../lang/en";
import {TLang} from "../types/LangType";

export type TAppContext = {
    lang: TLang,
}

export const AppContext = React.createContext<TAppContext>({
    lang: Lang,
});
