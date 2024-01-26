import React from 'react';

import {Button, Group, List, Panel, PanelHeader, Placeholder, SimpleCell, Title} from '@vkontakte/vkui';
import {Icon24Add, Icon56MoneyCircleFillBlue, Icon56MoneyTransferOutline, Icon56SchoolOutline} from "@vkontakte/icons";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {useDispatch} from "react-redux";
import {hideAppLoading, showAppLoading} from "../../redux/slice/AppStatusesSlice";
import {apiMonetization} from "../../api/AxiosApi";
import {setUserDbDataMonetization} from "../../redux/slice/UserSlice";
import monetizationImage from "../../assets/images/monetization.png";

interface Props {
    id: string;
}

const WelcomePanel: React.FC<Props> = ({id}) => {
    const routeNavigator = useRouteNavigator();
    const dispatch = useDispatch()

    const addMonetization = async () => {
        dispatch(showAppLoading())

        const {result} = await apiMonetization();

        if (result) {
            routeNavigator.push('/monetization/profile');
            dispatch(setUserDbDataMonetization());
        }

        dispatch(hideAppLoading())
    }

    return (
        <Panel id={id}>
            <PanelHeader>Монетизация</PanelHeader>
            <Group>
                <img style={{width: '100%'}} src={monetizationImage}  alt='' />
            </Group>
            <Group>
                <Placeholder
                    header='Кабинет монетизации'
                    action={<Button
                        onClick={addMonetization}
                        before={<Icon24Add />} size="l">Подключиться к монетизации</Button>}
                >
                    Получайте дополнительный доход от подписчиков вашей группы, которые оформили VIP в приложении!
                </Placeholder>
                <List>
                    <SimpleCell
                        before={<Icon56SchoolOutline />}
                        hasHover={false}
                        hasActive={false}
                        disabled
                        subtitle='Отслеживайте свои доходы в удобном приложении с любого устройства'>
                        <Title level='3'>Удобный личный кабинет</Title>
                    </SimpleCell>
                    <SimpleCell
                        before={<Icon56MoneyCircleFillBlue />}
                        hasHover={false}
                        hasActive={false}
                        disabled
                        subtitle='С каждого оформления VIP вашими подписчиками, вы получаете 30% от потраченных средств'>
                        <Title level='3'>30% от стоимости VIP ваши</Title>
                    </SimpleCell>
                    <SimpleCell
                        before={<Icon56MoneyTransferOutline />}
                        hasHover={false}
                        hasActive={false}
                        disabled
                        subtitle='Автоматический безопасный вывод через VK на любую банковскую карту российского банка'>
                        <Title level='3'>Автовывод от 1000 рублей</Title>
                    </SimpleCell>
                </List>
            </Group>
        </Panel>
    )
};

export default WelcomePanel;
