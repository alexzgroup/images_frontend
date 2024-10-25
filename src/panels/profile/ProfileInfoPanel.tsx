import React, {ReactElement, Suspense, useContext, useEffect, useState} from "react";
import {Group, Header, Panel, PanelHeader, PanelSpinner} from "@vkontakte/vkui";
import {RouterLink} from "@vkontakte/vk-mini-apps-router";
import {useDispatch, useSelector} from "react-redux";
import {UserWithGeneratedInfoType} from "../../types/ApiTypes";
import UserGenerateInfo from "../../components/Profile/UserGeneratedInfo";
import PromiseWrapper from "../../api/PromiseWrapper";
import {getUserProfileGenerateInfo} from "../../api/AxiosApi";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceUserInterface} from "../../redux/slice/UserSlice";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";
import VipBlock from "../../components/RenestraVip/VipBlock";
import GetVipBanner from "../../components/RenestraVip/GetVipBanner";
import HistoryGenerateImages from "../../components/GenerateImage/HistoryGenerateImages";
import type {ITelegramUser} from "../../types/Telegram";

const PanelContent:React.FC<{vkUserInfo: ITelegramUser}>  = ({vkUserInfo}) => {
    const [user, setUser] = useState<UserWithGeneratedInfoType>();
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const [snackbar, setSnackbar] = React.useState<ReactElement | null>(null);

    const init = () => {
        return new Promise(async (resolve) => {
            const generateInfo = await getUserProfileGenerateInfo(vkUserInfo.id);
            resolve({...vkUserInfo, ...generateInfo});
        })
    }

    // const openSnackBar = (icon: JSX.Element, text: string): void => {
    //     if (snackbar) return;
    //     setSnackbar(
    //         <Snackbar
    //             onClose={() => setSnackbar(null)}
    //             before={icon}
    //         >
    //             {text}
    //         </Snackbar>,
    //     );
    // };

    const actionSubscription = () => {
        // const resumeAction = userDbData?.voice_subscribe?.pending_cancel;
        // bridge.send('VKWebAppShowSubscriptionBox',
        //     {
        //         action: resumeAction ? 'resume' : 'cancel',
        //         subscription_id: String(userDbData?.voice_subscribe?.subscription_id),
        //     })
        //     .then( (data) => {
        //         if (resumeAction) {
        //             openSnackBar(<Icon28CheckCircleOutline fill={ColorsList.success} />, 'Вы восстановили подпсику!');
        //         } else {
        //             openSnackBar(<Icon28CancelCircleFillRed />, 'Вы отменили подпсику!');
        //         }
        //
        //         dispatch(setUserVoiceSubscription({
        //             subscription_id: Number(data.subscriptionId),
        //             pending_cancel: resumeAction ? null : 1,
        //         }));
        //
        //         console.log('Success resume or cancel subscription!', data);
        //     })
        //     .catch( (e) => {
        //         console.log('Error resume or cancel subscription!', e);
        //     })
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
                    </React.Fragment>
                }
            </Group>
            {
                (!!user?.total_generate) &&
                    <Group header={<Header
                        aside={<RouterLink to={"/profile/history-generated/" + userDbData?.id}>Показать все</RouterLink>}>История
                        генераций</Header>}>
                        <HistoryGenerateImages history_generate={user.history_generate} />
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
