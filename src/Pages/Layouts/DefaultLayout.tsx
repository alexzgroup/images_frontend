import React, {useEffect, useState} from 'react';
import LabelBottomNavigation from "../../components/LabelBottomNavigation";
import {Box, Paper} from "@mui/material";
import {TLang} from "../../types/LangType";
import {Lang} from "../../lang/en";
import {useDispatch, useSelector} from "react-redux";
import {hideAppLoading, ReduxSliceStatusesInterface} from "../../redux/slice/AppStatusesSlice";
import {useTelegram} from "../../context/TelegramProvider";
import {initUserApiType} from "../../types/ApiTypes";
import {setFavoriteImageTypes, setPopularImageTypes} from "../../redux/slice/ImageSlice";
import {setUserDbData} from "../../redux/slice/UserSlice";
import {DEV_USER_VK_IDS} from "../../constants/UserConstants";
import {LangEnum} from "../../enum/LangEnum";
import {Outlet, useLoaderData, useLocation, useNavigate} from 'react-router-dom';
import {RootStateType} from "../../redux/store/ConfigureStore";
import {AppContext} from "../../context/AppContext";
import '../../assets/css/style.scss'
import {createTheme, ThemeProvider} from '@mui/material/styles';
import PagePreloader from "../../components/PagePreloader";
import {useModalPage} from "../../context/ModalProvider";
import ScrollToTop from "../../helpers/ScrollToTop";

const DefaultLayout: React.FC  = () => {
    const { userTg, webApp} = useTelegram();
    const {popular_image_types, user, favorite_image_types} = useLoaderData() as initUserApiType;
    const [lang, setLang] = useState<TLang>(Lang);
    const {appIsLoading} = useSelector<RootStateType, ReduxSliceStatusesInterface>(state => state.appStatuses)
    const {modal} = useModalPage();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const theme = createTheme({
        palette: {
            mode: webApp?.colorScheme || 'light',
        },
    });

    useEffect(() => {
            async function fetchData() {
                if (userTg) {
                    if (DEV_USER_VK_IDS.includes(userTg?.id)  && process.env.NODE_ENV === 'production') {
                        import("../../eruda").then(({ default: eruda }) => {});
                    }

                    if (userTg.language_code !== LangEnum.en && !DEV_USER_VK_IDS.includes(userTg?.id)) {
                        const language_code =  LangEnum[userTg.language_code] || LangEnum.en;
                        const {Lang}:{Lang: TLang} = await import('../../lang/' + language_code);
                        setLang(Lang);
                    }

                    dispatch(setUserDbData(user));
                    dispatch(setPopularImageTypes(popular_image_types));
                    dispatch(setFavoriteImageTypes(favorite_image_types));
                    dispatch(hideAppLoading());

                    if (!user.sex) {
                        navigate("/select-sex")
                    }
                }
            }
            fetchData();
    }, []);

    return (
        <AppContext.Provider value={{
            lang
        }}>
            <ThemeProvider theme={theme}>
                <Box sx={{ pb: (user.sex ? 'calc(50px + var(--safe-area-inset-bottom))' : 0) }}>
                    <ScrollToTop />
                        <Outlet/>
                    {
                        location.pathname !== '/select-sex' &&
                            <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0, pb: 'var(--safe-area-inset-bottom)'}} elevation={3}>
                                <LabelBottomNavigation/>
                            </Paper>
                    }
                    {
                        appIsLoading && <PagePreloader />
                    }
                    {modal}
                </Box>
            </ThemeProvider>
        </AppContext.Provider>
    )
}

export default DefaultLayout;
