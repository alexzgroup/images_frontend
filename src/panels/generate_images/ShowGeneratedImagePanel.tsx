import React, {useContext, useEffect, useState} from 'react';

import {Alert, Button, ButtonGroup, Group, Panel, PanelHeader, PanelSpinner} from '@vkontakte/vkui';
import bridge from "@vkontakte/vk-bridge";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";
import {getStoryBoxData, getWallData} from "../../helpers/AppHelper";
import {useParams, useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {apiGetGenerateImage, updateShareGenerateImage, uploadImage} from "../../api/AxiosApi";
import {ShareTypeEnum, uploadPhotoType} from "../../types/ApiTypes";
import {setAccessToken} from "../../redux/slice/UserSlice";
import {useDispatch} from "react-redux";
import {ModalTypes} from "../../modals/ModalRoot";
import {setWindowBlocked} from "../../redux/slice/AppStatusesSlice";

interface Props {
    id: string;
}

const ShowGeneratedImagePanel: React.FC<Props> = ({id}) => {
    const {vkUserInfo} = useContext<AdaptiveContextType>(AdaptiveContext);
    const routeNavigator = useRouteNavigator();
    const params = useParams<'imageGeneratedId'>();
    const [uploadPhoto, setUploadPhoto] = useState<uploadPhotoType>()
    const [photoUploadId, setPhotoUploadId] = useState<string>('');
    const dispatch = useDispatch();

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
        const photoUploadId = photo.owner_id + '_' + photo.id + '_' + photo.access_key;
        setPhotoUploadId(photoUploadId);
        return photoUploadId;
    }

    const shareWall = async () => {
        bridge.send('VKWebAppGetAuthToken', {
            app_id: Number(process.env.REACT_APP_APP_ID),
            scope: 'photos,wall'
        })
            .then(async (data) => {
                if (data.access_token) {
                    dispatch(setAccessToken(data.access_token))

                    let photoId = photoUploadId;

                    if (!photoUploadId) {
                        dispatch(setWindowBlocked(true))
                        routeNavigator.showModal(ModalTypes.MODAL_UPLOAD_PHOTO_PRELOADER);
                        photoId = await getPhotoUploadId(data.access_token);
                        dispatch(setWindowBlocked(false))
                        routeNavigator.hideModal();
                    }

                    if (uploadPhoto && vkUserInfo) {
                        const wallData = getWallData({photoUploadId: photoId, vkUserInfo});
                        bridge.send('VKWebAppShowWallPostBox', wallData).then((r) => {
                            if (r.post_id) {
                                updateShareGenerateImage(Number(params?.imageGeneratedId), ShareTypeEnum.SHARE_WALL)
                            }
                        }).catch();
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

    const shareStore = async () => {
        if (uploadPhoto) {
            const storyData = getStoryBoxData(uploadPhoto.base64);
            bridge.send('VKWebAppShowStoryBox', storyData).then((r) => {
                if (r.result) {
                    updateShareGenerateImage(Number(params?.imageGeneratedId), ShareTypeEnum.SHARE_HISTORY)
                }
            });
        }
    }

    useEffect(() => {
        (async () => {
            if (params?.imageGeneratedId) {
                const response = await apiGetGenerateImage(Number(params?.imageGeneratedId));
                setUploadPhoto(response);
            }
        })()
    }, []);

    return (
        <Panel id={id}>
            <PanelHeader>Результат генерации</PanelHeader>
            {
                (uploadPhoto)
                    ?
                <Group>
                    <div style={{display: 'flex', flexFlow: 'column', alignItems: 'center', rowGap: 25}}>
                        <img
                            style={{maxWidth: '100%', margin: "auto", height: '50vh', borderRadius: 'var(--vkui--size_border_radius--regular)'}}
                            src={uploadPhoto.url}
                            alt=''/>
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
