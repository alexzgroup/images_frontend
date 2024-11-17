import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../redux/store/ConfigureStore";
import {ReduxSliceUserInterface, setUserDateVip} from "../redux/slice/UserSlice";
import Pusher from "pusher-js";
import {socketDonutType} from "../types/ApiTypes";
import {useModalPage} from "./ModalProvider";
import AlertDialogVipBy from "../components/Modals/AlertDialogVipBy";
import Echo from "laravel-echo";

export const SocketProvider = ({children}: { children: React.ReactNode }) => {
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const dispatch = useDispatch();
    const {setModal} = useModalPage();

    const initSocket = (UserId: number) => {
        const options = {
            broadcaster: 'pusher',
            key: process.env.REACT_APP_PUSHER_APP_KEY,
            app_key: process.env.REACT_APP_PUSHER_APP_KEY,
            cluster: process.env.REACT_APP_PUSHER_CLUSTER,
            wsHost: process.env.REACT_APP_PUSHER_HOST,
            forceTLS: false,
            disableStats: true,
            authEndpoint: process.env.REACT_APP_URL_API + "pusher/auth",
            auth: {
                headers: {
                    'X-Referer': (window as any).Telegram?.WebApp.initData,
                    'x-platform': 'tg',
                },
            },
        }

        const pusher = new Pusher(options.key, options);

        const echo = new Echo({
            ...options,
            client: pusher
        });

        echo.private(`users.${UserId}`)
            .listen('.donut.success', (e: socketDonutType) => {
                if (e.data.status) {
                    dispatch(setUserDateVip({date_vip_ended: e.data.date_vip_ended}))
                    setModal(<AlertDialogVipBy />)
                }
            })
            .error((error: any) => {
                console.error(error);
            });
    }

    useEffect(() => {
        if (userDbData?.id) {
            initSocket(userDbData.id);
        }
    }, [userDbData?.id]);

    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    );
};
