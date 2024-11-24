import {Box, Button, ButtonGroup, Stack} from '@mui/material';
import React, {useContext} from 'react';
import PageWrapper from "../components/PageWrapper";
import {AppContext, TAppContext} from "../context/AppContext";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../redux/store/ConfigureStore";
import {ReduxSliceUserInterface, setUserDbData} from "../redux/slice/UserSlice";
import {Female, Male} from "@mui/icons-material";
import {blue, pink} from "@mui/material/colors";
import {apiEditUser, apiInitUser} from "../api/AxiosApi";
import {hideAppLoading, showAppLoading} from "../redux/slice/AppStatusesSlice";
import {setFavoriteImageTypes, setPopularImageTypes} from "../redux/slice/ImageSlice";
import {useNavigate} from "react-router-dom";
import femaleImage from '../assets/images/female-select-sex.svg';
import maleImage from '../assets/images/male-select-sex.svg';

export default  function SelectSexPage() {
    const {lang} = useContext<TAppContext>(AppContext);
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const selectSex = (sex: 1|2) => {
        dispatch(showAppLoading());
        apiEditUser(userDbData?.id as number,  {sex})
            .then(async (r) => {
                if (r.result && userDbData) {
                    const {popular_image_types, user, favorite_image_types} = await apiInitUser();

                    dispatch(setUserDbData(user));
                    dispatch(setPopularImageTypes(popular_image_types));
                    dispatch(setFavoriteImageTypes(favorite_image_types));
                    dispatch(hideAppLoading());

                    navigate('/');
                }
            })
    }

    return (
        <React.Fragment>
            <PageWrapper title={lang.HEADERS.SELECT_SEX_PANEL}>
                <Box display="flex" sx={{height: 'calc(100vh - 48px)'}}>
                    <ButtonGroup fullWidth variant="text" aria-label="Basic button group">
                        <Button fullWidth onClick={() => selectSex(2)} sx={{color: blue[700]}}>
                            <Stack spacing={2} direction="column" sx={{ alignItems: 'center' }}>
                                <Male sx={{fontSize: 72}} />
                                <img src={maleImage} style={{width: '100%'}} alt="Renestra" />
                            </Stack>
                        </Button>
                        <Button fullWidth onClick={() => selectSex(1)} sx={{color: pink[700]}}>
                            <Stack spacing={2} direction="column" sx={{ alignItems: 'center' }}>
                                <Female sx={{fontSize: 72}} />
                                <img src={femaleImage} style={{width: '100%'}} alt="Renestra" />
                            </Stack>
                        </Button>
                    </ButtonGroup>
                </Box>
            </PageWrapper>
        </React.Fragment>
    );
};
