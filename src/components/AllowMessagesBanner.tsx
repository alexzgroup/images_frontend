import React, {FC, memo, useContext} from "react";
import {Banner, Button} from "@vkontakte/vkui";
import {ColorsList} from "../types/ColorTypes";
import bridge from "@vkontakte/vk-bridge";
import {addAllowMessages, getAllowMessages} from "../api/AxiosApi";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../redux/store/ConfigureStore";
import {ReduxSliceUserInterface, setUserAllowMessages} from "../redux/slice/UserSlice";
import {AdaptiveContext, AdaptiveContextType} from "../context/AdaptiveContext";

type AllowMessagesBannerType = {
    callbackSuccess: () => void,
}
const AllowMessagesBanner:FC<AllowMessagesBannerType> = ({callbackSuccess}) => {
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const dispatch = useDispatch();
    const {isMobileSize} = useContext<AdaptiveContextType>(AdaptiveContext);

    const allowNotice = () => {
        bridge.send('VKWebAppAllowMessagesFromGroup', {
            group_id: Number(process.env.REACT_APP_APP_GROUP_ID),
        }).then((data) => {
            if (data.result) {
                addAllowMessages().then(() => {
                    callbackSuccess()
                    dispatch(setUserAllowMessages(1))
                });
            }
        });
    }

    const getStatusAllowMessages = async () => {
        const {result} = await getAllowMessages();
        if (result) {
            callbackSuccess()
        } else {
            dispatch(setUserAllowMessages(0))
        }
    }

    return (
        <React.Fragment>
            {
                !!userDbData?.allow_messages
                    ?
                    <Banner
                        size="m"
                        noPadding
                        mode="image"
                        header="Уведомления в личные сообщения!"
                        subheader="Получайте уведомления об успешной генерации ваших аватарок и о появлении новых образов."
                        background={<div style={{background: ColorsList.success}} />}
                        style={{width: '100%', margin: '10px 0 5px 0'}}
                        actions={<Button onClick={getStatusAllowMessages} mode={isMobileSize ? "primary" : "secondary"}>Проверить уведомления</Button>}
                    />
                    :
                    <Banner
                        size="m"
                        noPadding
                        mode="image"
                        header="У Вас не включены уведомления!"
                        subheader="Получайте уведомления об успешной генерации ваших аватарок и о появлении новых образов."
                        background={<div style={{background: ColorsList.error}} />}
                        style={{width: '100%', margin: '10px 0 5px 0'}}
                        actions={<Button onClick={allowNotice} mode={isMobileSize ? "primary" : "secondary"}>Включить</Button>}
                    />
            }
        </React.Fragment>
    )
}

export default memo(AllowMessagesBanner);
