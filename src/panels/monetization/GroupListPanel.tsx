import React, {ReactElement, Suspense, useContext, useEffect, useState} from 'react';

import {
    Avatar,
    Group,
    IconButton,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    PanelSpinner,
    SimpleCell,
    Snackbar
} from '@vkontakte/vkui';

import {
    Icon28AddSquareOutline,
    Icon28ArchiveOutline,
    Icon28CancelCircleFillRed,
    Icon28CheckCircleOutline
} from '@vkontakte/icons';
import {addChatBootToGroup, deleteChatBootToGroup, editChatBootToGroup, getChatBootGroups} from "../../api/AxiosApi";
import bridge, {GroupInfo} from "@vkontakte/vk-bridge";
import {useDispatch, useSelector} from "react-redux";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {ReduxSliceUserInterface} from "../../redux/slice/UserSlice";
import PromiseWrapper from "../../api/PromiseWrapper";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ColorsList, TypeColors} from "../../types/ColorTypes";
import {hideAppLoading, showAppLoading} from "../../redux/slice/AppStatusesSlice";
import {generatePassword} from "../../helpers/AppHelper";
import {useTelegram} from "../../context/TelegramProvider";

interface Props {
    id: string;
}

type GroupListType = GroupInfo & {
    is_install?: boolean,
    server_id?: number,
}

export const ListGroup = () => {
    const [groups, setGroups] = useState<GroupListType[]>([]);
    const [snackbar, setSnackbar] = React.useState<ReactElement | null>(null);
    const {access_token} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const dispatch = useDispatch();
    const { userTg} = useTelegram();
    
    const getGroups = () => {
        return new Promise(async (resolve, reject) => {
            const { response } = await bridge.send('VKWebAppCallAPIMethod', {
                method: 'groups.get',
                params: {
                    user_id: Number(userTg?.id),
                    filter: 'admin',
                    extended: 1,
                    v: process.env.REACT_APP_V_API,
                    access_token: access_token,
                }});
            if (!!response.items.length) {
                const groupFromDB = await getChatBootGroups();
                const groups = Array.from((response.items as GroupListType[]), (group) => {
                    const index = groupFromDB.findIndex((item) => item.vk_group_id === group.id)
                    group.is_install = false;
                    group.server_id = 0;

                    if (index > -1) {
                        group.server_id = groupFromDB[index].server_id
                        group.is_install = true
                    }

                    return group;
                })

                resolve(groups)
            } else {
                resolve([]);
            }
        })
    }

    const addGroupToChatBoot = async (vk_group_id: number) => {
        dispatch(showAppLoading())

        // получим токен для редактирвоания группы
        const {access_token} =  await bridge.send("VKWebAppGetCommunityToken", {
            "app_id": parseInt(process.env.REACT_APP_APP_ID),
            "group_id": vk_group_id,
            "scope": "messages, manage",
        });

        // получим код для подтверждения callback сервера на стороне сервера api
        const codeData = await bridge.send('VKWebAppCallAPIMethod', {
            "method": "groups.getCallbackConfirmationCode",
            "params":
                {
                    group_id: vk_group_id,
                    v: process.env.REACT_APP_V_API,
                    access_token
                }
        })

        // генерируем секретное слово
        const secret_key = generatePassword();

        // добавим предварительно группу в базу данных
        const dataGroup = {
            vk_group_id: vk_group_id,
            secret_key,
            code_answer: codeData.response.code,
            access_token,
        }

        // отправим данные на сервер
        const responseServer = await addChatBootToGroup(dataGroup);

        if (responseServer) {
            // Добавляем сервер к группе
            const {response: {server_id}} = await bridge.send('VKWebAppCallAPIMethod', {
                method: 'groups.addCallbackServer',
                params: {
                    group_id: vk_group_id,
                    url: process.env.REACT_APP_CALLBACK_URL_CHAT_BOOT,
                    title: 'img_boot_v_1',
                    secret_key,
                    v: process.env.REACT_APP_V_API,
                    access_token,
                }});

            await editChatBootToGroup({vk_group_id, server_id});

            // Меняем настройки сервера
            await bridge.send('VKWebAppCallAPIMethod', {
                method: "groups.setCallbackSettings",
                params:
                    {
                        group_id: vk_group_id,
                        api_version: process.env.REACT_APP_V_API,
                        v: process.env.REACT_APP_V_API,
                        server_id,
                        message_new: 1,
                        access_token
                    }
            });

            // Меняем настройки группы
            const {response} = await bridge.send('VKWebAppCallAPIMethod', {
                method: "groups.setSettings",
                params:
                    {
                        group_id: vk_group_id,
                        messages: 1,
                        bots_capabilities: 1,
                        bots_start_button: 1,
                        access_token,
                        v: process.env.REACT_APP_V_API,
                    }
            });

            if (response) {
                const index = groups.findIndex((item) => item.id === vk_group_id)
                const oldGroups = groups;
                oldGroups[index].is_install = true;
                oldGroups[index].server_id = server_id;
                setGroups(oldGroups);

                openSnackBar(<Icon28CheckCircleOutline fill={ColorsList.success} />, 'Чат бот установлен');
            } else {
                openSnackBar(<Icon28CancelCircleFillRed />, 'Произошел сбой');
            }

            dispatch(hideAppLoading())
        }
    }

    const deleteGroupToChatBoot = async (vk_group_id: number, server_id: number) => {

        // получим токен для редактирвоания группы
        const {access_token} =  await bridge.send("VKWebAppGetCommunityToken", {
            "app_id": parseInt(process.env.REACT_APP_APP_ID),
            "group_id": vk_group_id,
            "scope": "messages, manage",
        });

        dispatch(showAppLoading())

        const {response} = await bridge.send('VKWebAppCallAPIMethod', {
            method: "groups.deleteCallbackServer",
            params:
                {
                    group_id: vk_group_id,
                    server_id,
                    access_token,
                    v: process.env.REACT_APP_V_API,
                }
        });

        if (response) {
            await deleteChatBootToGroup(vk_group_id);

            const index = groups.findIndex((item) => item.id === vk_group_id)
            const oldGroups = groups;
            oldGroups[index].is_install = false;
            setGroups(oldGroups);

            openSnackBar(<Icon28CheckCircleOutline fill={ColorsList.success} />, 'Чат бот удален');
        } else {
            openSnackBar(<Icon28CancelCircleFillRed />, 'Произошел сбой');
        }

        dispatch(hideAppLoading())
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
        setGroups(PromiseWrapper(getGroups()))
    }, []);

    return (
        <React.Fragment>
            {
                !!groups.length &&
                    <Group>
                        {
                            groups.map((group, key) =>
                                <SimpleCell
                                    disabled
                                    key={key}
                                    before={<Avatar size={48} src={group.photo_100} />}
                                    after={
                                    group.is_install ?
                                        <IconButton onClick={() => deleteGroupToChatBoot(group.id, Number(group.server_id))}>
                                            <Icon28ArchiveOutline fill={ColorsList[TypeColors.error]} />
                                        </IconButton>
                                        :
                                        <IconButton onClick={() => addGroupToChatBoot(group.id).catch(() => dispatch(hideAppLoading()))}>
                                            <Icon28AddSquareOutline />
                                        </IconButton>
                                    }
                                    subtitle={group.screen_name}
                                >
                                    {group.name}
                                </SimpleCell>
                            )
                        }
                    </Group>
            }
            {snackbar}
        </React.Fragment>
    )
}

const GroupListPanel: React.FC<Props> = ({id}) => {
    const routeNavigator = useRouteNavigator();

    return (
        <Panel id={id}>
            <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>Сообщества</PanelHeader>
            <Suspense fallback={<PanelSpinner size="medium" />}>
                <ListGroup />
            </Suspense>
        </Panel>
    )
};

export default GroupListPanel;
