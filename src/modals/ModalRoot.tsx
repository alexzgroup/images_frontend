import React, {FC, Suspense} from 'react';

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
import {useSelector} from "react-redux";
import {RootStateType} from "../redux/store/ConfigureStore";
import {ReduxSliceImageInterface} from "../redux/slice/ImageSlice";

export enum ModalTypes {
    MODAL_GET_VIP_PROFILE = 'modal_get_vip_profile',
    MODAL_SELECT_GENERATE_IMAGE = 'modal_select_generate_image',
    MODAL_DONUT = 'modal_donut',
    MODAL_DONUT_LIMIT = 'modal_donut_limit',
    MODAL_GENERATED_IMAGE = 'modal_generated_image',
}

const ModalRootComponent:FC = () => {
    const routeNavigator = useRouteNavigator();
    const { modal: activeModal } = useActiveVkuiLocation();
    const platform = usePlatform();
    const {generateImageId} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)

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
                <Suspense fallback={<PanelSpinner size="medium" />} >
                    <SelectUserImage />
                </Suspense>
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
                            onClick={() => routeNavigator.push(`/generate/show-image/${generateImageId}`)}
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
