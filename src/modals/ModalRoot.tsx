import React, {FC, useContext} from 'react';

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
import {useSelector} from "react-redux";
import {RootStateType} from "../redux/store/ConfigureStore";
import {ReduxSliceImageInterface} from "../redux/slice/ImageSlice";
import {PreloaderUploadPhoto} from "../components/PreloaderUploadPhoto";
import {ReduxSliceStatusesInterface} from "../redux/slice/AppStatusesSlice";
import GenerateImageResultShare from "../components/GenerateImage/GenerateImageResultShare";
import ModalGetVipContent from "../components/RenestraVip/ModalGetVipContent";
import {AdaptiveContext, AdaptiveContextType} from "../context/AdaptiveContext";
import {TadsWidget} from "react-tads-widget";
import {addAdvertisement} from "../api/AxiosApi";
import {AdvertisementEnum} from "../types/ApiTypes";

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
    MODAL_TG_TADS = 'modal_tg_tads',
}

const ModalRootComponent:FC = () => {
    const routeNavigator = useRouteNavigator();
    const { modal: activeModal } = useActiveVkuiLocation();
    const platform = usePlatform();
    const {generateImageId} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
    const {windowBlocked} = useSelector<RootStateType, ReduxSliceStatusesInterface>(state => state.appStatuses)
    const {lang} = useContext<AdaptiveContextType>(AdaptiveContext);

    const closeShowGenerateModal = () => {
        routeNavigator.hideModal()
        // routeNavigator.showModal(ModalTypes.MODAL_TG_TADS)
    }

    return (
        <ModalRoot activeModal={activeModal}>
            <ModalPage
                id={ModalTypes.MODAL_SHOW_GENERATED_IMAGE}
                onClose={closeShowGenerateModal}
                settlingHeight={100}
                hideCloseButton={true}
                header={<ModalPageHeader><Title level="3">{lang.MODALS.VIEW}</Title></ModalPageHeader>}
            >
                <Div>
                    <GenerateImageResultShare />
                </Div>
            </ModalPage>
            <ModalCard
                id={ModalTypes.MODAL_GET_VIP_PROFILE}
                onClose={() => routeNavigator.hideModal()}
                icon={<Icon56DonateOutline />}
                header={lang.MODALS.WHY_VIP}
                subheader={lang.MODALS.AMOUNT_VIP}
                actions={
                    <ButtonGroup mode="horizontal" stretched>
                        <Button
                            key="cancel"
                            size="l"
                            mode="secondary"
                            stretched
                            onClick={() => routeNavigator.hideModal()}
                        >
                            {lang.MODALS.CLOSE}
                        </Button>
                        <Button
                            key="add"
                            size="l"
                            mode="primary"
                            stretched
                        >
                            <Link target="_blank" href={getDonutUrl(platform)}>{lang.MODALS.BY}</Link>
                        </Button>
                    </ButtonGroup>
                }
            />
            <ModalCard
                id={ModalTypes.MODAL_DONUT_LIMIT}
                onClose={() => routeNavigator.hideModal()}
                icon={<Icon56DonateOutline />}
                header={lang.MODALS.VIP_HISTORY}
                subheader={lang.MODALS.AMOUNT_VIP}
                actions={
                    <ButtonGroup mode="horizontal" stretched>
                        <Button
                            key="cancel"
                            size="l"
                            mode="secondary"
                            stretched
                            onClick={() => routeNavigator.hideModal()}
                        >
                            {lang.MODALS.CLOSE}
                        </Button>
                        <Button
                            key="add"
                            size="l"
                            mode="primary"
                            stretched
                        >
                            <Link target="_blank" href={getDonutUrl(platform)}>{lang.MODALS.BY}</Link>
                        </Button>
                    </ButtonGroup>
                }
            />
            <ModalCard
                id={ModalTypes.MODAL_UPLOAD_PHOTO_PRELOADER}
                onClose={() => !windowBlocked && routeNavigator.hideModal()}
                header={<ModalPageHeader>{lang.MODALS.GET_PRELOADER}</ModalPageHeader>}
            >
                <PreloaderUploadPhoto />
            </ModalCard>
            <ModalCard
                id={ModalTypes.MODAL_DONUT}
                onClose={() => routeNavigator.hideModal()}
                icon={<Icon56DonateOutline />}
                header={lang.MODALS.CONGRATULATE}
                subheader={lang.MODALS.CONGRATULATE_VIP}
                actions={
                    <ButtonGroup mode="horizontal" stretched>
                        <Button
                            key="cancel"
                            size="l"
                            mode="primary"
                            stretched
                            onClick={() => routeNavigator.hideModal()}
                        >
                            {lang.MODALS.CLOSE}
                        </Button>
                    </ButtonGroup>
                }
            />
            <ModalCard
                id={ModalTypes.MODAL_GENERATED_IMAGE}
                onClose={() => routeNavigator.hideModal()}
                icon={<Icon56PaletteOutline />}
                header={lang.MODALS.READY_IMAGE}
                subheader={lang.MODALS.GO_READY_IMAGE}
                actions={
                    <ButtonGroup mode="horizontal" stretched>
                        <Button
                            key="cancel"
                            size="l"
                            mode="primary"
                            stretched
                            onClick={() => routeNavigator.push(`/show-generate-image/${generateImageId}/share-wall`)}
                        >
                            {lang.MODALS.VIEW_IMAGE}
                        </Button>
                    </ButtonGroup>
                }
            />
            <ModalCard
                id={ModalTypes.MODAL_SUBSCRIBE_GROUP}
                onClose={() => routeNavigator.hideModal()}
                icon={<Icon56Users3Outline />}
                header={lang.MODALS.CONGRATULATE}
                subheader={lang.MODALS.SUBSCRIBE_DESCRIPTION}
                actions={
                    <ButtonGroup mode="vertical" stretched>
                        <Button
                            size="l"
                            mode="secondary"
                            stretched
                            onClick={() => routeNavigator.hideModal()}
                        >
                            {lang.MODALS.CLOSE}
                        </Button>
                    </ButtonGroup>
                }
            />
            <ModalCard
                id={ModalTypes.MODAL_UNSUBSCRIBE_GROUP}
                onClose={() => routeNavigator.hideModal()}
                icon={<Icon56InfoOutline />}
                header={lang.ALERT.WARNING}
                subheader={lang.MODALS.UNSUBSCRIBE_DESCRIPTION}
            />
            <ModalPage
                nav={ModalTypes.MODAL_PAY_VOICE}
                onClose={() => routeNavigator.hideModal()}
                settlingHeight={100}
                className="vip-modal-page"
            >
                <ModalGetVipContent />
            </ModalPage>
            <ModalCard
                id={ModalTypes.MODAL_TG_TADS}
                onClose={() => routeNavigator.hideModal()}
            >
                <TadsWidget
                    id={process.env.REACT_APP_TG_TADS_WIDGET_ID}
                    onShowReward={(adId) => addAdvertisement({type: AdvertisementEnum.tg_tads}).then()}
                    onAdsNotFound={() => console.log(4444)}
                    debug={true}
                />
            </ModalCard>
        </ModalRoot>
    )
}

export default ModalRootComponent;
