import React, {FC, Suspense, useContext, useEffect, useState} from 'react';

import {
    Button,
    ButtonGroup,
    Div,
    Group,
    Image,
    Link,
    ModalCard,
    ModalPage,
    ModalPageHeader,
    ModalRoot,
    PanelSpinner,
    usePlatform
} from '@vkontakte/vkui';
import {Icon56DonateOutline} from '@vkontakte/icons';
import {useActiveVkuiLocation, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {getDonutUrl} from "../helpers/AppHelper";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../redux/store/ConfigureStore";
import {AdaptiveContext, AdaptiveContextType} from "../context/AdaptiveContext";
import {ReduxSliceUserInterface} from "../redux/slice/UserSlice";
import bridge from "@vkontakte/vk-bridge";
import {setGenerateImage} from "../redux/slice/ImageSlice";

export enum ModalTypes {
    MODAL_GET_VIP_PROFILE = 'modal_get_vip_profile',
    MODAL_SELECT_GENERATE_IMAGE = 'modal_select_generate_image',
    MODAL_PROCESS_GENERATE_IMAGE = 'modal_process_generate_image',
}

type userSizesImage = {
    height: number,
    width: number,
    url: string,
    type: string,
}

type userImage = {
    album_id: number,
    id: number,
    sizes: userSizesImage[],
}

export type userVkPhotoType = {
    count: number,
    items: userImage[],
}

export const SelectUserImage:FC = () => {
    const [imageData, setImageData] = useState<userVkPhotoType|undefined>();
    const {vkUserInfo} = useContext<AdaptiveContextType>(AdaptiveContext);
    const {access_token} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const dispatch = useDispatch();
    const routeNavigator = useRouteNavigator();

    const selectImage = (url: string) => {
        dispatch(setGenerateImage(url))
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
                }});

            setImageData(response);
        })()
    }, []);

    return (
        <React.Fragment>
            {
                imageData &&
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
                                    <Button onClick={() => selectImage(item.sizes[item.sizes.length - 1].url)} mode='link'>
                                        <Image size={96} src={item.sizes[item.sizes.length - 1].url} />
                                    </Button>
                                </div>
                            ))
                        }
                    </Div>
                </Group>
            }
        </React.Fragment>
    )
}

const ModalRootComponent:FC = () => {
    const routeNavigator = useRouteNavigator();
    const { modal: activeModal } = useActiveVkuiLocation();
    const platform = usePlatform();

    return (
        <ModalRoot activeModal={activeModal}>
            <ModalCard
                id={ModalTypes.MODAL_GET_VIP_PROFILE}
                onClose={() => routeNavigator.hideModal()}
                icon={<Icon56DonateOutline />}
                header="Чтобы сгенерировать данный образ, необходим VIP-статус"
                subheader="Оформите подписку VK Donut на сумму от 179 рублей."
                actions={
                    <ButtonGroup mode="horizontal" stretched>
                        <Button
                            key="cancel"
                            size="l"
                            mode="secondary"
                            stretched
                            onClick={() => routeNavigator.hideModal()}
                        >
                            Закрыть
                        </Button>
                        <Button
                            key="add"
                            size="l"
                            mode="primary"
                            stretched
                        >
                            <Link target="_blank" href={getDonutUrl(platform)}>Оформить</Link>
                        </Button>
                    </ButtonGroup>
                }
            />
            <ModalPage
                id={ModalTypes.MODAL_SELECT_GENERATE_IMAGE}
                onClose={() => routeNavigator.hideModal()}
                settlingHeight={100}
                hideCloseButton={true}
                header={<ModalPageHeader>Выберите фотографию</ModalPageHeader>}
            >
                <Suspense fallback={<PanelSpinner size="medium" />} >
                    <SelectUserImage />
                </Suspense>
            </ModalPage>
            <ModalPage
                id={ModalTypes.MODAL_PROCESS_GENERATE_IMAGE}
                onClose={() => null}
                settlingHeight={100}
                hideCloseButton={true}
                header={<ModalPageHeader>Генерация изображения началась</ModalPageHeader>}
            >
                <PanelSpinner size="regular" />
            </ModalPage>
        </ModalRoot>
    )
}

export default ModalRootComponent;
