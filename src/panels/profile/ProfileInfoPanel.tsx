import React, {ReactElement, Suspense, useContext, useEffect, useState} from "react";
import {
    Banner,
    Button,
    Div,
    Group,
    Header,
    Panel,
    PanelHeader,
    PanelSpinner,
    Snackbar,
    Spacing,
    Subhead,
    Title
} from "@vkontakte/vkui";
import {RouterLink} from "@vkontakte/vk-mini-apps-router";
import bridge, {UserInfo} from "@vkontakte/vk-bridge";
import {
    Icon20CheckNewsfeedOutline,
    Icon28CancelCircleFillRed,
    Icon28CheckCircleOutline,
    Icon28LogoVkOutline
} from "@vkontakte/icons";
import {useDispatch, useSelector} from "react-redux";
import {UserWithGeneratedInfoType} from "../../types/ApiTypes";
import UserGenerateInfo from "../../components/Profile/UserGeneratedInfo";
import PromiseWrapper from "../../api/PromiseWrapper";
import {addMvpButton, getUserProfileGenerateInfo} from "../../api/AxiosApi";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {
    ReduxSliceUserInterface,
    setAccessToken,
    setUserSubscribeStatus,
    setUserVoiceSubscription,
    setVkHasProfileButton
} from "../../redux/slice/UserSlice";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";
import {ColorsList} from "../../types/ColorTypes";
import FriendsList from "../../components/Users/FriendsList";
import AllowMessagesBanner from "../../components/AllowMessagesBanner";
import VipBlock from "../../components/RenestraVip/VipBlock";
import GetVipBanner from "../../components/RenestraVip/GetVipBanner";
import HistoryGenerateImages from "../../components/GenerateImage/HistoryGenerateImages";

const PanelContent:React.FC<{vkUserInfo: UserInfo}>  = ({vkUserInfo}) => {
    const [user, setUser] = useState<UserWithGeneratedInfoType>();
    const [hasFriendsPermission, setHasFriendsPermission] = React.useState(false);
    const {vk_has_profile_button, userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const dispatch = useDispatch();

    const [snackbar, setSnackbar] = React.useState<ReactElement | null>(null);

    const init = () => {
        return new Promise(async (resolve) => {
            const {result: scopes} = await bridge.send('VKWebAppCheckAllowedScopes', {
                scopes: 'friends',
            });

            const findScope = scopes.find(item => item.scope === 'friends' && item.allowed);

            if (!!findScope) {
                await getToken();
            }

            const generateInfo = await getUserProfileGenerateInfo(vkUserInfo.id);

            resolve({...vkUserInfo, ...generateInfo});
        })
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

    const addProfileButton = () => {
        bridge.send('VKWebAppAddToProfile')
            .then((data) => {
                if (data.visibility) {
                    dispatch(setVkHasProfileButton(1))
                    openSnackBar(<Icon28CheckCircleOutline fill={ColorsList.success} />, 'Кнопка добавлена в профиль!');
                    addMvpButton();
                }
            })
            .catch((error) => {
                // Ошибка или пользователь решил не добавлять кнопку
                console.log(error);
            });
    }

    const getToken = async () => {
        await bridge.send('VKWebAppGetAuthToken', {
            app_id: Number(process.env.REACT_APP_APP_ID),
            scope: 'friends'
        })
            .then( (data) => {
                if (data.access_token) {
                    dispatch(setAccessToken(data.access_token))
                    setHasFriendsPermission(true)
                }
            })
            .catch( (error) => {
                console.log(error);
            });
    }

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
        setUser(PromiseWrapper(init()))
    }, []);

    return (
        <React.Fragment>
            <Group>
                {
                    user &&
                    <React.Fragment>
                        <UserGenerateInfo user={user} />
                        {
                            !vk_has_profile_button &&
                            <Div>
                                <Button
                                    onClick={addProfileButton}
                                    before={<Icon28LogoVkOutline />}
                                    stretched
                                    size="m">
                                    Добавить кнопку в профиль VK
                                </Button>
                            </Div>
                        }
                    </React.Fragment>
                }
            </Group>
            {
                hasFriendsPermission
                    ?
                    <FriendsList />
                    :
                    <Banner
                        size="m"
                        header="Кто из друзей уже в приложении?"
                        subheader="Узнай, кто из друзей уже воспользовался приложением. Посмотри результаты генерации своих друзей!"
                        actions={<Button onClick={getToken} mode="primary" size="m">Посмотреть друзей</Button>}
                    />
            }
            {
                (!!user?.total_generate) &&
                    <Group header={<Header
                        aside={<RouterLink to={"/profile/history-generated/" + user.id}>Показать все</RouterLink>}>История
                        генераций</Header>}>
                        <HistoryGenerateImages history_generate={user.history_generate} />
                    </Group>
            }
            <Group>
                <AllowMessagesBanner callbackSuccess={() => openSnackBar(<Icon28CheckCircleOutline fill={ColorsList.success} />, 'Уведомления подключены.')} />
            </Group>
            {
                !userDbData?.subscribe &&
                    <Group>
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
                    </Group>
            }
            {
                (userDbData?.is_vip)
                    ?
                        <Group>
                            <GetVipBanner actionSubscription={actionSubscription} />
                        </Group>
                    :
                        <Group>
                            <div style={{padding: 5}}>
                                <VipBlock />
                            </div>
                        </Group>
            }
            {snackbar}
        </React.Fragment>
    )
}

const ProfileInfoPanel: React.FC<{id: string}> = ({id}) => {
    const {vkUserInfo} = useContext<AdaptiveContextType>(AdaptiveContext);
    return (
        <Panel id={id}>
            <PanelHeader>Профиль</PanelHeader>
            <Suspense fallback={<PanelSpinner size="medium" />}>
                {vkUserInfo && <PanelContent vkUserInfo={vkUserInfo} />}
            </Suspense>
        </Panel>
    )
}

export default ProfileInfoPanel;
