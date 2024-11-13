import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Container,
    List, ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography
} from '@mui/material';
import React, {useContext, useEffect} from 'react';
import PageWrapper from "../../components/PageWrapper";
import {AppContext, TAppContext} from "../../context/AppContext";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceUserInterface} from "../../redux/slice/UserSlice";
import {exclusiveImageTypesType, favoriteImageType, imageType} from "../../types/ApiTypes";
import {Palette} from "@mui/icons-material";
import {useLoaderData, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {hideAppLoading} from '../../redux/slice/AppStatusesSlice';
import banner_man_image from "../../assets/images/select_image_profile_man.jpg";
import banner_girl_image from "../../assets/images/select_image_profile_girl.jpg";
import TabsBarImages from "../../components/TabsBarImages";
import {LabelImageTypeGenerator} from "../../components/LabelImageTypeGenerator";
import VipFullPageModal from "../../components/Modals/VipFullPageModal";
import {useModalPage} from "../../context/ModalProvider";

type  ImageTypeFromRequest = {
    exclusive_image_types: exclusiveImageTypesType[],
    favorite_image_types: favoriteImageType[] ,
    items: imageType[],
}

export default function SelectImageTypePage() {
    const {lang} = useContext<TAppContext>(AppContext);
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {items, exclusive_image_types, favorite_image_types} = useLoaderData() as ImageTypeFromRequest;
    const {setModal} = useModalPage();

    const openImageType = (imageTypeItem: imageType) => {
        if (imageTypeItem.vip && !userDbData?.is_vip) {
            setModal(<VipFullPageModal />);
        } else {
            navigate(`/select-image/${imageTypeItem.id}`, {preventScrollReset: true})
        }
    }

    useEffect(() => {
        dispatch(hideAppLoading())
    }, []);

    const openRandomImage = () => {
        let imageTypesFiltered = items;
        if (!userDbData?.is_vip && items) {
            imageTypesFiltered = items.filter((item) => !item.vip)
        }

        if (imageTypesFiltered) {
            const item = imageTypesFiltered[Math.floor(Math.random() * (imageTypesFiltered.length - 1))];
            navigate(`/select-image/${item.id}`)
        }
    }

    return (
        <React.Fragment>
            <PageWrapper title={lang.HEADERS.SELECT_PROFILE_PANEL} >
                <Card square elevation={6} sx={{mb: 2}}>
                    <CardActionArea sx={{position:"relative"}}>
                        <CardMedia
                            component="img"
                            height="165"
                            image={userDbData?.sex === 2 ? banner_man_image : banner_girl_image}
                            alt="green iguana"
                        />
                        <Box sx={{position: 'absolute', top: 0, left: 0, width: '100%'}}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div" color="common.white">
                                    {lang.TITLES.SELECT_PROFILE_PANEL_BANNER_TITLE}
                                </Typography>
                                <Typography variant="body2" color="common.white">
                                    {lang.DESCRIPTIONS.SELECT_PROFILE_PANEL_BANNER_DESCRIPTION}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button onClick={openRandomImage} size="small" variant="contained" color="inherit">
                                    {lang.BUTTONS.SELECT_PROFILE_PANEL_GENERATE}
                                </Button>
                            </CardActions>
                        </Box>
                    </CardActionArea>
                </Card>
                {
                    !!exclusive_image_types.length &&
                        <Paper square elevation={2} sx={{mb: 1}}>
                            <CardHeader title={lang.TITLES.SELECT_PROFILE_PANEL_ADDITIONAL} />
                            <TabsBarImages images={exclusive_image_types} />
                        </Paper>
                }
                {
                    !!favorite_image_types.length &&
                        <Paper square elevation={2} sx={{mb: 1}}>
                            <CardHeader title={lang.TITLES.HOME_PANEL_FAVORITE} />
                            <TabsBarImages images={favorite_image_types} />
                        </Paper>
                }
                {
                    !!items.length &&
                    <List
                        dense
                        sx={{ width: '100%', bgcolor: 'background.paper' }}
                        component="div"
                        aria-labelledby="nested-list-subheader"
                    >
                        <Container>
                            <Typography color="primary" variant="h6" component="div">
                                {lang.TITLES.SELECT_PROFILE_PANEL_OTHER_IMAGES}
                            </Typography>
                        </Container>
                        {
                            !!items.length && items.map((value, key) =>
                                <ListItem dense key={key} secondaryAction={<Box sx={{display: 'flex', alignItems: 'center'}}>
                                    {LabelImageTypeGenerator(value.labels || [] as never)}
                                </Box>}>
                                    <ListItemButton
                                        sx={{pl: 0}}
                                        onClick={() => openImageType(value)} key={key}>
                                        <ListItemIcon>
                                            <Palette />
                                        </ListItemIcon>
                                        <ListItemText secondary={value.name} />
                                    </ListItemButton>
                                </ListItem>
                            )
                        }
                    </List>
                }
            </PageWrapper>
        </React.Fragment>
    );
}
