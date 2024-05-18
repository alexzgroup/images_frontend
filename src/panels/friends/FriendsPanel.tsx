import React, {ReactElement, useEffect, useRef, useState} from 'react';

import {
    Avatar,
    Button,
    Group,
    Header,
    IconButton,
    Panel,
    PanelHeader,
    PanelSpinner,
    Placeholder,
    SimpleCell, Snackbar,
    Spinner
} from '@vkontakte/vkui';
import {useDispatch, useSelector} from "react-redux";
import bridge, {UserGetFriendsFriend} from "@vkontakte/vk-bridge";
import {
    Icon28CheckCircleOutline,
    Icon28UserAddBadgeOutline,
    Icon28UserCircleOutline,
    Icon56ErrorTriangleOutline,
    Icon56UsersOutline
} from "@vkontakte/icons";
import {ColorsList} from "../../types/ColorTypes";
import {ReduxSliceUserInterface, setAccessToken} from "../../redux/slice/UserSlice";
import InfiniteScroll from "react-infinite-scroll-loader-y";
import {RootStateType} from "../../redux/store/ConfigureStore";


interface Props {
    id: string;
}

type FriendType = UserGetFriendsFriend & {
    installApp: boolean,
    can_post: 0|1,
}

const FriendsPanel: React.FC<Props> = ({id}) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [offset, setOffset] = useState<number>(0);
    const [appFriends, setAppFriends] = React.useState<[]>([]);
    const [allFriends, setAllFriends] = React.useState<FriendType[] | []>([]);
    const [hasFriendsPermission, setHasFriendsPermission] = React.useState(false);
    const [snackbar, setSnackbar] = React.useState<ReactElement | null>(null);
    const {access_token} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const dispatch = useDispatch();
    const totalFriends = useRef(0);
    const urlApp = 'https://vk.com/app' + process.env.REACT_APP_APP_ID;

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

    const getFriends = async (access_token: string) => {
        const {response}: { response: {
                count: number,
                items: (UserGetFriendsFriend & {can_post: 0|1})[]|[],
            } } = await bridge.send('VKWebAppCallAPIMethod', {
            method: 'friends.get',
            params: {
                v: process.env.REACT_APP_V_API,
                access_token: access_token,
                fields: 'photo_200,can_post',
                count: 20,
                offset: offset,
            }
        });

        const users = response.items.map((item) => Object.assign(item, {
            installApp: appFriends.includes(item.id as never),
        }))

        totalFriends.current = response.count;
        setAllFriends([...allFriends, ...users]);
        setOffset((value) => value + 20);
    }

    const getToken = () => {
        bridge.send('VKWebAppGetAuthToken', {
            app_id: Number(process.env.REACT_APP_APP_ID),
            scope: 'friends'
        })
            .then( (data) => {
                if (data.access_token) {
                    dispatch(setAccessToken(data.access_token))
                    setHasFriendsPermission(true);
                    setIsLoading(true);

                    bridge.send('VKWebAppCallAPIMethod', {
                        method: 'friends.getAppUsers',
                        params: {
                            v: process.env.REACT_APP_V_API,
                            access_token: data.access_token,
                        }
                    }).then(({response}: {response: []}) => {
                        setAppFriends(response);
                        getFriends(data.access_token).finally(() => setIsLoading(false));
                    });
                }
            })
            .catch( (error) => {
                setIsLoading(false);
                console.log(error);
            });
    }

    const shareWallPost = (userId: number) => {

        bridge.send('VKWebAppShowWallPostBox', {
            owner_id: userId,
            message: 'В данном приложении можно сгенерировать себя в различных образах себе на аватарку, заходи скорее! ' + urlApp,
            attachments: urlApp,
        })
            .then((data) => {
                if (data.post_id) {
                    openSnackBar(<Icon28CheckCircleOutline fill={ColorsList.success} />, 'Запись опубликована');
                }
            })
            .catch((error) => {
                // Ошибка
                console.log(error);
            });
    }

    const shareMessage = () => {
        bridge.send('VKWebAppShare', {
            link: urlApp,
        })
            .then((data) => {
                // @ts-ignore
                if (!!data.result.length) {
                    openSnackBar(<Icon28CheckCircleOutline fill={ColorsList.success} />, 'Запись опубликована');
                }
            })
            .catch((error) => {
                // Ошибка
                console.log(error);
            });
    }

    useEffect(() => {
        bridge.send('VKWebAppCheckAllowedScopes', {
            scopes: 'friends',
        })
            .then((data) => {
                if (data.result) {
                    const findScope = data.result.find(item => item.scope === 'friends' && item.allowed);
                    setHasFriendsPermission(!!findScope);
                    getToken();
                }
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    }, []);

    return (<Panel id={id}>
            <PanelHeader>Друзья</PanelHeader>
            {
                isLoading ? <PanelSpinner size="medium" /> :
                    <React.Fragment>
                        {
                            hasFriendsPermission ?
                                <React.Fragment>
                                    {
                                        !allFriends.length &&
                                            <Placeholder
                                                stretched
                                                icon={<Icon56ErrorTriangleOutline fill={ColorsList.error} />}
                                                header="У Вас не найдено друзей!"
                                            />
                                    }
                                    {
                                        !!allFriends.length &&
                                        <Group
                                            header={<Header>Список друзей</Header>}
                                            separator="show">

                                            <InfiniteScroll dataLength={allFriends.length}
                                                            batchSize={20}
                                                            loadMore={() => getFriends(access_token)}
                                                            hasMore={totalFriends.current > allFriends.length}
                                                            loader={<Spinner size="regular" />}
                                            >
                                                {
                                                    allFriends.map((item, i) => (
                                                        <SimpleCell
                                                            disabled
                                                            key={i}
                                                            before={<Avatar size={48} src={item.photo_200} />}
                                                            after={
                                                                item.installApp ?
                                                                    <IconButton>
                                                                        <Icon28UserCircleOutline />
                                                                    </IconButton>
                                                                    :
                                                                    <IconButton onClick={() => item.can_post ? shareWallPost(item.id) : shareMessage()}>
                                                                        <Icon28UserAddBadgeOutline />
                                                                    </IconButton>
                                                            }
                                                            subtitle={item.installApp ? "Перейти в профиль" : "Пригласить"}
                                                        >
                                                            {item.first_name + " " + item.last_name}
                                                        </SimpleCell>
                                                    ))
                                                }
                                            </InfiniteScroll>
                                        </Group>
                                    }
                                </React.Fragment>
                                :
                                <Group>
                                    <Placeholder
                                        icon={<Icon56UsersOutline fill={ColorsList.primary} />}
                                        header="Здесь отображаются твои друзья и их генерации."
                                        action={<Button onClick={getToken} size="l">Посмотреть друзей</Button>}
                                    >
                                        Разрешите доступ к своим друзьям, чтобы посмотреть их профили и изображения!
                                    </Placeholder>
                                </Group>
                        }
                    </React.Fragment>
            }
            {snackbar}
        </Panel>
    )
}


export default FriendsPanel;
