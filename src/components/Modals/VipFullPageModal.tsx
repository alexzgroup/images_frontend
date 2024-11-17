import * as React from 'react';
import {useContext, useRef} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import {useModalPage} from "../../context/ModalProvider";
import {AppContext, TAppContext} from "../../context/AppContext";
import {Box, CardActions, CardMedia, Grid2, ListItem, ListItemIcon} from "@mui/material";
import vipLogo from "../../assets/images/vip_logo.png";
import {common, orange} from "@mui/material/colors";
import {AutoFixHigh, Diversity3, Palette, PanTool} from "@mui/icons-material";
import StarFields from "../StarFields";
import {TransitionBottom} from "../../helpers/Transitions";
import {createInvoiceLink} from "../../api/AxiosApi";
import {useTelegram} from "../../context/TelegramProvider";

export default function VipFullPageModal() {
    const {setModal} = useModalPage();
    const {lang} = useContext<TAppContext>(AppContext);
    const ref = useRef<React.ReactNode| null>(null);
    const { webApp} = useTelegram();

    const handleClose = () => {
        setModal(null);
    };

    const getInvoiceLink = async () => {
        const {link} = await createInvoiceLink();
        webApp?.openInvoice(link, (data) => {
            console.log(data);
        });
    }

    return (
        <React.Fragment>
            <Dialog
                scroll="body"
                fullScreen
                open={true}
                onClose={handleClose}
                TransitionComponent={TransitionBottom}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Box ref={ref} className="vip-block" sx={{background: 'var(--black_gradient)'}}>
                    <StarFields
                        starCount={1000}
                        starColor={[250, 250, 0]}
                        speedFactor={0.08}
                    />
                    <CardMedia
                        component="img"
                        height="auto"
                        image={vipLogo}
                        alt="Paella dish"
                    />
                    <Typography
                        component="div"
                        variant="h2"
                        sx={{fontFamily: 'FloridaVibesByTurbologo, serif', color: common.white, textAlign: 'center'}}>
                        Renestra
                    </Typography>
                    <Typography
                        component="div"
                        variant="h5" sx={{color: common.white, textAlign: 'center'}}>
                        {lang.TITLES.VIP_MODAL_GET_VIP}
                    </Typography>
                    <CardActions>
                        <Button onClick={getInvoiceLink} fullWidth sx={{background: 'var(--gold_gradient)', mx: 1, color: common.black}}>
                            {lang.BUTTONS.VIP_MODAL_GET}
                        </Button>
                    </CardActions>
                    <Typography
                        component="div"
                        variant="h6" sx={{color: orange[200], textAlign: 'center'}}>
                        {lang.DESCRIPTIONS.VIP_MODAL_TOTAL_AMOUNT}
                    </Typography>
                    <Grid2 container>
                        <Grid2 size={12} display="flex" justifyContent="center">
                            <List dense disablePadding>
                                <ListItem>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <Palette color="warning"/>
                                        </ListItemIcon>
                                        <ListItemText>{lang.DESCRIPTIONS.VIP_BLOCK_1}</ListItemText>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <Diversity3 color="warning"/>
                                        </ListItemIcon>
                                        <ListItemText>{lang.DESCRIPTIONS.VIP_MODAL_VIP_TEXT_1}</ListItemText>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <AutoFixHigh color="warning"/>
                                        </ListItemIcon>
                                        <ListItemText>{lang.DESCRIPTIONS.VIP_BLOCK_2}</ListItemText>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <PanTool color="warning"/>
                                        </ListItemIcon>
                                        <ListItemText>{lang.DESCRIPTIONS.VIP_MODAL_VIP_TEXT_2}</ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Grid2>
                    </Grid2>
                    <Typography
                        component="div"
                        variant="subtitle1" sx={{textAlign: 'center', color: common.white}}>
                        {lang.DESCRIPTIONS.VIP_MODAL_MOTIVATION}
                    </Typography>
                </Box>
            </Dialog>
        </React.Fragment>
    );
}
