import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {AdaptivityProvider, AppRoot, ConfigProvider} from "@vkontakte/vkui";
import {RouterProvider} from "@vkontakte/vk-mini-apps-router";
import AppRouter from "./routers/AppRouter";
import { Provider } from 'react-redux'
import {AppConfigureStore} from "./redux/store/ConfigureStore";
import { TelegramProvider } from "./context/TelegramProvider";


ReactDOM.render(
    <TelegramProvider>
        <ConfigProvider>
            <AdaptivityProvider>
                <AppRoot>
                    <RouterProvider router={AppRouter}>
                        <Provider store={AppConfigureStore}>
                            <App />
                        </Provider>
                    </RouterProvider>
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    </TelegramProvider>
, document.getElementById("root"));
