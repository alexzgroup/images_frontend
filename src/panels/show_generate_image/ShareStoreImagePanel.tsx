import React, {useContext} from 'react';

import {Button, ButtonGroup, Group, Panel, PanelHeader, Placeholder} from '@vkontakte/vkui';
import bridge from "@vkontakte/vk-bridge";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";
import {getStoryBoxData} from "../../helpers/AppHelper";
import {useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {updateShareGenerateImage} from "../../api/AxiosApi";
import {ShareTypeEnum} from "../../types/ApiTypes";
import {useSelector} from "react-redux";
import {Icon56StoryCircleFillYellow} from "@vkontakte/icons";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceImageInterface} from "../../redux/slice/ImageSlice";

interface Props {
    id: string;
}

const ShareStoreImagePanel: React.FC<Props> = ({id}) => {
    const {vkUserInfo, isMobileSize} = useContext<AdaptiveContextType>(AdaptiveContext);
    const {uploadPhoto} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
    const params = useParams<'imageGeneratedId'>();
    const routeNavigator = useRouteNavigator();

    const shareStore = async (imageGeneratedId: number) => {
        if (uploadPhoto) {
            const storyData = getStoryBoxData(uploadPhoto.base64);
            bridge.send('VKWebAppShowStoryBox', storyData).then((r) => {
                if (r.result) {
                    updateShareGenerateImage(imageGeneratedId, ShareTypeEnum.SHARE_HISTORY)
                    routeNavigator.push(`/show-generate-image/${params?.imageGeneratedId}`)
                }
            });
        }
    }

    return (
        <Panel id={id}>
            <PanelHeader>Результат</PanelHeader>
            <Group>
                <Placeholder
                    stretched
                    icon={<div className="pulseLine"><Icon56StoryCircleFillYellow height={98} width={98} /></div>}
                    header={`${vkUserInfo?.first_name}, так же не забудьте поделиться в истории ВКонтакте!`}
                    action={
                        <ButtonGroup mode='vertical'>
                            <Button onClick={() => shareStore(Number(params?.imageGeneratedId))} stretched size={isMobileSize ? 'm' : 'l'}>Поделиться в истории ВК</Button>
                            <Button mode="secondary" onClick={() => routeNavigator.push(`/show-generate-image/${params?.imageGeneratedId}`)} stretched
                                    size={isMobileSize ? 'm' : 'l'}>Пропустить</Button>
                        </ButtonGroup>
                    }
                />
            </Group>
        </Panel>
    )
}

export default ShareStoreImagePanel;
