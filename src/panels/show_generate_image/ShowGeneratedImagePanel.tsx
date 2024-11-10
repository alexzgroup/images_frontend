import React, {useContext, useEffect} from 'react';

import {Banner, Button, ButtonGroup, Group, Panel, PanelHeader, PanelSpinner} from '@vkontakte/vkui';
import bridge from "@vkontakte/vk-bridge";
import {getStoryBoxData} from "../../helpers/AppHelper";
import {useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {updateShareGenerateImage} from "../../api/AxiosApi";
import {ShareTypeEnum} from "../../types/ApiTypes";
import {useSelector} from "react-redux";
import {ReduxSliceImageInterface} from "../../redux/slice/ImageSlice";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {Icon28StoryOutline} from "@vkontakte/icons";
import {ColorsList} from "../../types/ColorTypes";
import {AppContext, TAppContext} from "../../context/AppContext";

interface Props {
    id: string;
}

const ShowGeneratedImagePanel: React.FC<Props> = ({id}) => {
    const routeNavigator = useRouteNavigator();
    const params = useParams<'imageGeneratedId'>();
    const {uploadPhoto} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
    const {lang} = useContext<TAppContext>(AppContext);

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

    useEffect(() => {
        if (!uploadPhoto.url) {
            routeNavigator.push('/');
        }
    }, []);

    return (
        <Panel id={id}>
            <PanelHeader>{lang.HEADERS.SHOW_GENERATE_IMAGE_PANEL}</PanelHeader>
            {
                (uploadPhoto.url)
                    ?
                <Group>
                    <div style={{display: 'flex', flexFlow: 'column', alignItems: 'center', rowGap: 5}}>
                        <img
                            style={{maxWidth: '100%', margin: "auto", height: '50vh', borderRadius: 'var(--vkui--size_border_radius--regular)'}}
                            src={uploadPhoto.url}
                            alt=''/>
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
                                    actions={<Button appearance="overlay" before={<Icon28StoryOutline/>} onClick={() => shareStore(Number(params?.imageGeneratedId))} stretched size='l'>
                                        {lang.BUTTONS.SHOW_GENERATE_IMAGE_SHARE_STORY}
                                    </Button>}
                                />
                        }
                        <ButtonGroup mode='horizontal'>
                            {
                                !uploadPhoto?.available_share_free_image &&
                                    <Button before={<Icon28StoryOutline/>} onClick={() => shareStore(Number(params?.imageGeneratedId))} stretched size='l'>{lang.BUTTONS.SHOW_GENERATE_IMAGE_SHARE_STORY}</Button>
                            }
                        </ButtonGroup>
                    </div>
                </Group>
                    :
                <PanelSpinner size="medium" />
            }
        </Panel>
    )
}

export default ShowGeneratedImagePanel;
