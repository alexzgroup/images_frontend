import {Box, Button, CardActions, CardContent, CardHeader, CardMedia, Grid2, Typography} from "@mui/material";
import vipLogo from "../../assets/images/vip_logo.png";
import {orange, common} from "@mui/material/colors";
import React, {useContext} from "react";
import {AppContext, TAppContext} from "../../context/AppContext";
import {useModalPage} from "../../context/ModalProvider";
import VipFullPageModal from "../Modals/VipFullPageModal";

export default function VipPageBanner({showBottom}: {
    showBottom?: boolean
}) {
    const {lang} = useContext<TAppContext>(AppContext);
    const {setModal} = useModalPage();

    return (
        <Box className="vip-block pulseLine" sx={{background: 'var(--black_gradient)'}}>
            <CardMedia
                component="img"
                height="auto"
                image={vipLogo}
                alt="Paella dish"
            />
            <CardContent sx={{py: 1}}>
                <Grid2 container spacing={2}>
                    <Grid2 size={6}>
                        <Typography
                            component="div"
                            variant="h2" sx={{fontFamily: 'FloridaVibesByTurbologo, serif', color: orange[500], textAlign: 'center'}}>
                            Renestra
                        </Typography>
                    </Grid2>
                    <Grid2 size={6}>
                        <Typography
                            color={orange[200]}
                            component="div"
                            variant="subtitle2" >
                            {lang.DESCRIPTIONS.VIP_BLOCK_1}
                        </Typography>
                        <Typography
                            color={orange[300]}
                            component="div"
                            variant="subtitle2" >
                            {lang.DESCRIPTIONS.VIP_BLOCK_2}
                        </Typography>
                        <Typography
                            color={orange[400]}
                            component="div"
                            variant="subtitle2" >
                            {lang.DESCRIPTIONS.VIP_BLOCK_3}
                        </Typography>
                    </Grid2>
                </Grid2>
            </CardContent>
            {
                showBottom &&
                    <CardHeader
                        sx={{py: 0}}
                        title={lang.HEADERS.HOME_PANEL}
                        subheader={lang.DESCRIPTIONS.HOME_PANEL_TOP}
                        avatar={<Typography sx={{px: 1, borderRadius: 1, color: common.black, background: 'var(--gold_gradient)'}} >VIP</Typography>}
                    />
            }
            <CardActions>
                <Button
                    onClick={() => setModal(<VipFullPageModal />)}
                    fullWidth sx={{background: 'var(--gold_gradient)', mx: 1, color: common.black}}>
                    {lang.TITLES.VIP_BLOCK_GOLD_BUTTON}
                </Button>
            </CardActions>
        </Box>
    )
}