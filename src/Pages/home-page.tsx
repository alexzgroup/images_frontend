import {
    Avatar, Box,
    Button,
    Card,
    CardActions,
    CardHeader,
    Container,
    List, ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography
} from '@mui/material';
import React, {useContext} from 'react';
import PageWrapper from "../components/PageWrapper";
import {AppContext, TAppContext} from "../context/AppContext";
import girl_image from '../assets/images/icons/girl_icon.png';
import {useSelector} from "react-redux";
import {RootStateType} from "../redux/store/ConfigureStore";
import {ReduxSliceImageInterface} from "../redux/slice/ImageSlice";
import {AutoFixHigh, Palette} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {imageType} from "../types/ApiTypes";
import {ReduxSliceUserInterface} from "../redux/slice/UserSlice";
import TabsBarImages from "../components/TabsBarImages";
import VipPageBanner from "../components/RenestraVip/VipPageBanner";
import {LabelImageTypeGenerator} from "../components/LabelImageTypeGenerator";
import {useModalPage} from "../context/ModalProvider";
import VipFullPageModal from "../components/Modals/VipFullPageModal";

const HomePage: React.FC = () => {
    const {lang} = useContext<TAppContext>(AppContext);
    const {popularImageTypes, favoriteImageTypes} = useSelector<RootStateType, ReduxSliceImageInterface>(state => state.image)
    const navigate = useNavigate();
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const {setModal} = useModalPage();

    const openImageType = (imageTypeItem: imageType) => {
        if (imageTypeItem.vip && !userDbData?.is_vip) {
            setModal(<VipFullPageModal />);
        } else {
            navigate(`select-image/${imageTypeItem.id}`)
        }
    }

    return (
        <React.Fragment>
            <PageWrapper>
                <Card square elevation={2} sx={{my: 1}}>
                    <CardHeader
                        avatar={
                            <Avatar
                                src={girl_image}
                                variant="rounded" />
                        }
                        title={lang.HEADERS.HOME_PANEL}
                        subheader={lang.DESCRIPTIONS.HOME_PANEL_TOP}
                    />
                    <CardActions disableSpacing>
                        <Button
                            startIcon={<AutoFixHigh />}
                            fullWidth
                            onClick={() => navigate("select-image-type")}
                            size="small"
                            variant="contained">{lang.BUTTONS.HOME_PANEL_GO}</Button>
                    </CardActions>
                </Card>
                {
                    !!favoriteImageTypes.length &&
                        <Paper square elevation={2} sx={{mb: 1}}>
                            <CardHeader title={lang.TITLES.HOME_PANEL_FAVORITE} />
                            <TabsBarImages images={favoriteImageTypes} />
                        </Paper>
                }
                <List
                    sx={{ width: '100%', bgcolor: 'background.paper' }}
                    component="div"
                    aria-labelledby="nested-list-subheader"
                >
                    <Container>
                        <Typography color="primary" variant="h6" component="div">
                            {lang.TITLES.HOME_PANEL_POPULAR}
                        </Typography>
                    </Container>
                    {
                        !!popularImageTypes.length && popularImageTypes.map((value, key) =>
                            <ListItem dense key={key} secondaryAction={<Box sx={{display: 'flex', alignItems: 'center'}}>
                                {LabelImageTypeGenerator(value.labels as never)}
                            </Box>}>
                                <ListItemButton
                                    sx={{pl: 0}}
                                    onClick={() => openImageType(value)}>
                                    <ListItemIcon>
                                        <Palette />
                                    </ListItemIcon>
                                    <ListItemText secondary={value.name} />
                                </ListItemButton>
                            </ListItem>
                        )
                    }
                </List>
                {
                    !userDbData?.is_vip &&
                        <Paper square sx={{my: 1}} elevation={2}>
                            <VipPageBanner showBottom />
                        </Paper>
                }
            </PageWrapper>
        </React.Fragment>
    );
};

export default HomePage;
