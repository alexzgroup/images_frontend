
import {createContext, useContext, useEffect, useMemo, useState} from "react";
import type {ITelegramUser, IWebApp} from "../types/Telegram";
import {AdController} from "../declarations/adsgram";

export interface ITelegramContext {
    webApp?: IWebApp;
    userTg?: ITelegramUser;
    AdController?: AdController;
}

export const TelegramContext = createContext<ITelegramContext>({});

export const TelegramProvider = ({
                                     children,
                                 }: {
    children: React.ReactNode;
}) => {
    const [webApp, setWebApp] = useState<IWebApp | null>(null);
    const [AdController, setAdController] = useState<AdController | null>(null);

    useEffect(() => {
        const app = (window as any).Telegram?.WebApp;
        const AdsGram = (window as any).Adsgram.init({ blockId: process.env.REACT_APP_TG_ADSGRAM_BLOCK_ID });

        if (app) {
            app.ready();
            setAdController(AdsGram);
            setWebApp(app);
        }
    }, []);

    const value = useMemo(() => {
        return (webApp && AdController)
            ? {
                webApp,
                unsafeData: webApp.initDataUnsafe,
                userTg: webApp.initDataUnsafe.user,
                AdController,
            }
            : {};
    }, [webApp]);

    return (
        <TelegramContext.Provider value={value}>
            {children}
        </TelegramContext.Provider>
    );
};

export const useTelegram = () => useContext(TelegramContext);
