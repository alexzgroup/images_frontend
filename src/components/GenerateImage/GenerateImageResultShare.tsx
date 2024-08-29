import React, {Suspense, useContext, useEffect, useState} from "react";
import {Alert, Button, ButtonGroup, Caption, PanelSpinner, Spacing, Subhead} from "@vkontakte/vkui";
import {ShareTypeEnum} from "../../types/ApiTypes";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {apiGetGenerateImage, updateShareGenerateImage} from "../../api/AxiosApi";
import PromiseWrapper from "../../api/PromiseWrapper";
import {ReduxSliceImageInterface, setUploadPhoto} from "../../redux/slice/ImageSlice";
import {AdaptiveContext, AdaptiveContextType} from "../../context/AdaptiveContext";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../redux/store/ConfigureStore";
import bridge from "@vkontakte/vk-bridge";
import {setAccessToken} from "../../redux/slice/UserSlice";
import {setWindowBlocked} from "../../redux/slice/AppStatusesSlice";
import {ModalTypes} from "../../modals/ModalRoot";
import {getPhotoUploadId, getStoryBoxData, getWallData} from "../../helpers/AppHelper";
import {WallMessagesEnum} from "../../enum/MessagesEnum";
import {Icon28AdvertisingOutline, Icon28StoryOutline} from "@vkontakte/icons";

const Content:React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState<boolean>(false);
    const {vkUserInfo} = useContext<AdaptiveContextType>(AdaptiveContext);
    const {uploadPhoto, generateImageId} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
    const routeNavigator = useRouteNavigator();
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
                text="Для публикации результата разрешите доступ."
            />
        );
    }

    const shareWall = async () => {
        bridge.send('VKWebAppGetAuthToken', {
            app_id: Number(process.env.REACT_APP_APP_ID),
            scope: 'photos,wall'
        })
            .then(async (data) => {
                if (data.access_token) {
                    dispatch(setAccessToken(data.access_token))
                    let photoId = uploadPhoto.photoUploadId;

                    if (!photoId) {
                        dispatch(setWindowBlocked(true))
                        routeNavigator.showModal(ModalTypes.MODAL_UPLOAD_PHOTO_PRELOADER);
                        photoId = await getPhotoUploadId(data.access_token, generateImageId);
                        dispatch(setUploadPhoto({...uploadPhoto, photoUploadId: photoId}))
                        dispatch(setWindowBlocked(false))
                        routeNavigator.hideModal();
                    }

                    if (uploadPhoto && vkUserInfo) {
                        const wallData = getWallData({photoUploadId: photoId, vkUserInfo, wallMessage: WallMessagesEnum[uploadPhoto.type]});
                        bridge.send('VKWebAppShowWallPostBox', wallData).then((r) => {
                            if (r.post_id) {
                                updateShareGenerateImage(generateImageId, ShareTypeEnum.SHARE_WALL)
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

    const shareStore = () => {
        if (uploadPhoto) {
            const storyData = getStoryBoxData(uploadPhoto.base64);
            bridge.send('VKWebAppShowStoryBox', storyData).then((r) => {
                if (r.result) {
                    updateShareGenerateImage(generateImageId, ShareTypeEnum.SHARE_HISTORY)
                }
            });
        }
    }

    const init = () => {
        return new Promise(async (resolve) => {
            dispatch(setUploadPhoto({url: '', base64: '', photoUploadId: '', created_at: '',type: 'default',  image_type: {name: ''}}))
            const response = await apiGetGenerateImage(Number(generateImageId));
            dispatch(setUploadPhoto({...response, photoUploadId: '',}))

            resolve(true);
        })
    }

    useEffect(() => {
        setLoading(PromiseWrapper(init()))
    }, []);


    return (
        <React.Fragment>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <img style={{width: '50%', borderRadius: 10, objectFit: 'contain'}} src={uploadPhoto.url} alt='Renestra'/>
            </div>
            <Spacing />
            {
                uploadPhoto.image_type.name && <Subhead weight="2">Образ: <span style={{color: 'var(--vkui--color_tabbar_text_inactive)'}}>{uploadPhoto.image_type.name}</span></Subhead>
            }
            <Subhead weight="2">Создан: <span
                style={{color: 'var(--vkui--color_tabbar_text_inactive)'}}>{uploadPhoto.created_at}</span></Subhead>
            <Subhead weight="1" style={{width: '100%', textAlign: 'center'}}>Поделиться с друзьями</Subhead>
            <Spacing/>
            <ButtonGroup mode="horizontal" stretched>
                <Button
                    before={<Icon28AdvertisingOutline/>}
                    size="l"
                    mode="primary"
                    stretched
                    onClick={shareWall}
                >
                    Посмотреть и поделиться на стене
                    {
                        uploadPhoto?.available_share_free_image && <Caption level="3">Вы получите ещё +1 генерацию бесплатно!</Caption>
                    }
                </Button>
                <Button
                    before={<Icon28StoryOutline/>}
                    size="l"
                    mode="primary"
                    stretched
                    onClick={shareStore}
                >
                    В истории
                </Button>
            </ButtonGroup>
        </React.Fragment>
    )
}

const GenerateImageResultShare: React.FC = () => (
    <Suspense fallback={<PanelSpinner size="medium"/>}>
        <Content/>
    </Suspense>
)

export default GenerateImageResultShare;
