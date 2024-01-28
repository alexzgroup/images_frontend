import React, {FC, useContext, useEffect, useState} from "react";
import {AdaptiveContext, AdaptiveContextType} from "../context/AdaptiveContext";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../redux/store/ConfigureStore";
import {ReduxSliceUserInterface} from "../redux/slice/UserSlice";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {setGenerateImage} from "../redux/slice/ImageSlice";
import bridge from "@vkontakte/vk-bridge";
import {Button, Div, Group, Image, PanelSpinner, Placeholder} from "@vkontakte/vkui";
import {userImage, userVkPhotoType} from "../types/UserTypes";
import {Icon56ErrorTriangleOutline} from "@vkontakte/icons";
import {ColorsList} from "../types/ColorTypes";

export const SelectUserImage:FC = () => {
    const [imageData, setImageData] = useState<userVkPhotoType|undefined>();
    const [loading, setLoading] = useState<boolean>(true);
    const {vkUserInfo} = useContext<AdaptiveContextType>(AdaptiveContext);
    const {access_token} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const dispatch = useDispatch();
    const routeNavigator = useRouteNavigator();

    const selectImage = (image: userImage) => {
        dispatch(setGenerateImage(image))
        routeNavigator.hideModal();
    }

    useEffect(() => {
        (async () => {
            const {response} = await bridge.send('VKWebAppCallAPIMethod', {
                method: 'photos.get',
                params: {
                    owner_id: Number(vkUserInfo?.id),
                    v: process.env.REACT_APP_V_API,
                    access_token: access_token,
                    album_id: 'profile',
                    rev: 1,
                }});

            setImageData(response);
            setLoading(false);
        })()
    }, []);

    return (
        <React.Fragment>
            {
                loading
                    ?
                    <PanelSpinner size="medium" />
                    :
                    <React.Fragment>
                        {
                            (imageData && !!imageData.items.length) ?
                                <Group>
                                    <Div style={{
                                        display: 'grid',
                                        gridTemplate: '1fr/1fr 1fr 1fr',
                                        gap: 15,
                                        justifyItems: 'center'
                                    }}>
                                        {
                                            imageData.items.map((item, key) => (
                                                <div key={'select_image_' + key}>
                                                    <Button onClick={() => selectImage(item)} mode='link'>
                                                        <Image size={96} src={item.sizes[item.sizes.length - 1].url} />
                                                    </Button>
                                                </div>
                                            ))
                                        }
                                    </Div>
                                </Group>
                                :
                                <Placeholder
                                    icon={<Icon56ErrorTriangleOutline fill={ColorsList.error} />}
                                    header="У вас нет фотографий!"
                                    action={<Button size="m" onClick={() => routeNavigator.hideModal()}>Закрыть</Button>}
                                >
                                    Добавьте фотографию на аватарку на странице ВКонтакте и перезайдите в приложение.
                                </Placeholder>
                        }
                    </React.Fragment>
            }
        </React.Fragment>
    )
}
