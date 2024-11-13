import {IconButton, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper} from '@mui/material';
import React, {useContext, useEffect} from 'react';
import PageWrapper from "../components/PageWrapper";
import {AppContext, TAppContext} from "../context/AppContext";
import {RootStateType} from "../redux/store/ConfigureStore";
import {ReduxSliceUserInterface} from "../redux/slice/UserSlice";
import {UserWithGeneratedInfoType} from "../types/ApiTypes";
import {useTelegram} from "../context/TelegramProvider";
import {Favorite, MoreVert, Palette, Timer} from "@mui/icons-material";
import {useLoaderData} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {hideAppLoading} from '../redux/slice/AppStatusesSlice';
import TitlebarImageList from "../components/TitlebarImageList";
import VipPageBanner from "../components/RenestraVip/VipPageBanner";
import {useModalPage} from "../context/ModalProvider";
import SettingsModal from "../components/Modals/SettingsModal";

const ProfilePage: React.FC = () => {
    const {lang} = useContext<TAppContext>(AppContext);
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const { userTg} = useTelegram();
    const {popular_image_type_name, last_date_generate, total_generate, history_generate} = useLoaderData() as UserWithGeneratedInfoType;
    const dispatch = useDispatch();
    const {setModal} = useModalPage();

    useEffect(() => {
        dispatch(hideAppLoading())
    }, []);

    return (
        <React.Fragment>
            {/*<PageWrapper title={lang.HEADERS.PROFILE_PANEL} after={<Avatar sx={(theme) => ({*/}
            {/*    color: theme.palette.text.primary,*/}
            {/*    bgcolor: theme.palette.background.paper,*/}
            {/*})}>*/}
            <PageWrapper title={lang.HEADERS.PROFILE_PANEL} after={<IconButton
                    onClick={() => setModal(<SettingsModal />)}
                    size="large"
                    aria-label="display more actions"
                    edge="end"
                    color="inherit"
                >
                    <MoreVert />
                </IconButton>}>
                <Paper square elevation={2}>
                    <List
                        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        subheader={
                            <ListSubheader component="div" id="nested-list-subheader">
                                {userTg?.first_name || ''}  {userTg?.last_name || ''}
                            </ListSubheader>
                        }
                    >
                        <ListItem dense>
                            <ListItemIcon>
                                <Favorite color="error" />
                            </ListItemIcon>
                            <ListItemText primary={`${lang.DESCRIPTIONS.GENERATE_INFO_LIKE_IMAGE} ${popular_image_type_name}`} />
                        </ListItem>
                        <ListItem dense>
                            <ListItemIcon>
                                <Timer color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={`${lang.DESCRIPTIONS.GENERATE_INFO_LAST_IMAGE} ${last_date_generate}`} />
                        </ListItem>
                        <ListItem dense>
                            <ListItemIcon>
                                <Palette color="secondary" />
                            </ListItemIcon>
                            <ListItemText primary={`${lang.DESCRIPTIONS.GENERATE_INFO_TOTAL_IMAGE} ${total_generate}`} />
                        </ListItem>
                    </List>
                </Paper>
                <Paper square elevation={2} sx={{my: 1}}>
                    <TitlebarImageList history_generate={history_generate} showBtn />
                </Paper>
                {
                    !userDbData?.is_vip &&
                    <Paper square sx={{mb: 1}} elevation={2}>
                        <VipPageBanner />
                    </Paper>
                }
            </PageWrapper>
        </React.Fragment>
    );
};

export default ProfilePage;
