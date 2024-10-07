import React, {useContext} from 'react';

import {Banner, Button, ButtonGroup, Group, Panel, PanelHeader, Placeholder} from '@vkontakte/vkui';
import bridge from "@vkontakte/vk-bridge";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";
import {getStoryBoxData} from "../../helpers/AppHelper";
import {useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {updateShareGenerateImage} from "../../api/AxiosApi";
import {ShareTypeEnum} from "../../types/ApiTypes";
import {useSelector} from "react-redux";
import {Icon28StoryOutline, Icon56StoryCircleFillYellow} from "@vkontakte/icons";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceImageInterface} from "../../redux/slice/ImageSlice";
import {ReduxSliceUserInterface} from "../../redux/slice/UserSlice";
import {ColorsList} from "../../types/ColorTypes";

interface Props {
    id: string;
}

const ShareStoreImagePanel: React.FC<Props> = ({id}) => {
    const {vkUserInfo, isMobileSize} = useContext<AdaptiveContextType>(AdaptiveContext);
    const {uploadPhoto} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)

    const params = useParams<'imageGeneratedId'>();
    const routeNavigator = useRouteNavigator();

    const shareStore = async (imageGeneratedId: number) => {
        if (uploadPhoto) {
            const storyData = getStoryBoxData(uploadPhoto.base64);
            bridge.send('VKWebAppShowStoryBox', storyData).then((r) => {
                if (r.result) {
                    updateShareGenerateImage(imageGeneratedId, ShareTypeEnum.SHARE_HISTORY)
                    if (!userDbData?.is_vip) {
                        routeNavigator.push(`/show-generate-image/get-vip`, {state: {imageGeneratedId: params?.imageGeneratedId}})
                    } else {
                        routeNavigator.push(`/show-generate-image/${params?.imageGeneratedId}`)
                    }
                }
            });
        }
    }

    const skipShareHistory = () => {
        if (!userDbData?.is_vip) {
            routeNavigator.push(`/show-generate-image/get-vip`, {state: {imageGeneratedId: params?.imageGeneratedId}})
        } else {
            routeNavigator.push(`/show-generate-image/${params?.imageGeneratedId}`)
        }
    }

    return (
        <Panel id={id}>
            <PanelHeader>Результат</PanelHeader>
            <Group>
                <Placeholder
                    stretched
                    icon={<div className="pulseLine"><Icon56StoryCircleFillYellow height={98} width={98} /></div>}
                    header={`${vkUserInfo?.first_name}, также не забудьте поделиться в истории ВКонтакте!`}
                    action={
                    <>
                        {
                            uploadPhoto?.available_share_free_image &&
                            <Banner
                                style={{
                                    padding: 0,
                                }}
                                mode="image"
                                size="m"
                                background={
                                    <div
                                        style={{
                                            backgroundColor: ColorsList.primary,
                                        }}
                                    />
                                }
                                header="Посмотреть и поделиться в истории"
                                subheader="Вы получите ещё +1 генерацию бесплатно!"
                                actions={<Button before={<Icon28StoryOutline/>} onClick={() => shareStore(Number(params?.imageGeneratedId))} stretched  appearance="overlay" size="l">Поделиться в истории ВК</Button>}
                            />
                        }
                        <ButtonGroup mode='vertical'>
                            <Button mode="secondary" onClick={skipShareHistory} stretched
                                    size={isMobileSize ? 'm' : 'l'}>Пропустить</Button>
                        </ButtonGroup>
                    </>
                    }
                />
            </Group>
        </Panel>
    )
}

export default ShareStoreImagePanel;
