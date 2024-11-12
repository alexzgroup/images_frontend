import * as React from 'react';
import {useContext, useEffect, useRef, useState} from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import {AppContext, TAppContext} from "../context/AppContext";
import {GeneratedImageType, ShareTypeEnum} from "../types/ApiTypes";
import {
    Avatar,
    Box,
    Button,
    Container,
    DialogActions,
    DialogContent,
    Grid2,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    useTheme
} from '@mui/material';
import {useSelector} from "react-redux";
import {RootStateType} from "../redux/store/ConfigureStore";
import {ReduxSliceUserInterface} from "../redux/slice/UserSlice";
import {Share, Timer, Visibility, Warning} from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import {updateShareGenerateImage} from "../api/AxiosApi";
import {useTelegram} from "../context/TelegramProvider";
import {TransitionProps} from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import {Link} from 'react-router-dom';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function TitlebarImageList({history_generate, showBtn}: {
    history_generate: GeneratedImageType[],
    showBtn?: boolean,
}) {
    const {lang} = useContext<TAppContext>(AppContext);
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const [image, setImage] = useState<GeneratedImageType|null>(null);
    const { webApp, userTg } = useTelegram();
    const ref = useRef<React.ReactNode| null>(null);
    const theme = useTheme();

    const handleClose = () => {
        setImage(null);
    };

    const shareStore = async () => {
        if (image && webApp) {
            webApp.shareToStory(image.url, {
                text: lang.MODALS.SHARE_TEXT,
                widget_link: {
                    url: process.env.REACT_APP_TG_URL,
                    name: 'Образ: ' + image.image_type.name,
                }
            })
            updateShareGenerateImage(image.id, ShareTypeEnum.SHARE_HISTORY)
        }
    }

    useEffect(() => {
        return setImage(null);
    }, []);

    return (
        <Box>
            <Grid2 container spacing={2}>
                <Grid2 size={6}>
                    <ListSubheader color="primary" component="div">{lang.DESCRIPTIONS.PROFILE_PANEL_HISTORY}</ListSubheader>
                </Grid2>
                {
                    showBtn &&
                        <Grid2 size={6}>
                            <ListSubheader component="div" sx={{textAlign: 'right'}}>
                                <Link style={{color: theme.palette.primary.dark}}  to={`/history/${userDbData?.id}`}>{lang.BUTTONS.PROFILE_INFO_PANEL_MORE}</Link>
                            </ListSubheader>
                        </Grid2>
                }
            </Grid2>
            {
                !!history_generate.length ?
                    <ImageList cols={2} rowHeight={180} sx={{ height: history_generate.length > 2 ? 450 : 200, mb: 0 }}>
                        {history_generate.map((item, index) => (
                            <ImageListItem sx={{overflow: 'hidden'}} rows={1} cols={1} key={item.id + index}>
                                <img
                                    src={`${item.url}`}
                                    alt={item.url}
                                    loading="lazy"
                                    style={{width:'100%', height:'auto'}}
                                />
                                <ImageListItemBar
                                    title={item.image_type.name}
                                    subtitle={item.created_at}
                                    actionIcon={
                                        <IconButton
                                            onClick={() => setImage(item)}
                                            sx={{ color: theme.palette.common.white }}
                                            aria-label={`info about ${item.image_type.name}`}
                                        >
                                            <Visibility />
                                        </IconButton>
                                    }
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                    :
                    <Container>
                        <Typography sx={{textAlign: 'center', pb: 2}} color="error" variant="h6" component="div">
                            <Warning color="error" /> <br /> {lang.DESCRIPTIONS.NO_RESULT}
                        </Typography>
                    </Container>
            }
            {
                image &&
                <Dialog
                    scroll="body"
                    fullScreen
                    open={!!image}
                    onClose={handleClose}
                    TransitionComponent={Transition}
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
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                {image.image_type.name}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Box ref={ref}>
                        <Container>
                            <DialogContent dividers>
                                <List>
                                    <ListItem dense>
                                        <ListItemIcon>
                                            <Timer color="primary" />
                                        </ListItemIcon>
                                        <ListItemText primary={`${image.created_at}`} />
                                    </ListItem>
                                </List>
                                <Avatar src={image.url} variant="rounded" sx={{
                                    width: '100%',
                                    height: 'auto',
                                }} />

                            </DialogContent>
                            {
                                userTg?.is_premium &&
                                <DialogActions>
                                    <Button startIcon={<Share />} fullWidth variant="contained" autoFocus onClick={shareStore}>
                                        {lang.MODALS.SHARE_STORE_SHORT}
                                    </Button>
                                </DialogActions>
                            }
                        </Container>
                    </Box>
                </Dialog>
            }
        </Box>
    );
}

// const itemData = [
//     {
//         img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
//         title: 'Breakfast',
//         author: '@bkristastucchio',
//         rows: 2,
//         cols: 2,
//         featured: true,
//     },
//     {
//         img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
//         title: 'Burger',
//         author: '@rollelflex_graphy726',
//     },
//     {
//         img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
//         title: 'Camera',
//         author: '@helloimnik',
//     },
//     {
//         img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
//         title: 'Coffee',
//         author: '@nolanissac',
//         cols: 2,
//     },
//     {
//         img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
//         title: 'Hats',
//         author: '@hjrc33',
//         cols: 2,
//     },
//     {
//         img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
//         title: 'Honey',
//         author: '@arwinneil',
//         rows: 2,
//         cols: 2,
//         featured: true,
//     },
//     {
//         img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
//         title: 'Basketball',
//         author: '@tjdragotta',
//     },
//     {
//         img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
//         title: 'Fern',
//         author: '@katie_wasserman',
//     },
//     {
//         img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
//         title: 'Mushrooms',
//         author: '@silverdalex',
//         rows: 2,
//         cols: 2,
//     },
//     {
//         img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
//         title: 'Tomato basil',
//         author: '@shelleypauls',
//     },
//     {
//         img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
//         title: 'Sea star',
//         author: '@peterlaster',
//     },
//     {
//         img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
//         title: 'Bike',
//         author: '@southside_customs',
//         cols: 2,
//     },
// ];
