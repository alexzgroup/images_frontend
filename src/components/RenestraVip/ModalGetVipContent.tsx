import React, {FC} from "react";
import {addAdvertisement, getVoiceSubscription} from "../../api/AxiosApi";
import bridge from "@vkontakte/vk-bridge";
import {ReduxSliceUserInterface, setUserVip, setUserVoiceSubscription} from "../../redux/slice/UserSlice";
import {publish} from "../../Events/CustomEvents";
import {ModalTypes} from "../../modals/ModalRoot";
import {useDispatch, useSelector} from "react-redux";
import golden_light from "../../assets/images/golden_light.png";
import RenestraTitleWithVip from "./RenestraTitleWithVip";
import {Button, Cell, List, Title} from "@vkontakte/vkui";
import {
    Icon28AccessibilityOutline,
    Icon28PaletteOutline,
    Icon36AdvertisingOutline,
    Icon36CameraOutline
} from "@vkontakte/icons";
import {useMetaParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {AdvertisementEnum, EAdsFormats} from "../../types/ApiTypes";
import {RootStateType} from "../../redux/store/ConfigureStore";

const ModalGetVipContent:FC<{pageContent?: boolean}> = ({pageContent}) => {
    const dispatch = useDispatch();
    const routeNavigator = useRouteNavigator();
    const metaParams = useMetaParams<{imageGeneratedId?: string}>();
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)

    const openVoicePayModal = async () => {
        const voiceSubscriptionId = await getVoiceSubscription();

        bridge.send('VKWebAppShowSubscriptionBox', {
            action: 'create',
            item: String(voiceSubscriptionId), // Идентификатор подписки в приложении
        })
            .then((data) => {
                dispatch(setUserVoiceSubscription({
                    subscription_id: Number(data.subscriptionId),
                    pending_cancel: null,
                }));
                dispatch(setUserVip({is_vip: true}))
                publish('USER_SUBSCRIBE', {total: 20});
                routeNavigator.showModal(ModalTypes.MODAL_DONUT);
                console.log('Success payment', data);
            })
            .catch((e) => {
                console.log('Error payment', e);
            })
    }

    const skipVip = () => {
        if (!userDbData?.is_vip) {
            bridge.send("VKWebAppShowNativeAds", {
                ad_format: EAdsFormats.INTERSTITIAL,
            }).then((data) => {
                if (data.result) {
                    addAdvertisement({type: AdvertisementEnum.window}).then();
                }
            }).catch(() => {});
        }
        routeNavigator.push(`/show-generate-image/${metaParams?.imageGeneratedId}`)
    }

    return (
        <div style={{
            display: 'flex',
            flexFlow: 'column',
            alignItems: 'center',
            gap: 5
        }}>
            <img width={320} style={{margin: 'auto', display: 'block'}} src={golden_light} alt="golden_light"/>
            <RenestraTitleWithVip />
            <Title level="2">Оформление подписки VIP!</Title>
            <Button onClick={openVoicePayModal} className="gold_button" style={{width: '100%', marginTop: 5}}>
                <div style={{color: 'black'}}>Оформить подписку</div>
            </Button>
            <Title className="golden_text" level='2'>Всего 20 голосов в месяц.</Title>
            {pageContent &&
                <React.Fragment>
                    <Button onClick={skipVip}
                            mode="secondary"
                            size="l"
                            style={{width: '100%', marginTop: 5}}
                    >
                        Пропустить
                    </Button>
                    <Title className="golden_text" style={{textAlign: 'center'}} level='3'>Воспользуйтесь всеми преимуществами VIP статуса уже сейчас!</Title>
                </React.Fragment>
            }
            <List>
                <Cell disabled before={<Icon36CameraOutline fill='FFAA38'/>}>20 генераций в день</Cell>
                <Cell disabled before={<Icon28AccessibilityOutline width={36} height={36} fill='FFAA38'/>}>Приоритетная
                    очередь</Cell>
                <Cell disabled before={<Icon28PaletteOutline width={36} height={36} fill='FFAA38'/>}>Эксклюзивные
                    образы</Cell>
                <Cell disabled before={<Icon36AdvertisingOutline fill='FFAA38'/>}>Отсутствие рекламы</Cell>
            </List>
            {!pageContent && <Title className="golden_text" style={{textAlign: 'center'}} level='3'>Воспользуйтесь всеми преимуществами VIP статуса уже сейчас!</Title>}
        </div>
    )
}

export default ModalGetVipContent;
