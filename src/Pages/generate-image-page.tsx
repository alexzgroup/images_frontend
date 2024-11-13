import {
    Alert,
    AlertTitle,
    Avatar, Box, Button, ButtonGroup,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia, Container,
    IconButton, Paper,
    Skeleton,
    Typography
} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import PageWrapper from "../components/PageWrapper";
import {AppContext, TAppContext} from "../context/AppContext";
import {useSelector} from "react-redux";
import {RootStateType} from "../redux/store/ConfigureStore";
import {ReduxSliceUserInterface} from "../redux/slice/UserSlice";
import {useTelegram} from "../context/TelegramProvider";
import {useActionData} from "react-router-dom";
import {generateImageType, ShareTypeEnum} from "../types/ApiTypes";
import {apiGenerateImage, updateShareGenerateImage} from "../api/AxiosApi";
import {Diversity1, Share, Warning} from "@mui/icons-material";

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
                text: lang.SHARE_TEXT[image.image_type.type],
                widget_link: {
                    url: process.env.REACT_APP_TG_URL,
                    name: 'Образ: ' + image.image_type.name,
                }
            })
            updateShareGenerateImage(image.id, ShareTypeEnum.SHARE_HISTORY)
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
    const { userTg, webApp} = useTelegram();
    const [image, setImage] = useState<generateImageType>()
    const formData = useActionData() as FormData;
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');

    const share = async () => {
        if (userTg?.is_premium) {
            if (image && webApp) {
                webApp.shareToStory(image.image.url, {
                    text: lang.SHARE_TEXT[image.image_type.type],
                    widget_link: {
                        url: process.env.REACT_APP_TG_URL,
                        name: 'Образ: ' + image.image_type.name,
                    }
                })
                updateShareGenerateImage(image.id, ShareTypeEnum.SHARE_HISTORY)
            }
        } else {
             if (/*image && */webApp) {
                 const link = 'https://t.me/Auto_Shop_72_bot/open_app?userId=' + String(userTg?.id) + '&imageId=' + String(5);
                 const title = encodeURI('Это моя генерация');
                 const shareLink = `https://t.me/share/url?url=${encodeURI(link)}&text=${title}`;
                 webApp.openTelegramLink(shareLink);
                // updateShareGenerateImage(image.id, ShareTypeEnum.SHARE_WALL)
             }
        }
    }

    useEffect(() => {
        async function init(){
            //  const response = await apiGenerateImage(formData)
            //  setImage(response)
            // if (response.result) {
            //     setStep(userTg?.is_premium ? 2 : 3)
            // } else {
            //     setStep(0)
            //     setError(response.message);
            // }
            setStep(2)
        }
        init()
    }, []);

    return (
        <React.Fragment>
            <PageWrapper title={lang.HEADERS.VIEW_GENERATE}>
                {
                    step === 0 &&
                        <Alert severity="error">
                            <AlertTitle>{lang.HEADERS.OFFLINE_PANEL}</AlertTitle>
                            {error}
                        </Alert>
                }
                {
                    step === 1 &&
                        <Alert severity="info">
                            <AlertTitle>{lang.DESCRIPTIONS.PRELOADER_PANEL_STEP_1}</AlertTitle>
                            {lang.DESCRIPTIONS.PRELOADER_PANEL_STEP_4}
                        </Alert>
                }
                {
                    step === 2 &&
                    <Alert severity="info">
                        <AlertTitle>{lang.DESCRIPTIONS.PRELOADER_PANEL_FINISH}</AlertTitle>
                        {userTg?.is_premium ? lang.TITLES.SHOW_GENERATE_PANEL_SHARE_STORY : lang.DESCRIPTIONS.SHARE_MESSAGE}
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
                    step === 2 && <Paper sx={{height: '50vh'}} square elevation={0}>
                        <Container sx={{display: 'flex', flexFlow: 'column', height: '100%', justifyContent: 'space-around', alignItems: 'center'}}>
                            <Box id="animateHeartWrapper">
                                <Diversity1 color="secondary" sx={{width: 124, height: 124}} />
                                <Diversity1 color="secondary" sx={{width: 124, height: 124}} />
                            </Box>
                                <Button fullWidth variant="contained" startIcon={<Share />} autoFocus onClick={share}>
                                    {lang.BUTTONS.SHARE}
                                </Button>
                        </Container>
                    </Paper>
                }
                {
                    step === 1 && <Media loading />
                }
                {
                    step === 0 && <Box sx={{height: '50vh'}} display="flex" justifyContent="center" alignItems="center">
                        <Warning color="error" sx={{width: 180, height: 180}} />
                    </Box>
                }
            </PageWrapper>
        </React.Fragment>
    );
};
