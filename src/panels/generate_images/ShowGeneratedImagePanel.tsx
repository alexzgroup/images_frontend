import React, {useContext} from 'react';

import {Button, ButtonGroup, Group, Image, Panel, PanelHeader} from '@vkontakte/vkui';
import bridge from "@vkontakte/vk-bridge";
import {useSelector} from "react-redux";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceImageInterface} from "../../redux/slice/ImageSlice";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";
import {getStoryBoxData, getWallData} from "../../helpers/AppHelper";

interface Props {
    id: string;
}

const ShowGeneratedImagePanel: React.FC<Props> = ({id}) => {
    const {vkUserInfo} = useContext<AdaptiveContextType>(AdaptiveContext);
    const {uploadPhoto} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)

    const shareWall = async () => {
        if (uploadPhoto && vkUserInfo) {
            const wallData = getWallData({uploadPhoto, vkUserInfo});
            const {post_id} = await bridge.send('VKWebAppShowWallPostBox', wallData);
            console.log(post_id);
        }
    }

    const shareStore = async () => {
        if (uploadPhoto) {
            const storyData = getStoryBoxData({uploadPhoto});
            const {result} = await bridge.send('VKWebAppShowStoryBox', storyData);
            console.log(result);
        }
    }

    return (
        <Panel id={id}>
            <PanelHeader>Результат генерации</PanelHeader>
            {
                uploadPhoto &&
                <Group>
                    <div style={{display: 'flex', flexFlow: 'column', alignItems: 'center', rowGap: 25}}>
                        <Image size={360} src={uploadPhoto.url} alt=''/>
                        <ButtonGroup mode='vertical'>
                            <Button onClick={shareWall} stretched size='l'>Поделиться с друзьями на стене</Button>
                            <Button onClick={shareStore} stretched size='l'>Поделиться с друзьями в истории</Button>
                        </ButtonGroup>
                    </div>
                </Group>
            }
        </Panel>
    )
}

export default ShowGeneratedImagePanel;
