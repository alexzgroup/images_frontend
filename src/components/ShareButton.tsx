import * as React from 'react';
import {useContext} from 'react';
import {GeneratedImageType, imageType, ShareTypeEnum} from "../types/ApiTypes";
import {AppContext, TAppContext} from "../context/AppContext";
import {useTelegram} from "../context/TelegramProvider";
import {Box, Button, ButtonGroup, Typography} from "@mui/material";
import {Send, Share} from "@mui/icons-material";
import {getSavePreparedInlineMessage, updateShareGenerateImage} from "../api/AxiosApi";

type TShareBtn = {
    image: GeneratedImageType,
    image_type: imageType,
    title?: string,
}

export default function ShareButton({image, image_type, title}: TShareBtn) {
    const {lang} = useContext<TAppContext>(AppContext);
    const { webApp, userTg } = useTelegram();

    const shareStore = async () => {
        if (webApp) {
            webApp.shareToStory(image.url, {
                text: process.env.REACT_APP_TG_URL + ' - generate image Renestra AI',
                widget_link: {
                    url: process.env.REACT_APP_TG_URL,
                    name: lang.MODALS.IMAGE + ": " + image_type.name,
                }
            })
            updateShareGenerateImage(image.id, ShareTypeEnum.SHARE_HISTORY)
        }
    }

    const shareMessage = async () => {
        if (webApp) {
            const {id} = await getSavePreparedInlineMessage(image.id);
            // @ts-ignore
            window.Telegram.WebView.postEvent('web_app_send_prepared_message', false, {id});
        }
    }

    return (
        <React.Fragment>
            <Box sx={{width:'100%'}}>
                <Typography sx={{mb: 1}} textAlign="center" variant="body2" component="p" color="primary">
                    {title || lang.DESCRIPTIONS.SHARE_STORY_NOT_FORGET}
                </Typography>
                <ButtonGroup fullWidth orientation="horizontal" variant="contained" aria-label="Basic button group">
                    {
                        userTg?.is_premium &&
                        <Button size="small" startIcon={<Share/>} fullWidth variant="contained" autoFocus
                                onClick={shareStore}>
                            {lang.MODALS.IN_STORE}
                        </Button>
                    }
                    <Button size="small" endIcon={<Send/>} fullWidth variant="contained" autoFocus
                            onClick={shareMessage}>
                        {lang.BUTTONS.SHARE_MESSAGE}
                    </Button>
                </ButtonGroup>
            </Box>
        </React.Fragment>
    )
}
