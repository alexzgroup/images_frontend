import {Box, Button, ButtonGroup} from '@mui/material';
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
                    <ButtonGroup sx={{flexShrink: 0, flexGrow: 1}} fullWidth variant="text" aria-label="Basic button group">
                        <Button onClick={() => selectSex(2)} sx={{color: blue[700]}}>
                            <Male fontSize="large" />
                        </Button>
                        <Button onClick={() => selectSex(1)} sx={{color: pink[700]}}>
                            <Female fontSize="large" />
                        </Button>
                    </ButtonGroup>
                </Box>
            </PageWrapper>
        </React.Fragment>
    );
};
