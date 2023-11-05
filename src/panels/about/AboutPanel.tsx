import React, {ReactElement, useContext, useEffect, useState} from 'react';

import {
    Button,
    Caption,
    Card,
    CardGrid,
    Div,
    Group,
    Image,
    Link,
    List,
    MiniInfoCell,
    Panel,
    PanelHeader,
    Placeholder,
    SimpleCell,
    Snackbar,
    Spacing,
    Subhead,
    Title, usePlatform
} from '@vkontakte/vkui';
import {UrlConstants} from "../../constants/UrlConstants";
import {
    Icon20CheckAlt,
    Icon20CheckNewsfeedOutline,
    Icon24LinkCircle,
    Icon24RoubleBadgeOutline,
    Icon28CancelCircleFillRed,
    Icon28CheckCircleOutline,
    Icon48DonateOutline
} from "@vkontakte/icons";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";
import znapps_image from '../../assets/images/zn_apps_icon.png';
import girl_image from '../../assets/images/icons/girl_icon.png';
import bridge from "@vkontakte/vk-bridge";
import {apiSubscribe} from "../../api/AxiosApi";
import {ColorsList} from "../../types/ColorTypes";
import {getDonutUrl} from "../../helpers/AppHelper";

interface Props {
    id: string;
}

const AboutPanel: React.FC<Props> = ({id}) => {
    const [isGroupmember, setIsGroupMember] = useState<number>(1);
    const [snackbar, setSnackbar] = React.useState<ReactElement | null>(null);

    const {isMobileSize} = useContext<AdaptiveContextType>(AdaptiveContext);
    const platform = usePlatform();

    const subscribeGroup = async () => {
        bridge.send('VKWebAppJoinGroup', {
            group_id: Number(process.env.REACT_APP_APP_GROUP_ID)
        })
            .then((data) => {
                if (data.result) {
                    apiSubscribe().then((r) => {
                        if (r.result) {
                            setIsGroupMember(1);
                            openSnackBar(<Icon28CheckCircleOutline fill={ColorsList.success} />, r.message);
                        } else {
                            openSnackBar(<Icon28CancelCircleFillRed />, r.message);
                        }
                    })
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

    useEffect(() => {
        (async () => {
            const {is_member} = await bridge.send('VKWebAppGetGroupInfo', {
                group_id: Number(process.env.REACT_APP_APP_GROUP_ID)
            });
            setIsGroupMember(is_member);
        })()
    }, []);

    return (
        <Panel id={id}>
            <PanelHeader>О приложении</PanelHeader>
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
                            <Caption>Приложение генерирует образы из ваших фотографий с помощью популярных AI,
                                которые доступны по модели Open Source или по платной модели с помощью API.</Caption>
                            <Spacing/>
                            <Caption>
                                Начиная пользоваться приложением, вы соглашаетесь с
                                <Link href={UrlConstants.URL_POLITIC}>политикой конфиденциальности</Link>
                                и
                                <Link href={UrlConstants.URL_RULE_APP}>правилами пользования приложением</Link>.
                            </Caption>
                        </Div>
                    </Card>
                    {
                        !isGroupmember &&
                            <Card>
                                <Div>
                                    <Title level="3">Получите одну дополнительную
                                        ежедневную генерацию подписавшись
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
                    <Card mode='shadow'>
                        <Placeholder
                            icon={<Icon48DonateOutline fill='var(--vkui--color_accent_blue)'/>}
                            header="Больше генерации изображений в день с подпиской VK Donut!"
                            action={<Button before={<Icon24RoubleBadgeOutline />} size="l" stretched={isMobileSize}>
                                <Link target="_blank" href={getDonutUrl(platform)}>Оформить подписку VK Donut</Link>
                        </Button>}
                        >
                            <List>
                                <MiniInfoCell
                                    style={{paddingLeft: 0}}
                                    before={<Icon20CheckAlt fill='var(--vkui--color_background_positive)'/>}
                                >
                                    Эксклюзивные образы
                                </MiniInfoCell>
                                <MiniInfoCell
                                    style={{paddingLeft: 0}}
                                    before={<Icon20CheckAlt fill='var(--vkui--color_background_positive)'/>}
                                >
                                    20 генераций изображений в день!
                                </MiniInfoCell>
                                <MiniInfoCell
                                    style={{paddingLeft: 0}}
                                    before={<Icon20CheckAlt fill='var(--vkui--color_background_positive)'/>}
                                >
                                    Приоритетная очередь генерации образов
                                </MiniInfoCell>
                            </List>
                        </Placeholder>
                    </Card>
                    <Card mode='shadow'>
                        <Placeholder
                            icon={<Image size={72} src={znapps_image} />}
                            header="Приложение “Знакомства по городам”"
                            action={<Button before={<Icon24LinkCircle />} size="l" stretched={isMobileSize}><Link target="_blank" href={process.env.REACT_APP_ZNAPPS_URL}>Открыть приложение</Link></Button>}
                        >
                            <List>
                                <MiniInfoCell
                                    style={{paddingLeft: 0}}
                                    before={<Icon20CheckAlt fill='var(--vkui--color_background_positive)'/>}
                                >
                                    Ссылки на страницы VK
                                </MiniInfoCell>
                                <MiniInfoCell
                                    style={{paddingLeft: 0}}
                                    before={<Icon20CheckAlt fill='var(--vkui--color_background_positive)'/>}
                                >
                                    Карта города
                                </MiniInfoCell>
                                <MiniInfoCell
                                    style={{paddingLeft: 0}}
                                    before={<Icon20CheckAlt fill='var(--vkui--color_background_positive)'/>}
                                >
                                    Огромная база пользователей
                                </MiniInfoCell>
                            </List>
                        </Placeholder>
                    </Card>
                </CardGrid>
            </Group>
            {snackbar}
        </Panel>
    )
};

export default AboutPanel;
