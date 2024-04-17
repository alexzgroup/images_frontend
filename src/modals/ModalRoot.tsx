import React, {FC} from 'react';

import {
    Button,
    ButtonGroup,
    Cell,
    Headline,
    Link,
    List,
    ModalCard,
    ModalPage,
    ModalPageHeader,
    ModalRoot,
    Title,
    usePlatform
} from '@vkontakte/vkui';
import {
    Icon28AccessibilityOutline,
    Icon28PaletteOutline,
    Icon36AdvertisingOutline,
    Icon36CameraOutline,
    Icon56DonateOutline,
    Icon56InfoOutline,
    Icon56PaletteOutline,
    Icon56Users3Outline
} from '@vkontakte/icons';
import {useActiveVkuiLocation, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {getDonutUrl} from "../helpers/AppHelper";
import {SelectUserImage} from "../components/SelectUserImage";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../redux/store/ConfigureStore";
import {ReduxSliceImageInterface} from "../redux/slice/ImageSlice";
import {PreloaderUploadPhoto} from "../components/PreloaderUploadPhoto";
import {ReduxSliceStatusesInterface} from "../redux/slice/AppStatusesSlice";
import golden_light from '../assets/images/golden_light.png';
import RenestraTitleWithVip from "../components/RenestraVip/RenestraTitleWithVip";
import bridge from "@vkontakte/vk-bridge";
import {getVoiceSubscription} from "../api/AxiosApi";
import {setUserVoiceSubscription} from "../redux/slice/UserSlice";

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
}

const ModalRootComponent:FC = () => {
    const routeNavigator = useRouteNavigator();
    const { modal: activeModal } = useActiveVkuiLocation();
    const platform = usePlatform();
    const {generateImageId} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
    const {windowBlocked} = useSelector<RootStateType, ReduxSliceStatusesInterface>(state => state.appStatuses)
    const dispatch = useDispatch();

    const openVoicePayModal = async () => {
        const voiceSubscriptionId = await getVoiceSubscription();

        bridge.send('VKWebAppShowSubscriptionBox', {
            action: 'create',
            item: String(voiceSubscriptionId), // Идентификатор подписки в приложении
        })
            .then((data) => {
                dispatch(setUserVoiceSubscription({
                    subscription_id: Number(data.subscriptionId),
                    pending_cancel: 0,
                }));
                routeNavigator.showModal(ModalTypes.MODAL_DONUT);
                console.log('Success payment', data);
            })
            .catch((e) => {
                console.log('Error payment', e);
            })
    }

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
                <div style={{
                    display: 'flex',
                    flexFlow: 'column',
                    alignItems: 'center',
                    gap: 5
                }}>
                    <img width={320} style={{margin: 'auto', display: 'block'}} src={golden_light} alt="golden_light"/>
                    <RenestraTitleWithVip/>
                    <Title level="2">Оформление подписки VIP!</Title>
                        <List>
                            <Cell disabled before={<Icon36CameraOutline fill='FFAA38'/>}>20 генераций в день</Cell>
                            <Cell disabled before={<Icon28AccessibilityOutline width={36} height={36} fill='FFAA38'/>}>Приоритетная
                                очередь</Cell>
                            <Cell disabled before={<Icon28PaletteOutline width={36} height={36} fill='FFAA38'/>}>Эксклюзивные
                                образы</Cell>
                            <Cell disabled before={<Icon36AdvertisingOutline fill='FFAA38'/>}>Отсутствие рекламы</Cell>
                        </List>
                        <Headline level='1'>Всего 20 голосов в месяц.</Headline>
                        <Headline level='2'>Воспользуйтесь всеми преимуществами VIP статуса уже сейчас!</Headline>
                        <Button onClick={openVoicePayModal} className="gold_button" style={{width: '100%', marginTop: 5}}>
                            <div style={{color: 'black'}}>Оформить подписку</div>
                        </Button>
                    </div>
            </ModalPage>
        </ModalRoot>
)
}

export default ModalRootComponent;
