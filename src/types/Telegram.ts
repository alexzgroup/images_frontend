import {LangEnum} from "../enum/LangEnum";

export interface ITelegramUser {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    language_code: keyof typeof LangEnum;
    is_premium?: boolean;
    photo_url?: string;
}

export type TStoryWidgetLink = {
    url: string,
    name?: string,
}

export interface IStoryShareParams {
    text: string;
    widget_link: TStoryWidgetLink,
}

export interface IWebApp {
    initData: string;
    initDataUnsafe: {
        query_id: string;
        user: ITelegramUser;
        auth_date: string;
        hash: string;
    };
    version: string;
    platform: string;
    colorScheme: 'light' | 'dark';
    themeParams: {
        link_color: string;
        button_color: string;
        button_text_color: string;
        secondary_bg_color: string;
        hint_color: string;
        bg_color: string;
        text_color: string;
    };
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    isClosingConfirmationEnabled: boolean;
    headerColor: string;
    backgroundColor: string;
    BackButton: {
        isVisible: boolean;
    };
    MainButton: {
        text: string;
        color: string;
        textColor: string;
        isVisible: boolean;
        isProgressVisible: boolean;
        isActive: boolean;
    };
    HapticFeedback: any;
    shareToStory: (media_url: string, params: IStoryShareParams) => void;
}
