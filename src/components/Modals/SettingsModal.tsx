import * as React from 'react';
import {ChangeEvent, FormEvent, useContext, useRef, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';
import {useModalPage} from "../../context/ModalProvider";
import {AppContext, TAppContext} from "../../context/AppContext";
import {
    Box,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Stack
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../redux/store/ConfigureStore";
import {ReduxSliceUserInterface, setUserDbData} from "../../redux/slice/UserSlice";
import {Save} from "@mui/icons-material";
import {apiEditUser, apiInitUser} from "../../api/AxiosApi";
import {setFavoriteImageTypes, setGenerateImagesNotShareWall, setPopularImageTypes} from "../../redux/slice/ImageSlice";
import {hideAppLoading} from "../../redux/slice/AppStatusesSlice";


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function SettingsModal() {
    const {setModal} = useModalPage();
    const {lang} = useContext<TAppContext>(AppContext);
    const ref = useRef<React.ReactNode| null>(null);
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const [formData, setFormData] = useState({
        sex: userDbData?.sex
    })
    const dispatch = useDispatch();

    const handleClose = () => {
        setModal(null);
    };

    const change = (e: React.FormEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.currentTarget.name]: e.currentTarget.value,
        })
    }

    const handleSave = () => {
        apiEditUser(userDbData?.id as number,  formData)
            .then(async (r) => {
                if (r.result && userDbData) {
                    const {popular_image_types, user, favorite_image_types} = await apiInitUser();
                    dispatch(setUserDbData(user));
                    dispatch(setPopularImageTypes(popular_image_types));
                    dispatch(setFavoriteImageTypes(favorite_image_types));
                    handleClose()
                }
            })
    }

    return (
        <React.Fragment>
            <Dialog
                scroll="body"
                fullScreen
                open={true}
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
                            {lang.TITLES.SETTINGS}
                        </Typography>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleSave}
                            aria-label="save"
                        >
                            <Save />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Box ref={ref}>
                    <Container>
                        <Stack spacing={2} sx={{py: 2}} direction="column" divider={<Divider/>}>
                            <FormControl>
                                <FormLabel
                                    id="demo-radio-buttons-group-label">{lang.HEADERS.SELECT_SEX_PANEL}</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue={userDbData?.sex}
                                    name="sex"
                                    onChange={change}
                                >
                                    <FormControlLabel value="1" control={<Radio/>}
                                                      label={lang.BUTTONS.SELECT_SEX_PANEL_WOMEN}/>
                                    <FormControlLabel value="2" control={<Radio/>}
                                                      label={lang.BUTTONS.SELECT_SEX_PANEL_MEN}/>
                                </RadioGroup>
                            </FormControl>
                        </Stack>
                    </Container>
                </Box>
            </Dialog>
        </React.Fragment>
    );
}
