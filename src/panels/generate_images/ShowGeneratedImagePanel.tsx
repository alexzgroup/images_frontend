import React, {useContext, useEffect, useState} from 'react';

import {Alert, Button, ButtonGroup, Group, Image, Panel, PanelHeader, PanelSpinner} from '@vkontakte/vkui';
import bridge from "@vkontakte/vk-bridge";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";
import {getStoryBoxData, getWallData} from "../../helpers/AppHelper";
import {useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {apiGetGenerateImage, uploadImage} from "../../api/AxiosApi";
import {uploadPhotoType} from "../../types/ApiTypes";

interface Props {
    id: string;
}

const ShowGeneratedImagePanel: React.FC<Props> = ({id}) => {
    const {vkUserInfo} = useContext<AdaptiveContextType>(AdaptiveContext);
    const routeNavigator = useRouteNavigator();
    const params = useParams<'imageGeneratedId'>();
    const [uploadPhoto, setUploadPhoto] = useState<uploadPhotoType>()
    const [photoUploadId, setPhotoUploadId] = useState<string>('');

    const rejectAccessToken = () => {
        routeNavigator.showPopout(
            <Alert
                actions={[
                    {
                        title: 'Понятно',
                        autoClose: true,
                        mode: 'destructive',
                    },
                ]}
                onClose={() => {
                    routeNavigator.hidePopout();
                    getUserToken();
                }}
                header="Внимание!"
                text="Для просмотра результата, разрешите доступ."
            />
        );
    }

    const getPhotoUploadId = async (access_token: string) => {

        const responseUploadServer = await bridge.send('VKWebAppCallAPIMethod', {
            method: 'photos.getWallUploadServer',
            params: {
                v: process.env.REACT_APP_V_API,
                access_token: access_token,
            }});

        const responseUploadImage = await uploadImage({
            upload_url: responseUploadServer.response.upload_url,
            generate_image_id: Number(params?.imageGeneratedId),
        });

        const responseSavePhoto = await bridge.send('VKWebAppCallAPIMethod', {
            method: 'photos.saveWallPhoto',
            params: {
                v: process.env.REACT_APP_V_API,
                access_token: access_token,
                ...responseUploadImage,
            }});

        const photo = responseSavePhoto.response[0] as {access_key: string, owner_id: number, id: number};
        setPhotoUploadId(photo.owner_id + '_' + photo.id + '_' + photo.access_key);
    }

    const getUserToken = () => {
        bridge.send('VKWebAppGetAuthToken', {
            app_id: Number(process.env.REACT_APP_APP_ID),
            scope: 'photos,wall'
        })
            .then(async (data) => {
                if (data.access_token) {
                    if (params?.imageGeneratedId) {
                        const response = await apiGetGenerateImage(Number(params?.imageGeneratedId));
                        setUploadPhoto(response);
                        await getPhotoUploadId(data.access_token);
                    }
                } else {
                    rejectAccessToken()
                }
            })
            .catch((error) => {
                console.log(error);
                rejectAccessToken()
            });
    }

    const shareWall = async () => {
        if (uploadPhoto && vkUserInfo) {
            const wallData = getWallData({photoUploadId, vkUserInfo});
            const {post_id} = await bridge.send('VKWebAppShowWallPostBox', wallData);
            console.log(post_id);
        }
    }

    const shareStore = async () => {
        if (uploadPhoto) {
            const storyData = getStoryBoxData(uploadPhoto.base64);
            const {result} = await bridge.send('VKWebAppShowStoryBox', storyData);
            console.log(result);
        }
    }

    useEffect(() => {
        getUserToken();
    }, []);

    return (
        <Panel id={id}>
            <PanelHeader>Результат генерации</PanelHeader>
            {
                (photoUploadId && uploadPhoto)
                    ?
                <Group>
                    <div style={{display: 'flex', flexFlow: 'column', alignItems: 'center', rowGap: 25}}>
                        <Image size={360} src={uploadPhoto.url} alt=''/>
                        <ButtonGroup mode='vertical'>
                            <Button onClick={shareWall} stretched size='l'>Поделиться с друзьями на стене</Button>
                            <Button onClick={shareStore} stretched size='l'>Поделиться с друзьями в истории</Button>
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
