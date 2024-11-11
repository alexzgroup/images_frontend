import {
    Alert,
    AlertTitle,
    Avatar,
    Card, CardActions,
    CardContent,
    CardHeader,
    CardMedia, IconButton,
    Skeleton,
    Step,
    StepLabel,
    Stepper,
    Typography
} from '@mui/material';
import React, {memo, useContext, useEffect, useState} from 'react';
import PageWrapper from "../components/PageWrapper";
import {AppContext, TAppContext} from "../context/AppContext";
import girl_image from '../assets/images/icons/girl_icon.png';
import {useSelector} from "react-redux";
import {RootStateType} from "../redux/store/ConfigureStore";
import {ReduxSliceUserInterface} from "../redux/slice/UserSlice";
import {useTelegram} from "../context/TelegramProvider";
import {useActionData, useLoaderData} from "react-router-dom";
import {generateImageType, ShareTypeEnum} from "../types/ApiTypes";
import {apiGenerateImage, updateShareGenerateImage} from "../api/AxiosApi";
import {Share} from "@mui/icons-material";

type Taction = {
    request: Request,
    params?: any,
}

export async function action({ request }: Taction) {
    const formData = await request.formData();
    return Object.fromEntries(formData);
}

interface MediaProps {
    loading?: boolean;
    image?: generateImageType,
}

const Media = (props: MediaProps) =>  {
    const { loading = false, image } = props;
    const {lang} = useContext<TAppContext>(AppContext);
    const { userTg, webApp } = useTelegram();
    const shareStore = async () => {
        if (image && webApp) {
            webApp.shareToStory(image.image.url, {
                text: lang.MODALS.SHARE_TEXT,
                widget_link: {
                    url: process.env.REACT_APP_TG_URL,
                    name: 'Образ: ' + image.image_type.name,
                }
            })
            updateShareGenerateImage(image.id, ShareTypeEnum.SHARE_TG_STORY)
        }
    }

    return (
        <Card square elevation={0}>
            <CardHeader
                avatar={
                    loading ? (
                        <Skeleton animation="wave" variant="circular" width={40} height={40} />
                    ) : (
                        <Avatar alt="Ted talk">
                            {Array.from(image?.image_type.name || 'R')[0]}
                        </Avatar>
                    )
                }
                title={
                    loading ? (
                        <Skeleton
                            animation="wave"
                            height={10}
                            width="80%"
                            style={{ marginBottom: 6 }}
                        />
                    ) : (
                        image?.image_type.name
                    )
                }
                subheader={
                    loading ? (
                        <Skeleton animation="wave" height={10} width="40%" />
                    ) : (
                        image?.image.created_at
                    )
                }
            />
            {loading ? (
                <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
            ) : (
                <CardMedia
                    component="img"
                    height="240"
                    sx={{backgroundPosition: 'center top'}}
                    image={image?.image.url}
                    alt="Nicola Sturgeon on a TED talk stage"
                />
            )}
            <CardContent>
                {loading ? (
                    <React.Fragment>
                        <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                        <Skeleton animation="wave" height={10} width="80%" />
                    </React.Fragment>
                ) : (
                    <Typography variant="body2" component="p" color="primary">
                        {lang.DESCRIPTIONS.SHARE_STORY_NOT_FORGET}
                    </Typography>
                )}
            </CardContent>
            <CardActions disableSpacing>
                {
                    loading ?
                        <Skeleton sx={{ height: 40, width: 40 }} animation="wave" variant="rectangular" />
                            : (
                        <IconButton onClick={shareStore} aria-label="share">
                        <Share />
                    </IconButton>
                    )
                }

            </CardActions>
        </Card>
    );
}

export default function GenerateImagePage(){
    const {lang} = useContext<TAppContext>(AppContext);
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const { userTg} = useTelegram();
    const [image, setImage] = useState<generateImageType>()
    const formData = useActionData() as FormData;
    const [step, setStep] = useState(1);

    useEffect(() => {
        async function init(){
             const response = await apiGenerateImage(formData)
             setImage(response)
            if (response.result) {
                setStep(3)
            } else {

            }

        }
        init()
    }, []);

    return (
        <React.Fragment>
            <PageWrapper title={lang.HEADERS.VIEW_GENERATE}>
                {
                    step === 1 &&
                        <Alert severity="info">
                            <AlertTitle>{lang.DESCRIPTIONS.PRELOADER_PANEL_STEP_1}</AlertTitle>
                            {lang.DESCRIPTIONS.PRELOADER_PANEL_STEP_4}
                        </Alert>
                }
                {
                    step === 3 &&
                    <Alert severity="success">
                        <AlertTitle>{lang.MODALS.CONGRATULATE}</AlertTitle>
                        {lang.MODALS.READY_IMAGE}
                    </Alert>
                }
                {
                    step === 3 && <Media image={image} />
                }
                {
                    step === 1 && <Media loading />
                }
            </PageWrapper>
        </React.Fragment>
    );
};
