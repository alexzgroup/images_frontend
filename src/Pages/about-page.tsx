import {Avatar, Card, CardActions, CardHeader, Link, Paper, Typography} from '@mui/material';
import React, {useContext} from 'react';
import PageWrapper from "../components/PageWrapper";
import {AppContext, TAppContext} from "../context/AppContext";
import girl_image from '../assets/images/icons/girl_icon.png';
import {useSelector} from "react-redux";
import {RootStateType} from "../redux/store/ConfigureStore";
import {ReduxSliceUserInterface} from "../redux/slice/UserSlice";
import {UrlConstants} from "../constants/UrlConstants";
import VipPageBanner from "../components/RenestraVip/VipPageBanner";

const AboutPage: React.FC = () => {
    const {lang} = useContext<TAppContext>(AppContext);
    const {userDbData} = useSelector<RootStateType, ReduxSliceUserInterface>(state => state.user)

    return (
        <React.Fragment>
            <PageWrapper title={lang.HEADERS.ABOUT_PANEL}>
                <Card square elevation={3}>
                    <CardHeader
                        avatar={
                            <Avatar
                                src={girl_image}
                                variant="rounded" />
                        }
                        title={lang.TITLES.ABOUT_PANEL_APP_NAME}
                        subheader={lang.TITLES.ABOUT_PANEL_SUBTITLE}
                    />
                    <CardActions>
                        <Typography color="textSecondary" variant="caption" component="div">
                            {lang.DESCRIPTIONS.ABOUT_PANEL_AI_DESCRIPTION}<br />{lang.DESCRIPTIONS.ABOUT_PANEL_POLITIC_START} {" "}
                            <Link underline="none" target='_blank' href={UrlConstants.URL_POLITIC}>{lang.DESCRIPTIONS.ABOUT_PANEL_POLITIC}</Link>
                            {" "} и {" "}
                            <Link underline="none" target='_blank' href={UrlConstants.URL_RULE_APP}>{lang.DESCRIPTIONS.ABOUT_PANEL_RULES}</Link>.
                        </Typography>
                    </CardActions>
                </Card>
                {
                    !userDbData?.is_vip &&
                    <Paper square sx={{my: 2}} elevation={2}>
                        <VipPageBanner />
                    </Paper>
                }
            </PageWrapper>
        </React.Fragment>
    );
};

export default AboutPage;
