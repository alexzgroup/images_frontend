import React, {Suspense, useEffect, useState} from "react";
import {Div, Group, Header, Image, Panel, PanelHeader, PanelSpinner, Placeholder} from "@vkontakte/vkui";
import PromiseWrapper from "../../api/PromiseWrapper";
import {UserWithGeneratedInfoType} from "../../types/ApiTypes";
import bridge from "@vkontakte/vk-bridge";
import {getUserProfileGenerateInfo} from "../../api/AxiosApi";
import UserGenerateInfo from "../../components/Profile/UserGeneratedInfo";
import {RouterLink, useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import ButtonHeaderBack from "../../components/ButtonHeaderBack";
import {setGenerateImageId} from "../../redux/slice/ImageSlice";
import {ModalTypes} from "../../modals/ModalRoot";
import {useDispatch} from "react-redux";
import {Icon56ErrorTriangleOutline} from "@vkontakte/icons";
import {ColorsList} from "../../types/ColorTypes";

const PanelContent: React.FC = () => {
    const [user, setUser] = useState<UserWithGeneratedInfoType>();
    const params = useParams<'userId'>();
    const dispatch = useDispatch();
    const routeNavigator = useRouteNavigator();

    const init = () => {
        return new Promise(async (resolve) => {
            const vkUserInfo = await bridge.send('VKWebAppGetUserInfo', {
                user_id: Number(params?.userId),
            });

            const generateInfo = await getUserProfileGenerateInfo(Number(params?.userId));
            resolve({...vkUserInfo, ...generateInfo});
        })
    }

    const showGeneratedImage = (generateImageId: number) => {
        dispatch(setGenerateImageId(generateImageId))
        routeNavigator.showModal(ModalTypes.MODAL_SHOW_GENERATED_IMAGE)
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
                        <Div style={{display: 'flex', gap: 5, flexGrow: 1, flexWrap: 'wrap', justifyContent: 'flex-start'}}>
                            {
                                user.history_generate.map((item, key) => (
                                    <div key={key} onClick={() => showGeneratedImage(item.id)}>
                                        <Image
                                            size={96}
                                            src={item.url}
                                            borderRadius="m"
                                        />
                                    </div>
                                ))
                            }
                        </Div>
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
