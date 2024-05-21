import React, {Suspense, useEffect} from "react";
import bridge, {UserInfo} from "@vkontakte/vk-bridge";
import {useSelector} from "react-redux";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceUserInterface} from "../../redux/slice/UserSlice";
import {Avatar, Group, Header, HorizontalCell, HorizontalScroll, PanelSpinner} from "@vkontakte/vkui";
import PromiseWrapper from "../../api/PromiseWrapper";
import {RouterLink, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {Icon28AddSquareOutline} from "@vkontakte/icons";

const FriendsListContent: React.FC = () => {
    const [users, setUsers] = React.useState<UserInfo[]>([]);
    const {access_token} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const routeNavigator = useRouteNavigator();

    const init = () => {
        return new Promise(async (resolve) => {
            const {response: appUserIds}: {response: []} = await bridge.send('VKWebAppCallAPIMethod', {
                method: 'friends.getAppUsers',
                params: {
                    v: process.env.REACT_APP_V_API,
                    access_token: access_token,
                }
            });

            if (appUserIds.length) {
                // @ts-ignore
                const loadUsers: UserInfo[] = await bridge.send('VKWebAppGetUserInfo', {
                    // @ts-ignore
                    user_ids: appUserIds.join(','),
                });

                resolve( Array.isArray(loadUsers) ? loadUsers : [loadUsers]);
            } else {
                resolve([]);
            }
        })
    }

    useEffect(() => {
        setUsers(PromiseWrapper(init()))
    }, []);

    return (
        <React.Fragment>
            <Group header={<Header aside={<RouterLink to={"/friends"}>Показать все</RouterLink>}>Друзья в приложении</Header>}>
                {
                            <HorizontalScroll>
                                <div style={{ display: 'flex' }}>
                                    {
                                        !!users.length && users.map((user) => (
                                            <HorizontalCell onClick={() => routeNavigator.push('/friend/' + user.id)} key={user.id} size="s" header={user.first_name}>
                                                <Avatar size={56} src={user.photo_100} />
                                            </HorizontalCell>
                                        ))
                                    }
                                    <HorizontalCell onClick={() => routeNavigator.push('/friends')} size="s" header="Добавить">
                                        <Avatar size={56} fallbackIcon={<Icon28AddSquareOutline />} src="#" />
                                    </HorizontalCell>
                                </div>
                            </HorizontalScroll>
                }
            </Group>
        </React.Fragment>
    )
}

const FriendsList: React.FC = () => {
    return (
        <Suspense fallback={<PanelSpinner size="regular" />}>
            <FriendsListContent />
        </Suspense>
    )
}

export default FriendsList;
