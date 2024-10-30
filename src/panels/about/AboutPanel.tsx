import React, {ReactElement, useContext} from 'react';

import {
    Caption,
    Card,
    CardGrid,
    Div,
    Footer,
    Group,
    Image,
    Link,
    Panel,
    PanelHeader,
    SimpleCell,
    Snackbar,
    Spacing
} from '@vkontakte/vkui';
import {UrlConstants} from "../../constants/UrlConstants";
import {Icon28CancelCircleFillRed, Icon28CheckCircleOutline} from "@vkontakte/icons";
import girl_image from '../../assets/images/icons/girl_icon.png';
import bridge from "@vkontakte/vk-bridge";
import {ColorsList} from "../../types/ColorTypes";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceUserInterface, setUserVoiceSubscription} from "../../redux/slice/UserSlice";
import VipBlock from "../../components/RenestraVip/VipBlock";
import GetVipBanner from "../../components/RenestraVip/GetVipBanner";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";

interface Props {
    id: string;
}

const AboutPanel: React.FC<Props> = ({id}) => {
    const [snackbar, setSnackbar] = React.useState<ReactElement | null>(null);

    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const dispatch = useDispatch();
    const {lang} = useContext<AdaptiveContextType>(AdaptiveContext);

    const openSnackBar = (icon: JSX.Element, text: string): void => {
        if (snackbar) return;
        setSnackbar(
            <Snackbar
                onClose={() => setSnackbar(null)}
                before={icon}
            >
                {text}
            </Snackbar>,
        );
    };

    const actionSubscription = () => {
        const resumeAction = userDbData?.voice_subscribe?.pending_cancel;
        bridge.send('VKWebAppShowSubscriptionBox',
            {
                action: resumeAction ? 'resume' : 'cancel',
                subscription_id: String(userDbData?.voice_subscribe?.subscription_id),
            })
            .then( (data) => {
                if (resumeAction) {
                    openSnackBar(<Icon28CheckCircleOutline fill={ColorsList.success} />, 'Вы восстановили подпсику!');
                } else {
                    openSnackBar(<Icon28CancelCircleFillRed />, 'Вы отменили подпсику!');
                }

                dispatch(setUserVoiceSubscription({
                    subscription_id: Number(data.subscriptionId),
                    pending_cancel: resumeAction ? null : 1,
                }));

                console.log('Success resume or cancel subscription!', data);
            })
            .catch( (e) => {
                console.log('Error resume or cancel subscription!', e);
            })
    }

    return (
        <Panel id={id}>
            <PanelHeader>{lang.HEADERS.ABOUT_PANEL}</PanelHeader>
            <Group>
                <CardGrid size="l">
                    <Card mode='shadow'>
                        <SimpleCell
                            disabled
                            hasActive={false}
                            hasHover={false}
                            before={<Image size={56} src={girl_image}/>}
                            subtitle={lang.TITLES.ABOUT_PANEL_SUBTITLE}
                        >
                            {lang.TITLES.ABOUT_PANEL_APP_NAME}
                        </SimpleCell>
                        <Div>
                            <Caption>{lang.DESCRIPTIONS.ABOUT_PANEL_AI_DESCRIPTION}</Caption>
                            <Spacing/>
                            <Caption>
                                {lang.DESCRIPTIONS.ABOUT_PANEL_POLITIC_START} {" "}
                                <Link target='_blank' href={UrlConstants.URL_POLITIC}>{lang.DESCRIPTIONS.ABOUT_PANEL_POLITIC}</Link>
                                {" "} и {" "}
                                <Link target='_blank' href={UrlConstants.URL_RULE_APP}>{lang.DESCRIPTIONS.ABOUT_PANEL_RULES}</Link>.
                            </Caption>
                        </Div>
                    </Card>
                    {
                        (userDbData?.is_vip)
                        ?
                            <Card mode='shadow'>
                                <GetVipBanner actionSubscription={actionSubscription} />
                            </Card>
                        :
                            <Card mode='shadow'>
                                <div style={{padding: 5}}>
                                    <VipBlock />
                                </div>
                            </Card>
                    }
                </CardGrid>
            </Group>
            <Footer>{lang.DESCRIPTIONS.ABOUT_PANEL_HI}</Footer>
            {snackbar}
        </Panel>
    )
};

export default AboutPanel;
