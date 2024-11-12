import React, {FC, useContext} from "react";
import {getVoiceSubscription} from "../../api/AxiosApi";
import bridge from "@vkontakte/vk-bridge";
import {setUserVip, setUserVoiceSubscription} from "../../redux/slice/UserSlice";
import {publish} from "../../Events/CustomEvents";
import {ModalTypes} from "../../modals/ModalRoot";
import {useDispatch} from "react-redux";
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
import {AppContext, TAppContext} from "../../context/AppContext";

const ModalGetVipContent:FC<{pageContent?: boolean}> = ({pageContent}) => {
    const dispatch = useDispatch();
    const routeNavigator = useRouteNavigator();
    const metaParams = useMetaParams<{imageGeneratedId?: string}>();
    const {lang} = useContext<TAppContext>(AppContext);

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
            <Title level="2">{lang.TITLES.VIP_MODAL_GET_VIP}</Title>
            <Button onClick={openVoicePayModal} className="gold_button" style={{width: '100%', marginTop: 5}}>
                <div style={{color: 'black'}}>{lang.BUTTONS.VIP_MODAL_GET}</div>
            </Button>
            <Title className="golden_text" level='2'>{lang.DESCRIPTIONS.VIP_MODAL_TOTAL_AMOUNT}</Title>
            {pageContent &&
                <React.Fragment>
                    <Button onClick={skipVip}
                            mode="secondary"
                            size="l"
                            style={{width: '100%', marginTop: 5}}
                    >
                        {lang.BUTTONS.VIP_MODAL_CONTINUE}
                    </Button>
                    <Title className="golden_text" style={{textAlign: 'center'}} level='3'>{lang.DESCRIPTIONS.VIP_MODAL_MOTIVATION}</Title>
                </React.Fragment>
            }
            <List>
                <Cell disabled before={<Icon36CameraOutline fill='FFAA38'/>}>{lang.DESCRIPTIONS.VIP_BLOCK_1}</Cell>
                <Cell disabled before={<Icon28AccessibilityOutline width={36} height={36} fill='FFAA38'/>}>{lang.DESCRIPTIONS.VIP_MODAL_VIP_TEXT_1}</Cell>
                <Cell disabled before={<Icon28PaletteOutline width={36} height={36} fill='FFAA38'/>}>{lang.DESCRIPTIONS.VIP_BLOCK_2}</Cell>
                <Cell disabled before={<Icon36AdvertisingOutline fill='FFAA38'/>}>{lang.DESCRIPTIONS.VIP_MODAL_VIP_TEXT_2}</Cell>
            </List>
            {!pageContent && <Title className="golden_text" style={{textAlign: 'center'}} level='3'>{lang.DESCRIPTIONS.VIP_MODAL_MOTIVATION}</Title>}
        </div>
    )
}

export default ModalGetVipContent;