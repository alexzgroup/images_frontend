import React, {FC, Suspense, useContext} from 'react';

import {
    Button,
    ButtonGroup,
    Link,
    ModalCard,
    ModalPage,
    ModalPageHeader,
    ModalRoot,
    PanelSpinner,
    usePlatform
} from '@vkontakte/vkui';
import {Icon56DonateOutline, Icon56PaletteOutline} from '@vkontakte/icons';
import {useActiveVkuiLocation, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {getDonutUrl} from "../helpers/AppHelper";
import {SelectUserImage} from "../components/SelectUserImage";
import {AdaptiveContext, AdaptiveContextType} from "../context/AdaptiveContext";

export enum ModalTypes {
    MODAL_GET_VIP_PROFILE = 'modal_get_vip_profile',
    MODAL_SELECT_GENERATE_IMAGE = 'modal_select_generate_image',
    MODAL_PROCESS_GENERATE_IMAGE = 'modal_process_generate_image',
    MODAL_DONUT = 'modal_donut',
    MODAL_GENERATED_IMAGE = 'modal_generated_image',
}

const ModalRootComponent:FC = () => {
    const routeNavigator = useRouteNavigator();
    const { modal: activeModal } = useActiveVkuiLocation();
    const platform = usePlatform();
    const {initSocket} = useContext<AdaptiveContextType>(AdaptiveContext);

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
                            onClick={initSocket}
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
                            onClick={() => routeNavigator.push('/generate/show-image')}
                        >
                            Посмотреть результат
                        </Button>
                    </ButtonGroup>
                }
            />
        </ModalRoot>
    )
}

export default ModalRootComponent;
