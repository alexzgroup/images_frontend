import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import App from "./App";
import {AdaptivityProvider, AppRoot, ConfigProvider} from "@vkontakte/vkui";
import {RouterProvider} from "@vkontakte/vk-mini-apps-router";
import AppRouter from "./routers/AppRouter";
import { Provider } from 'react-redux'
import {AppConfigureStore} from "./redux/store/ConfigureStore";

// Init VK  Mini App
bridge.send("VKWebAppInit");

ReactDOM.render(
    <ConfigProvider appearance="dark">
      <AdaptivityProvider>
        <AppRoot>
          <RouterProvider router={AppRouter}>
              <Provider store={AppConfigureStore}>
                  <App />
              </Provider>
          </RouterProvider>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>,
    document.getElementById("root"));
