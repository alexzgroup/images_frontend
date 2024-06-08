import React, {Suspense, useEffect, useState} from "react";
import {Group, Header, Panel, PanelHeader, PanelSpinner, Placeholder} from "@vkontakte/vkui";
import PromiseWrapper from "../../api/PromiseWrapper";
import {UserWithGeneratedInfoType} from "../../types/ApiTypes";
import bridge from "@vkontakte/vk-bridge";
import {getUserProfileGenerateInfo} from "../../api/AxiosApi";
import UserGenerateInfo from "../../components/Profile/UserGeneratedInfo";
import {RouterLink, useParams} from "@vkontakte/vk-mini-apps-router";
import ButtonHeaderBack from "../../components/ButtonHeaderBack";
import {Icon56ErrorTriangleOutline} from "@vkontakte/icons";
import {ColorsList} from "../../types/ColorTypes";
import HistoryGenerateImages from "../../components/GenerateImage/HistoryGenerateImages";

const PanelContent: React.FC = () => {
    const [user, setUser] = useState<UserWithGeneratedInfoType>();
    const params = useParams<'userId'>();

    const init = () => {
        return new Promise(async (resolve) => {
            const vkUserInfo = await bridge.send('VKWebAppGetUserInfo', {
                user_id: Number(params?.userId),
            });

            const generateInfo = await getUserProfileGenerateInfo(Number(params?.userId));
            resolve({...vkUserInfo, ...generateInfo});
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
                        </React.Fragment>
                }
            </Group>
            {
                (!!user?.total_generate)
                    ?
                    <Group header={<Header
                        aside={<RouterLink to={"/profile/history-generated/" + user.id}>Показать все</RouterLink>}>История генераций</Header>}>
                        <HistoryGenerateImages history_generate={user.history_generate} />
                    </Group>
                    :
                    <Placeholder
                        icon={<Icon56ErrorTriangleOutline fill={ColorsList.error} />}
                        header="У пользователя пока нет генераций!"
                    />
            }
        </React.Fragment>
    )
}

const FriendPanel: React.FC<{id: string}> = ({id}) => {
    return (
        <Panel id={id}>
            <PanelHeader before={<ButtonHeaderBack />}>Профиль</PanelHeader>
            <Suspense fallback={<PanelSpinner size="medium" />}>
                <PanelContent />
            </Suspense>
        </Panel>
    )
}

export default FriendPanel;
