declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            PORT?: string;
            PWD: string;
            REACT_APP_PUSHER_APP_KEY: string,
            REACT_APP_PUSHER_CLUSTER: string,
            REACT_APP_PUSHER_HOST: string,
            REACT_APP_URL_API: string,
            REACT_APP_TG_URL: string,
            REACT_APP_TG_TADS_WIDGET_ID: number
            REACT_APP_TG_ADSGRAM_BLOCK_ID: number
            REACT_APP_ROOT_GIT_URL: string
        }
    }
}
// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}