import React, {ReactElement, Suspense, useContext, useEffect, useRef} from 'react';

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
    SimpleCell,
    Snackbar,
    Spinner
} from '@vkontakte/vkui';
import {useDispatch} from "react-redux";
import bridge, {UserGetFriendsFriend} from "@vkontakte/vk-bridge";
import {
    Icon28CheckCircleOutline,
    Icon28UserAddBadgeOutline,
    Icon28UserCircleOutline,
    Icon56ErrorTriangleOutline,
    Icon56UsersOutline
} from "@vkontakte/icons";
import {ColorsList} from "../../types/ColorTypes";
import {setAccessToken} from "../../redux/slice/UserSlice";
import InfiniteScroll from "react-infinite-scroll-loader-y";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import PromiseWrapper from "../../api/PromiseWrapper";
import {AppContext, TAppContext} from "../../context/AppContext";


interface Props {
    id: string;
}

type FriendType = UserGetFriendsFriend & {
    can_post: 0 | 1,
}

const PanelContent: React.FC = () => {
    const [anyFriends, setAnyFriends] = React.useState<FriendType[]>([]);
    const [appFriends, setAppFriends] = React.useState<FriendType[]>([]);
    const [hasMore, setHasMore] = React.useState<boolean>(true);

    const [hasFriendsPermission, setHasFriendsPermission] = React.useState(false);
    const [snackbar, setSnackbar] = React.useState<ReactElement | null>(null);
    const dispatch = useDispatch();
    const routeNavigator = useRouteNavigator();

    const appFriendsIds = useRef([]);
    const allAnyFriends = useRef<FriendType[]>([]);
    const {lang} = useContext<TAppContext>(AppContext);

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

    const getFriends = (page: number, { offset, limit }: {offset: number, limit: number}) => {
        const users = allAnyFriends.current.slice(offset, limit * (page + 1));
        setAnyFriends([...anyFriends, ...users]);
        setHasMore(allAnyFriends.current.length > limit * (page + 1));
    }

    const getToken = (resolve: any = () => null) => {
        bridge.send('VKWebAppGetAuthToken', {
            app_id: Number(process.env.REACT_APP_APP_ID),
            scope: 'friends'
        })
            .then((data) => {
                if (data.access_token) {
                    dispatch(setAccessToken(data.access_token))

                    bridge.send('VKWebAppCallAPIMethod', {
                        method: 'friends.getAppUsers',
                        params: {
                            v: process.env.REACT_APP_V_API,
                            access_token: data.access_token,
                        }
                    }).then(async ({response}: { response: [] }) => {
                        appFriendsIds.current = response;

                        const {response: dataAllFriends}: {
                            response: {
                                count: number,
                                items: FriendType[],
                            }
                        } = await bridge.send('VKWebAppCallAPIMethod', {
                            method: 'friends.get',
                            params: {
                                v: process.env.REACT_APP_V_API,
                                access_token: data.access_token,
                                fields: 'photo_200,can_post',
                                order: 'hints',
                            }
                        });

                        if (dataAllFriends.count) {
                            const appFriends = dataAllFriends.items.filter((item) => response.includes(item.id as never))
                            const anyFriends = dataAllFriends.items.filter((item) => !response.includes(item.id as never))
                            allAnyFriends.current = anyFriends;

                            setAppFriends(appFriends);
                            setAnyFriends(anyFriends.slice(0, 20));

                            if (anyFriends.length <= 20) {
                                setHasMore(false);
                            }
                        } else {
                            setHasMore(false);
                        }

                        setHasFriendsPermission(true);
                        resolve(true)
                    });
                }
            })
            .catch((error) => {
                resolve(false)
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
                    openSnackBar(<Icon28CheckCircleOutline fill={ColorsList.success}/>, 'Запись опубликована');
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
                    openSnackBar(<Icon28CheckCircleOutline fill={ColorsList.success}/>, 'Запись опубликована');
                }
            })
            .catch((error) => {
                // Ошибка
                console.log(error);
            });
    }

    const init = () => {
        return new Promise(async (resolve) => {
            resolve(true);
        })
    }

    useEffect(() => {
        setHasFriendsPermission(PromiseWrapper(init()))
    }, []);

    return (
        <React.Fragment>
            {
                hasFriendsPermission ?
                    <React.Fragment>
                        {
                            (!appFriends.length && !anyFriends.length) &&
                            <Placeholder
                                stretched
                                icon={<Icon56ErrorTriangleOutline fill={ColorsList.error}/>}
                                header="У Вас не найдено друзей!"
                            />
                        }
                        {
                            (!!appFriends.length) &&
                            <Group
                                header={<Header>Список друзей</Header>}
                                separator="show">
                                {
                                    appFriends.map((item, i) => (
                                        <SimpleCell
                                            key={i}
                                            onClick={() => routeNavigator.push('/friend/' + item.id)}
                                            before={<Avatar size={48} src={item.photo_200}/>}
                                            after={
                                                <IconButton>
                                                    <Icon28UserCircleOutline/>
                                                </IconButton>
                                            }
                                            subtitle="Перейти в профиль"
                                        >
                                            {item.first_name + " " + item.last_name}
                                        </SimpleCell>
                                    ))
                                }
                            </Group>
                        }
                        {
                            (!!anyFriends.length) &&
                            <Group
                                header={<Header>Пригласить друзей</Header>}
                                separator="show">
                                <InfiniteScroll dataLength={anyFriends.length}
                                                batchSize={20}
                                                loadMore={getFriends}
                                                hasMore={hasMore}
                                                loader={<Spinner size="regular"/>}
                                >
                                    {
                                        anyFriends.map((item, i) => (
                                            <SimpleCell
                                                key={i}
                                                onClick={() => item.can_post ? shareWallPost(item.id) : shareMessage()}
                                                before={<Avatar size={48} src={item.photo_200}/>}
                                                after={
                                                    <IconButton>
                                                        <Icon28UserAddBadgeOutline/>
                                                    </IconButton>
                                                }
                                                subtitle="Пригласить"
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
                            icon={<Icon56UsersOutline fill={ColorsList.primary}/>}
                            header="Здесь отображаются твои друзья и их генерации."
                            action={<Button onClick={getToken} size="l">Посмотреть друзей</Button>}
                        >
                            Разрешите доступ к своим друзьям, чтобы посмотреть их профили и изображения!
                        </Placeholder>
                    </Group>
            }
            {snackbar}
        </React.Fragment>
    )
}

const FriendsPanel: React.FC<Props> = ({id}) => {
    const {lang} = useContext<TAppContext>(AppContext);
    return (<Panel id={id}>
            <PanelHeader>{lang.HEADERS.FRIENDS_PANEL}</PanelHeader>
            <Suspense fallback={<PanelSpinner size="regular"/>}>
                <PanelContent/>
            </Suspense>
        </Panel>
    )
}


export default FriendsPanel;
