import {Paper} from '@mui/material';
import React, {useContext, useEffect} from 'react';
import PageWrapper from "../components/PageWrapper";
import {AppContext, TAppContext} from "../context/AppContext";
import {useLoaderData} from "react-router-dom";
import {GeneratedImageType} from "../types/ApiTypes";
import TitlebarImageList from "../components/TitlebarImageList";
import {hideAppLoading} from "../redux/slice/AppStatusesSlice";
import {useDispatch} from "react-redux";

export default function HistoryImagesPage(){
    const {lang} = useContext<TAppContext>(AppContext);
    const history_generate = useLoaderData() as GeneratedImageType[];
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(hideAppLoading())
    }, []);

    return (
        <React.Fragment>
            <PageWrapper title={lang.HEADERS.HISTORY_PANEL} back>
                <Paper square elevation={0} sx={{my: 1}}>
                    <TitlebarImageList history_generate={history_generate} />
                </Paper>
            </PageWrapper>
        </React.Fragment>
    );
};
