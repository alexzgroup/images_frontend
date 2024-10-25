import React, {ReactElement, Suspense, useContext, useEffect, useState} from 'react';

import {
    Alert,
    Avatar,
    Button,
    ButtonGroup,
    Caption,
    Card,
    CardGrid,
    Div,
    Group,
    Header,
    Panel,
    PanelHeader,
    PanelSpinner,
    Placeholder,
    SimpleCell,
    Snackbar,
    Spacing,
    Tabs,
    TabsItem,
    Title
} from '@vkontakte/vkui';
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";
import {
    Icon24MessageAddBadgeOutline,
    Icon24PaymentCardClockOutline,
    Icon24UserAddOutline,
    Icon28CancelCircleFillRed,
    Icon56ErrorTriangleOutline
} from '@vkontakte/icons';
import {monetizationDataType} from "../../types/ApiTypes";
import {apiAddAppToGroup, apiGetMonetizationData} from "../../api/AxiosApi";
import {GroupItem} from "../../components/GroupItem";
import bridge from "@vkontakte/vk-bridge";
import {hideAppLoading, showAppLoading} from "../../redux/slice/AppStatusesSlice";
import {useDispatch} from "react-redux";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {setAccessToken} from "../../redux/slice/UserSlice";
import PromiseWrapper from "../../api/PromiseWrapper";

interface Props {
    id: string;
}

enum TabEnum {
    groups='groups'
}

export const TotalInfo = () => {
    const {vkUserInfo} = useContext<AdaptiveContextType>(AdaptiveContext);
    const [selectedTab, setSelectedTab] = useState<TabEnum>(TabEnum.groups);
    const [snackbar, setSnackbar] = React.useState<ReactElement | null>(null);
    const [monetizationData, setMonetizationData] = useState<monetizationDataType>({
        available_balance: 0,
        subscribes: 0,
        total_pays: 0,
        groups: [],
    });
    const dispatch = useDispatch()
    const routeNavigator = useRouteNavigator();

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

    const addAppToGroup = () => {
        bridge.send('VKWebAppAddToCommunity')
            .then((data) => {
                dispatch(showAppLoading())
                if (data.group_id) {
                    apiAddAppToGroup(data.group_id)
                        .then((r) => {
                            if (r.result) {
                                routeNavigator.showPopout(
                                    <Alert
                                        actions={[
                                            {
                                                title: 'Закрыть',
                                                autoClose: true,
                                                mode: 'destructive',
                                            },
                                        ]}
                                        onClose={() => routeNavigator.hidePopout()}
                                        header="Поздравляем!"
                                        text="Вы успешно подключили приложение к группе."
                                    />
                                );
                            }
                        })
                        .catch((error) => {
                            openSnackBar(<Icon28CancelCircleFillRed />, 'Произошла ошибка');
                            console.error(error.message);
                        })
                }
                dispatch(hideAppLoading())
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const getListGroups =  () => {
        bridge.send('VKWebAppGetAuthToken', {
            app_id: Number(process.env.REACT_APP_APP_ID),
            scope: 'groups'
        })
            .then((data) => {
                if (data.access_token) {
                    dispatch(setAccessToken(data.access_token))
                    routeNavigator.push('/monetization/group-list');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect( () => {
        setMonetizationData(PromiseWrapper(apiGetMonetizationData()));
    }, []);

    return (
        <React.Fragment>
            <Group>
                <CardGrid size='l'>
                    <Card mode='shadow'>
                        <SimpleCell
                            before={<Avatar size={48} initials={Array.from(vkUserInfo?.first_name || '')[0] + '' + Array.from(vkUserInfo?.last_name || '')[0]} gradientColor="blue" />}
                        >
                            {vkUserInfo?.first_name + ' ' + vkUserInfo?.last_name}
                        </SimpleCell>
                        <Header style={{height: 'auto'}} mode='secondary' aside={<Icon24PaymentCardClockOutline fill='var(--vkui--color_accent_blue)' />}>
                            Ваш общий текущий баланс:
                        </Header>
                        <Title style={{
                            paddingLeft: 'var(--vkui--size_base_padding_horizontal--regular)',
                            paddingRight: 'var(--vkui--size_base_padding_horizontal--regular)'
                        }} level='3'>{monetizationData.available_balance} руб.</Title>
                        <Spacing />
                        <Header style={{height: 'auto'}} mode='secondary' aside={monetizationData.subscribes}>
                            Подписчики с ваших групп в приложении:
                        </Header>
                        <Spacing />
                        <Header style={{height: 'auto'}} mode='secondary' aside={monetizationData.total_pays}>
                            Оформленно VIP всего:
                        </Header>
                        <Spacing />
                    </Card>
                    <Card mode='shadow'>
                        <Header mode='secondary'>Монетизация сообществ</Header>
                        <Div>
                            <ButtonGroup mode='vertical' stretched>
                                <Button onClick={addAppToGroup} before={<Icon24UserAddOutline />} stretched size='l'>Подключить сообщество</Button>
                                <Button onClick={getListGroups} before={<Icon24MessageAddBadgeOutline />} stretched size='l'>Подключить чат-бот в сообщество</Button>
                            </ButtonGroup>
                        </Div>
                    </Card>
                    <Card>
                        <Div>
                            <Caption style={{color: 'var(--vkui--color_text_secondary)'}}>
                                Ваш баланс складывается между всеми вашими подключёнными сообществами! Вывод баланса
                                происходит автоматически при достижении 1 000 рублей денежным переводом внутри
                                социальной сети. После получения денежных средств, вы сможете вывести их на любую
                                банковскую карту РФ.
                            </Caption>
                        </Div>
                    </Card>
                </CardGrid>
            </Group>
            <Group mode='plain' separator='hide'>
                <Tabs>
                    <TabsItem
                        selected={selectedTab === TabEnum.groups}
                        onClick={() => setSelectedTab(TabEnum.groups)}
                        id="tab-groups"
                        aria-controls="tab-content-groups"
                    >
                        Сообщества
                    </TabsItem>
                </Tabs>
            </Group>
            {
                selectedTab === TabEnum.groups &&
                <Group mode={!!monetizationData.groups.length ? 'card' : 'plain'}>
                    {
                        !!monetizationData.groups.length
                            ?
                                <CardGrid size='l'>
                                    {
                                        monetizationData.groups.map((item, key) => <GroupItem {...item} />)
                                    }
                                </CardGrid>
                            :
                            <Placeholder
                                icon={<Icon56ErrorTriangleOutline />}
                            >
                                Подключенные группы отсутствуют
                            </Placeholder>
                    }

                </Group>
            }
            {snackbar}
        </React.Fragment>
    )
}

const ProfilePanel: React.FC<Props> = ({id}) => {
    return (
        <Panel id={id}>
            <PanelHeader>Монетизация</PanelHeader>
            <Suspense fallback={<PanelSpinner size="medium" />}>
                <TotalInfo />
            </Suspense>
        </Panel>
    )
};

export default ProfilePanel;
