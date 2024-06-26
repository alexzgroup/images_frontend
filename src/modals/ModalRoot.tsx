import React, {FC} from 'react';

import {
    Button,
    ButtonGroup,
    Div,
    Link,
    ModalCard,
    ModalPage,
    ModalPageHeader,
    ModalRoot,
    Title,
    usePlatform
} from '@vkontakte/vkui';
import {Icon56DonateOutline, Icon56InfoOutline, Icon56PaletteOutline, Icon56Users3Outline} from '@vkontakte/icons';
import {useActiveVkuiLocation, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {getDonutUrl} from "../helpers/AppHelper";
import {SelectUserImage} from "../components/SelectUserImage";
import {useSelector} from "react-redux";
import {RootStateType} from "../redux/store/ConfigureStore";
import {ReduxSliceImageInterface} from "../redux/slice/ImageSlice";
import {PreloaderUploadPhoto} from "../components/PreloaderUploadPhoto";
import {ReduxSliceStatusesInterface} from "../redux/slice/AppStatusesSlice";
import bridge from "@vkontakte/vk-bridge";
import {addAdvertisement} from "../api/AxiosApi";
import {ReduxSliceUserInterface} from "../redux/slice/UserSlice";
import GenerateImageResultShare from "../components/GenerateImage/GenerateImageResultShare";
import {AdvertisementEnum, EAdsFormats} from "../types/ApiTypes";
import ModalGetVipContent from "../components/RenestraVip/ModalGetVipContent";

export enum ModalTypes {
    MODAL_GET_VIP_PROFILE = 'modal_get_vip_profile',
    MODAL_SELECT_GENERATE_IMAGE = 'modal_select_generate_image',
    MODAL_DONUT = 'modal_donut',
    MODAL_DONUT_LIMIT = 'modal_donut_limit',
    MODAL_GENERATED_IMAGE = 'modal_generated_image',
    MODAL_UPLOAD_PHOTO_PRELOADER = 'modal_upload_photo_preloader',
    MODAL_SUBSCRIBE_GROUP = 'modal_subscribe_group',
    MODAL_UNSUBSCRIBE_GROUP = 'modal_unsubscribe_group',
    MODAL_PAY_VOICE = 'modal_pay_voice',
    MODAL_SHOW_GENERATED_IMAGE = 'modal_show_generated_image',
}

const ModalRootComponent:FC = () => {
    const routeNavigator = useRouteNavigator();
    const { modal: activeModal } = useActiveVkuiLocation();
    const platform = usePlatform();
    const {generateImageId} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
    const {windowBlocked} = useSelector<RootStateType, ReduxSliceStatusesInterface>(state => state.appStatuses)
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)

    const closeShowGenerateModal = () => {
        routeNavigator.hideModal()
        if (!userDbData?.is_vip) {
            bridge.send("VKWebAppShowNativeAds", {
                ad_format: EAdsFormats.INTERSTITIAL,
            }).then((data) => {
                if (data.result) {
                    addAdvertisement({type: AdvertisementEnum.window}).then();
                }
            }).catch(() => {});
        }
    }

    return (
        <ModalRoot activeModal={activeModal}>
            <ModalPage
                id={ModalTypes.MODAL_SHOW_GENERATED_IMAGE}
                onClose={closeShowGenerateModal}
                settlingHeight={100}
                hideCloseButton={true}
                header={<ModalPageHeader><Title level="3">Просмотр</Title></ModalPageHeader>}
            >
                <Div>
                    <GenerateImageResultShare />
                </Div>
            </ModalPage>
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
            <ModalCard
                id={ModalTypes.MODAL_DONUT_LIMIT}
                onClose={() => routeNavigator.hideModal()}
                icon={<Icon56DonateOutline />}
                header="Чтобы просматривать историю генерации полностью за 3 часа, необходим VIP-статус"
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
               <SelectUserImage />
            </ModalPage>
            <ModalCard
                id={ModalTypes.MODAL_UPLOAD_PHOTO_PRELOADER}
                onClose={() => !windowBlocked && routeNavigator.hideModal()}
                header={<ModalPageHeader>Подготовка к публикации</ModalPageHeader>}
            >
                <PreloaderUploadPhoto />
            </ModalCard>
            <ModalCard
                id={ModalTypes.MODAL_DONUT}
                onClose={() => routeNavigator.hideModal()}
                icon={<Icon56DonateOutline />}
                header="Поздравляем!"
                subheader="Вы оформили VIP статус."
                actions={
                    <ButtonGroup mode="horizontal" stretched>
                        <Button
                            key="cancel"
                            size="l"
                            mode="primary"
                            stretched
                            onClick={() => routeNavigator.hideModal()}
                        >
                            Закрыть
                        </Button>
                    </ButtonGroup>
                }
            />
            <ModalCard
                id={ModalTypes.MODAL_GENERATED_IMAGE}
                onClose={() => routeNavigator.hideModal()}
                icon={<Icon56PaletteOutline />}
                header="Ваша генерация готова."
                subheader="Перейдите по ссылке чтобы просмотреть результат."
                actions={
                    <ButtonGroup mode="horizontal" stretched>
                        <Button
                            key="cancel"
                            size="l"
                            mode="primary"
                            stretched
                            onClick={() => routeNavigator.push(`/show-generate-image/${generateImageId}/share-wall`)}
                        >
                            Посмотреть результат
                        </Button>
                    </ButtonGroup>
                }
            />
            <ModalCard
                id={ModalTypes.MODAL_SUBSCRIBE_GROUP}
                onClose={() => routeNavigator.hideModal()}
                icon={<Icon56Users3Outline />}
                header="Поздравляем"
                subheader="Вы успешно подписались на группу, теперь Вам доступна дополнительная генерация."
                actions={
                    <ButtonGroup mode="vertical" stretched>
                        <Button
                            size="l"
                            mode="secondary"
                            stretched
                            onClick={() => routeNavigator.hideModal()}
                        >
                            Закрыть
                        </Button>
                    </ButtonGroup>
                }
            />
            <ModalCard
                id={ModalTypes.MODAL_UNSUBSCRIBE_GROUP}
                onClose={() => routeNavigator.hideModal()}
                icon={<Icon56InfoOutline />}
                header="Внимание"
                subheader="Вы вышли из группы, больше Вам не доступна дополнительная генерация."
            />
            <ModalPage
                nav={ModalTypes.MODAL_PAY_VOICE}
                onClose={() => routeNavigator.hideModal()}
                settlingHeight={100}
                className="vip-modal-page"
            >
                <ModalGetVipContent />
            </ModalPage>
        </ModalRoot>
    )
}

export default ModalRootComponent;
