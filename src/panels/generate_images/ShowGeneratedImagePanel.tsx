import React, {useContext} from 'react';

import {Button, ButtonGroup, Group, Panel, PanelHeader} from '@vkontakte/vkui';
import bridge from "@vkontakte/vk-bridge";
import {useSelector} from "react-redux";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceImageInterface} from "../../redux/slice/ImageSlice";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";

interface Props {
    id: string;
}

const ShowGeneratedImagePanel: React.FC<Props> = ({id}) => {
    const {generateImageUrl} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
    const {vkUserInfo} = useContext<AdaptiveContextType>(AdaptiveContext);

    const shareWall = async () => {
        bridge.send('VKWebAppShowWallPostBox', {
            message: 'Займы под 0%! Моментальный перевод на банковскую карту. Оформляй займ по ссылке:',
            attachments: 'https://vk.com/app7648288,photo-219904897_457239017',
            owner_id: vkUserInfo?.id,
        })
            .then((data) => {
                if (data.post_id) {

                }
            })
            .catch((error) => {

            });
    }

    const shareStore = () => {

    }

    return (
        <Panel id={id}>
            <PanelHeader>Результат генерации</PanelHeader>
            {
                generateImageUrl &&
                    <Group>
                        <div style={{display: 'flex', flexFlow: 'column', alignItems: 'center', rowGap: 25}}>
                            <img style={{maxWidth: '100%'}} src={generateImageUrl}  alt=''/>
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
