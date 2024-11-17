import React from "react";
import ReactDOM from "react-dom";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Provider} from 'react-redux'
import {AppConfigureStore} from "./redux/store/ConfigureStore";
import {TelegramProvider} from "./context/TelegramProvider";
import DefaultLayout from "./Pages/Layouts/DefaultLayout";
import ErrorPage from "./Pages/error-page";
import {
    loaderHistoryImages,
    loaderImageType,
    loaderImageTypes,
    loaderInit,
    loaderProfileInfo
} from "./api/loaders/ApiLoaders";
import HomePage from "./Pages/home-page";
import AboutPage from "./Pages/about-page";
import ProfilePage from "./Pages/profile-page";
import PagePreloader from "./components/PagePreloader";
import SelectImageTypePage from "./Pages/SelectImage/select-image-type-page";
import SelectImagePage from "./Pages/SelectImage/select-image-page";
import {ModalProvider} from "./context/ModalProvider";
import SelectSexPage from "./Pages/select-sex";
import GenerateImagePage, {action as generateImageAction} from "./Pages/generate-image-page";
import HistoryImagesPage from "./Pages/history-images-page";
import {SocketProvider} from "./context/SocketProvider";

const router = createBrowserRouter([
    {
        element: <DefaultLayout />,
        errorElement: <ErrorPage />,
        loader: loaderInit,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: 'select-sex',
                element: <SelectSexPage />
            },
            {
                path: 'select-image-type',
                loader: loaderImageTypes,
                element: <SelectImageTypePage />
            },
            {
                path: 'select-image/:imageTypeId',
                loader: loaderImageType,
                element: <SelectImagePage />,
            },
            {
                path: 'generate-image',
                action: generateImageAction,
                element: <GenerateImagePage />,
            },
            {
                path: 'about',
                element: <AboutPage />
            },
            {
                path: 'profile',
                loader: loaderProfileInfo,
                element: <ProfilePage />,
            },
            {
                path: "history/:userId",
                loader: loaderHistoryImages,
                element: <HistoryImagesPage />,
            },
        ],
    },
],{
    basename: process.env.REACT_APP_ROOT_GIT_URL,
});

ReactDOM.render(
    <React.StrictMode>
        <TelegramProvider>
            <ModalProvider>
                <Provider store={AppConfigureStore}>
                    <SocketProvider>
                        <RouterProvider router={router} fallbackElement={<PagePreloader/>}/>
                    </SocketProvider>
                </Provider>
            </ModalProvider>
        </TelegramProvider>
    </React.StrictMode>
, document.getElementById("root"));
