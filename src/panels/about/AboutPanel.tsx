import React, {ReactElement, Suspense, useEffect, useState} from 'react';

import {
    Button,
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
    PanelSpinner,
    SimpleCell,
    Snackbar,
    Spacing,
    Subhead,
    Title
} from '@vkontakte/vkui';
import {UrlConstants} from "../../constants/UrlConstants";
import {Icon20CheckNewsfeedOutline, Icon28CancelCircleFillRed, Icon28CheckCircleOutline} from "@vkontakte/icons";
import girl_image from '../../assets/images/icons/girl_icon.png';
import bridge from "@vkontakte/vk-bridge";
import {getGeneratedImages} from "../../api/AxiosApi";
import {ColorsList} from "../../types/ColorTypes";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceUserInterface, setUserSubscribeStatus, setUserVoiceSubscription} from "../../redux/slice/UserSlice";
import AllowMessagesBanner from "../../components/AllowMessagesBanner";
import {GeneratedImageType} from "../../types/ApiTypes";
import PromiseWrapper from "../../api/PromiseWrapper";
import GeneratedImages from "../../components/GeneratedImages";
import VipBlock from "../../components/RenestraVip/VipBlock";
import RenestraTitleWithVip from "../../components/RenestraVip/RenestraTitleWithVip";
import vipLogo from "../../assets/images/vip_logo.png";

interface Props {
    id: string;
}

const PanelContent: React.FC = () => {
    const [generatedImages, setGeneratedImages] = useState<GeneratedImageType[]>([])
    const [snackbar, setSnackbar] = React.useState<ReactElement | null>(null);

    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const dispatch = useDispatch();

    const subscribeGroup = () => {
        bridge.send('VKWebAppJoinGroup', {
            group_id: Number(process.env.REACT_APP_APP_GROUP_ID)
        })
            .then((data) => {
                if (data.result) {
                    dispatch(setUserSubscribeStatus(data.result))
                } else {
                    openSnackBar(<Icon28CancelCircleFillRed />, 'Ошибка, повторите попытку');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

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

    const init = () => {
        return new Promise(async (resolve, reject) => {
            const images = await getGeneratedImages()
            resolve(images);
        })
    }

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

    useEffect(() => {
        setGeneratedImages(PromiseWrapper(init()))
    }, []);

    return (
        <React.Fragment>
            <Group>
                <CardGrid size="l">
                    <Card mode='shadow'>
                        <SimpleCell
                            disabled
                            hasActive={false}
                            hasHover={false}
                            before={<Image size={56} src={girl_image}/>}
                            subtitle="Генератор изображений"
                        >
                            Ренестра (Renestra)
                        </SimpleCell>
                        <Div>
                            <Caption>Приложение генерирует образы из ваших фотографий с помощью ИИ.</Caption>
                            <Spacing/>
                            <Caption>
                                Начиная пользоваться приложением, вы соглашаетесь с {" "}
                                <Link target='_blank' href={UrlConstants.URL_POLITIC}>политикой конфиденциальности</Link>
                                {" "} и {" "}
                                <Link target='_blank' href={UrlConstants.URL_RULE_APP}>правилами пользования приложением</Link>.
                            </Caption>
                        </Div>
                    </Card>
                    {
                        !userDbData?.subscribe &&
                            <Card>
                                <Div>
                                    <Title level="3">Получите одну дополнительную
                                        ежедневную генерацию, подписавшись
                                        на сообщество VK.</Title>
                                    <Spacing/>
                                    <Subhead style={{color: 'var(--vkui--color_text_secondary)'}}>Наше сообщество публикует
                                        обновления приложения
                                        и интересные кейсы по использованию приложения.</Subhead>
                                    <Spacing/>
                                    <Button onClick={subscribeGroup} before={<Icon20CheckNewsfeedOutline />} size='s'>Подписаться на сообщество VK</Button>
                                </Div>
                            </Card>
                    }
                    {
                        (userDbData?.is_vip) &&
                        <Card mode='shadow'>
                            <div className="vip-block">
                                <div style={{
                                    display: "flex",
                                    justifyContent: 'space-between',
                                    flexFlow: 'row wrap',
                                }}
                                >
                                    <div style={{
                                        flexGrow: 1,
                                        flexBasis: '100%',
                                    }}>
                                        <RenestraTitleWithVip/>
                                        <Spacing />
                                        <Title className="golden_text" level="1">У Вас активен VIP статус!</Title>
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        flexGrow: 1,
                                        flexBasis: '100%',
                                    }}>
                                        <div style={{
                                            flexGrow: 1,
                                            flexBasis: '50%',
                                            alignSelf: 'center'
                                        }}>
                                            <Title style={{color: 'white'}} level="3">Вы получили:</Title>
                                            <Spacing />
                                            <p>20 генераций в день</p>
                                            <p>Эксклюзивные образы</p>
                                            <p>и другие преимущества!</p>
                                        </div>
                                        <div style={{
                                            alignSelf: 'start',
                                            flexGrow: 1,
                                            flexBasis: '50%',
                                            textAlign: 'right'
                                        }}>
                                            <img style={{
                                                maxWidth: '100%',
                                                maxHeight: '120px',
                                            }} src={vipLogo} alt="vip logo"/>
                                        </div>
                                    </div>
                                </div>
                                <Spacing/>
                                <Button style={{color: 'black'}} className="gold_button" onClick={actionSubscription}
                                        stretched>
                                    {
                                        !!userDbData?.voice_subscribe?.pending_cancel ? 'Возобновить подписку' : 'Отменить подписку'
                                    }
                                </Button>
                            </div>
                        </Card>
                    }
                    <Card mode='shadow'>
                        <GeneratedImages images={generatedImages}/>
                    </Card>
                    {
                        !userDbData?.is_vip &&
                        <Card mode='shadow'>
                            <div style={{padding: 5}}>
                                <VipBlock/>
                            </div>
                        </Card>
                    }
                    <AllowMessagesBanner callbackSuccess={() => openSnackBar(<Icon28CheckCircleOutline fill={ColorsList.success} />, 'Уведомления подключены.')} />
                </CardGrid>
            </Group>
            <Footer>Привет от омских разработчиков!</Footer>
            {snackbar}
        </React.Fragment>
    )
};

const AboutPanel: React.FC<Props> = ({id}) => {
    return (
        <Panel id={id}>
            <PanelHeader>О приложении</PanelHeader>
            <Suspense fallback={<PanelSpinner size="medium" />}>
                <PanelContent />
            </Suspense>
        </Panel>
    )
};

export default AboutPanel;
