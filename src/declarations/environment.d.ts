declare global {
    namespace NodeJS {
        interface ProcessEnv {
            REACT_APP_APP_ID: string;
            REACT_APP_APP_GROUP_ID: string;
            NODE_ENV: 'development' | 'production';
            PORT?: string;
            PWD: string;
            REACT_APP_URL_API: string;
            REACT_APP_V_API: string;
            REACT_APP_CALLBACK_URL_CHAT_BOOT: string,
            REACT_APP_DONUT_URL_WEB:string,
            REACT_APP_DONUT_URL_M_WEB:string,
            REACT_APP_ZNAPPS_URL: string,
            REACT_APP_PUSHER_APP_KEY: string,
            REACT_APP_PUSHER_CLUSTER: string,
            REACT_APP_PUSHER_HOST: string,
            REACT_APP_DONUT_URL_CLIENT: string,
            REACT_APP_TG_URL: string,
        }
    }
}
// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}