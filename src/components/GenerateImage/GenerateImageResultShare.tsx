import React, {Suspense, useContext, useEffect, useState} from "react";
import {Banner, Button, ButtonGroup, PanelSpinner, Spacing, Subhead} from "@vkontakte/vkui";
import {ShareTypeEnum} from "../../types/ApiTypes";
import {apiGetGenerateImage, updateShareGenerateImage} from "../../api/AxiosApi";
import PromiseWrapper from "../../api/PromiseWrapper";
import {ReduxSliceImageInterface, setUploadPhoto} from "../../redux/slice/ImageSlice";
import {AppContext, TAppContext} from "../../context/AppContext";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {Icon28StoryOutline} from "@vkontakte/icons";
import {ColorsList} from "../../types/ColorTypes";
import {useTelegram} from "../../context/TelegramProvider";

const Content:React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState<boolean>(false);
    const { userTg} = useTelegram();
    const {uploadPhoto, generateImageId} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
    const dispatch = useDispatch();
    const { webApp } = useTelegram();
    const {lang} = useContext<TAppContext>(AppContext);

    const shareStore = async () => {
        if (uploadPhoto && webApp) {
            webApp.shareToStory(uploadPhoto.url, {
                text: 'Мой образ сгенерировало приложение Renestra AI',
                widget_link: {
                    url: process.env.REACT_APP_TG_URL,
                    name: 'Образ: ' + uploadPhoto.image_type.name,
                }
            })
            updateShareGenerateImage(generateImageId, ShareTypeEnum.SHARE_HISTORY)
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
                uploadPhoto.image_type.name && <Subhead weight="2">{lang.MODALS.IMAGE}: <span style={{color: 'var(--vkui--color_tabbar_text_inactive)'}}>{uploadPhoto.image_type.name}</span></Subhead>
            }
            <Subhead weight="2">{lang.MODALS.CREATE}: <span
                style={{color: 'var(--vkui--color_tabbar_text_inactive)'}}>{uploadPhoto.created_at}</span></Subhead>
            {
                userTg?.is_premium &&
                <React.Fragment>
                    <Subhead weight="1" style={{width: '100%', textAlign: 'center'}}>{lang.MODALS.SHARE_STORE_SHORT}</Subhead>
                    <Spacing/>
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
                            actions={
                                <Button
                                    before={<Icon28StoryOutline/>}
                                    size="l"
                                    appearance="overlay"
                                    stretched
                                    onClick={shareStore}
                                >
                                    {lang.MODALS.IN_STORE}
                                </Button>
                            }
                        />
                    }
                    <ButtonGroup mode="horizontal" stretched>
                        {
                            !uploadPhoto?.available_share_free_image &&
                            <Button
                                before={<Icon28StoryOutline/>}
                                size="l"
                                mode="primary"
                                stretched
                                onClick={shareStore}
                            >
                                {lang.MODALS.IN_STORE}
                            </Button>
                        }
                    </ButtonGroup>
                </React.Fragment>
            }
        </React.Fragment>
    )
}

const GenerateImageResultShare: React.FC = () => (
    <Suspense fallback={<PanelSpinner size="medium"/>}>
        <Content/>
    </Suspense>
)

export default GenerateImageResultShare;
