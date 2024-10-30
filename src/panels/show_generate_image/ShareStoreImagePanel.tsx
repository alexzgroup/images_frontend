import React, {useContext} from 'react';

import {Banner, Button, Group, Panel, PanelHeader, PanelHeaderClose, Placeholder} from '@vkontakte/vkui';
import bridge from "@vkontakte/vk-bridge";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";
import {getStoryBoxData} from "../../helpers/AppHelper";
import {useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {updateShareGenerateImage} from "../../api/AxiosApi";
import {ShareTypeEnum} from "../../types/ApiTypes";
import {useSelector} from "react-redux";
import {Icon28CancelOutline, Icon28StoryOutline, Icon56StoryCircleFillYellow} from "@vkontakte/icons";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceImageInterface} from "../../redux/slice/ImageSlice";
import {ReduxSliceUserInterface} from "../../redux/slice/UserSlice";
import {ColorsList} from "../../types/ColorTypes";

interface Props {
    id: string;
}

const ShareStoreImagePanel: React.FC<Props> = ({id}) => {
    const {vkUserInfo} = useContext<AdaptiveContextType>(AdaptiveContext);
    const {uploadPhoto} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)

    const params = useParams<'imageGeneratedId'>();
    const routeNavigator = useRouteNavigator();
    const {lang} = useContext<AdaptiveContextType>(AdaptiveContext);

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
            <PanelHeader before={<PanelHeaderClose onClick={skipShareHistory}><Icon28CancelOutline /></PanelHeaderClose>}>{lang.HEADERS.SHOW_GET_VIP_IMAGE_PANEL}</PanelHeader>
            <Group>
                <Placeholder
                    stretched
                    icon={<div className="pulseLine"><Icon56StoryCircleFillYellow height={98} width={98} /></div>}
                    header={`${vkUserInfo?.first_name}, ${lang.DESCRIPTIONS.SHARE_STORY_NOT_FORGET}`}
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
                                header={lang.TITLES.SHOW_GENERATE_PANEL_SHARE_STORY}
                                subheader={lang.DESCRIPTIONS.SHOW_GENERATE_PANEL_GET_GENERATION}
                                actions={<Button before={<Icon28StoryOutline/>} onClick={() => shareStore(Number(params?.imageGeneratedId))} stretched  appearance="overlay" size="l">
                                    {lang.BUTTONS.SHOW_GENERATE_IMAGE_SHARE_STORY}
                                </Button>}
                            />
                        }
                    </>
                    }
                />
            </Group>
        </Panel>
    )
}

export default ShareStoreImagePanel;
