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
    Group, GroupProps,
    Header,
    Panel,
    PanelHeader, PanelHeaderBack, PanelSpinner, Placeholder,
    SimpleCell, Snackbar,
    Spacing,
    Tabs,
    TabsItem,
    Title
} from '@vkontakte/vkui';
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";
import {
    Icon24MessageAddBadgeOutline,
    Icon24PaymentCardClockOutline,
    Icon24UserAddOutline, Icon28CancelCircleFillRed,
    Icon56ErrorTriangleOutline
} from '@vkontakte/icons';
import {monetizationDataType} from "../../types/ApiTypes";
import {
    apiAddAppToGroup,
    apiGetImageTypeWithStatistic,
    apiGetMonetizationData,
    getChatBootGroupIds
} from "../../api/AxiosApi";
import {GroupItem} from "../../components/GroupItem";
import bridge, {GroupInfo} from "@vkontakte/vk-bridge";
import {hideAppLoading, showAppLoading} from "../../redux/slice/AppStatusesSlice";
import {useDispatch, useSelector} from "react-redux";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {ReduxSliceUserInterface, setAccessToken} from "../../redux/slice/UserSlice";
import {ModalTypes} from "../../modals/ModalRoot";
import PromiseWrapper from "../../api/PromiseWrapper";
import {RootStateType} from "../../redux/store/ConfigureStore";

interface Props {
    id: string;
}

const GroupListPanel: React.FC<Props> = ({id}) => {
    const routeNavigator = useRouteNavigator();
    const [loading, setLoading] = useState<boolean>(true);
    const [groups, setGroups] = useState<[]>([]);
    const {vkUserInfo} = useContext<AdaptiveContextType>(AdaptiveContext);
    const {access_token} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)

    const getGroups = async () => {

            const { response } = await bridge.send('VKWebAppCallAPIMethod', {
                method: 'groups.get',
                params: {
                    user_id: Number(vkUserInfo?.id),
                    filter: 'admin',
                    extended: 1,
                    v: process.env.REACT_APP_V_API,
                    access_token: access_token,
                }});

            console.log(response);

            if (!!response.items.length) {
                const groupIds = await getChatBootGroupIds();

                return response.items;
            } else {
                return [];
            }
    }

    useEffect(() => {
        (async () => {
            const groups = await getGroups();
            setGroups(groups);
            setLoading(false);
        })()
    }, []);

    return (
        <Panel id={id}>
            <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>Сообщества</PanelHeader>
            {
                loading ? <PanelSpinner size="medium" /> : <React.Fragment>

                </React.Fragment>
            }
        </Panel>
    )
};

export default GroupListPanel;
